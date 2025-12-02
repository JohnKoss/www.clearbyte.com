import { readable, writable, derived, type Readable, get } from 'svelte/store';
import { browser } from '$app/environment';

export interface IAnalysis {
    lab_id: string;
    lab_name: string;
};

//const PING_QA = { action: "PING" };
const VALIDATE = {
    action: "validate", // This matches your route key
    payload: {
        labId: "12345",
        userToken: "abcde"
    }
};

type Status = 'idle' | 'connecting' | 'connected' | 'closed' | 'error';
type Options = {
    url: string;
    protocols?: string[];  // JWT via Sec-WebSocket-Protocol
    reconnect?: boolean;
};

let ws: WebSocket | null = null;
let _opts: Options | null = null;
let _heartbeat: ReturnType<typeof setInterval> | null = null;
let _retries = 0;

const status = writable<Status>('idle');
const analysis = writable<IAnalysis[] | null>(null);


// expose a readable 'connected' boolean
const connected: Readable<boolean> = readable(false, (set) => {
    const unsub = status.subscribe((s) => set(s === 'connected'));
    return () => unsub();
});

// Send helper (no-throw; returns boolean)
function send(data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean {
    if (ws && ws.readyState === WebSocket.OPEN) {
        try { ws.send(data); return true; } catch { }
    }
    return false;
}

function startHeartbeat() {
    stopHeartbeat();
    _heartbeat = setInterval(() => {
        if (!ws || ws.readyState !== WebSocket.OPEN) return;
        // Send a JSON ping so the server can echo back with same id
        send(JSON.stringify(VALIDATE));
        // The reply handler below will compute RTT when it sees type: 'pong'
    }, 10000);
}

function stopHeartbeat() {
    if (_heartbeat) { clearInterval(_heartbeat); _heartbeat = null; }
}

function handleOpen() {
    _retries = 0;
    status.set('connected');
    startHeartbeat();

}

function handleClose() {
    status.set('closed');
    stopHeartbeat();
    if (_opts?.reconnect) {
        // simple backoff
        const delay = Math.min(500 * 2 ** _retries, 8000);
        _retries++;
        setTimeout(() => connect(_opts!), delay);
    }
}

function handleError() {
    status.set('error');
}

function handleMessage(ev: MessageEvent) {

    let strData: unknown = ev.data;
    if (typeof strData !== 'string' || strData.length === 0) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ws message: empty payload @@@@@@@@@@@@@@@@');
        return;
    }

    const payload = JSON.parse(strData);
    console.log('ws message payload', payload);

    if (!Array.isArray(payload)) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ws message: not an array @@@@@@@@@@@@@@@@');
        return;
    }

    analysis.set(payload as IAnalysis[]);

    // Now this will reflect the update (note: devtools logs are "live"; for a snapshot use structuredClone)
    const analysisNow = get(wsStore.analysis);
    console.log('analysis snapshot', structuredClone(analysisNow));
}

// export const activeLabFor = (userId: string) =>
//     derived(analysis, (list): IAnalysis | null =>
//         list?.find(a => a.user_id === userId) ?? null
//     );

// Public API: connect/disconnect/sendPing
function connect(opts: Options) {
    if (!browser) return; // SSR guard
    _opts = { reconnect: true, ...opts };

    // if already open to same endpoint, noop
    if (ws && ws.readyState === WebSocket.OPEN) return;

    status.set('connecting');
    ws?.close();
    ws = new WebSocket(opts.url, opts.protocols ? opts.protocols : undefined);

    ws.addEventListener('open', handleOpen);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('error', handleError);
    ws.addEventListener('close', handleClose);
}

function disconnect(code = 1000, reason = 'client disconnect') {
    _opts = null;
    stopHeartbeat();
    if (ws) {
        const ref = ws;
        ws = null;
        try { ref.close(code, reason); } catch { }
    }
    status.set('closed');
}

function sendPing() {
    const ok = send(JSON.stringify(VALIDATE));
    return ok;
}

export const wsStore = {
    // stores to subscribe to in any component:
    status,           // 'idle' | 'connecting' | 'connected' | 'closed' | 'error'
    connected,        // boolean derived
    analysis,       // IAnalysis[] | null 

    // actions:
    connect,
    disconnect,
    send,
    sendPing
};









////////////////////////




