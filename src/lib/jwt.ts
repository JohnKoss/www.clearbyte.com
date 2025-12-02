function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

function readJWT(): string | null {
    const el = document.getElementById('jwt') as HTMLTemplateElement | null;
    if (!el) return null;
    const raw = el.content?.textContent ?? '';
    const token = raw.trim();
    return token.length ? token : null;
}

export async function waitForJWT({
    timeoutMs = 60.000,
    pollMs = 500,
} = {}): Promise<string | null> {
    const start = Date.now();
    while (Date.now() - start <= timeoutMs) {
        const jwt = readJWT();
        if (jwt) return jwt;
        await sleep(pollMs);
    }
    return null; // timed out
}