// src/lib/ws.ts
export type WSOpts = {
    url: string;                 // ws:// or wss://
    protocols?: string | string[];
    onOpen?: (ev: Event) => void;
    onMessage?: (ev: MessageEvent) => void;
    onClose?: (ev: CloseEvent) => void;
    onError?: (ev: Event) => void;
    // reconnect/backoff
    autoReconnect?: boolean;
    maxRetries?: number;         // 0 = never, Infinity = always
    backoffBaseMs?: number;      // initial retry delay
    backoffMaxMs?: number;       // cap delay
    // heartbeat
    heartbeatMs?: number;        // 0/undefined to disable
    heartbeatPayload?: string | ArrayBufferLike | Blob | ArrayBufferView;
};

export function createWebSocket(opts: WSOpts) {
    const {
        url,
        protocols,
        onOpen,
        onMessage,
        onClose,
        onError,
        autoReconnect = true,
        maxRetries = Infinity,
        backoffBaseMs = 500,
        backoffMaxMs = 8000,
        heartbeatMs = 2500,
        heartbeatPayload = VALIDATE,
    } = opts;

    let ws: WebSocket | null = null;
    let retries = 0;
    let heartbeatTimer: any = null;
    let manualClose = false;

    const connect = () => {
        ws = new WebSocket(url, protocols);

        ws.addEventListener('open', (ev) => {
            retries = 0;
            if (heartbeatMs && heartbeatMs > 0) {
                heartbeatTimer = setInterval(() => {
                    if (ws?.readyState === WebSocket.OPEN) {
                        try { ws.send(heartbeatPayload as any); } catch { }
                    }
                }, heartbeatMs);
            }
            onOpen?.(ev);
        });

        ws.addEventListener('message', (ev) => onMessage?.(ev));
        ws.addEventListener('error', (ev) => onError?.(ev));

        ws.addEventListener('close', (ev) => {
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
            onClose?.(ev);

            if (!manualClose && autoReconnect && retries < maxRetries) {
                const delay = Math.min(backoffBaseMs * 2 ** retries, backoffMaxMs);
                retries++;
                setTimeout(connect, delay);
            }
        });
    };

    connect();

    return {
        send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
            if (ws?.readyState === WebSocket.OPEN) ws.send(data);
            else throw new Error('WebSocket not open');
        },
        close(code?: number, reason?: string) {
            manualClose = true;
            clearInterval(heartbeatTimer);
            heartbeatTimer = null;
            ws?.close(code, reason);
        },
        get readyState() {
            return ws?.readyState ?? WebSocket.CLOSED;
        }
    };
}


// function handleMessage(ev: MessageEvent) {

//     let payload: unknown = ev.data;
//     try { if (typeof payload === 'string') payload = JSON.parse(payload); } catch { }
//     const updates = (Array.isArray(payload) ? payload : []) as IActiveLab[];

//     classStore.update((c) => {
//         const users = { ...c.users }; // new map

//         for (const ws of updates) {
//             const id = ws.user_id;
//             if (!id || !users[id]) continue;

//             const prev = users[id] as any;
//             prev.activeLab = {
//                 is_active: ws.is_active,
//                 is_connected: ws.is_connected,
//                 state: ws.state,
//                 state_desc: ws.state_desc,
//                 time: ws.time,
//                 acct_id: ws.acct_id,
//                 acct_alias: ws.acct_alias,
//                 attempts_remaining: ws.attempts_remaining,
//                 duration: ws.duration,
//                 lab_id: ws.lab_id,
//                 lab_name: ws.lab_name

//              }; // new map

//             // Merge updates (only those present in ws)

//             // users[id] = {
//             //     ...prev,
//             //     ...(ws.IsActive !== undefined ? { isActive: ws.IsActive } : {}),
//             //     ...(ws.IsConnected !== undefined ? { isConnected: ws.IsConnected } : {}),
//             //     ...(ws.State !== undefined ? { state: ws.State } : {}),
//             //     ...(ws.StateDesc !== undefined ? { stateDesc: ws.StateDesc } : {}),
//             //     ...(ws.Time !== undefined ? { time: ws.Time } : {}),
//             //     ...(ws.AcctId !== undefined ? { acctId: ws.AcctId } : {}),
//             //     ...(ws.Attempts !== undefined ? { attempts: ws.Attempts } : {}),
//             //     ...(ws.Duration !== undefined ? { duration: ws.Duration } : {}),
//             // };
//             users[id] = prev; // <-- mutate the provided copy
//         }

//         c.users = users; // <-- mutate the provided copy
//     });

//     // Now this will reflect the update (note: devtools logs are "live"; for a snapshot use structuredClone)
//     const usersNow = get(classStore.data)?.users;
//     console.log('users snapshot', structuredClone(usersNow));
// }
