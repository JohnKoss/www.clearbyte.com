<svelte:options runes={true} />

<script lang="ts">
  import { onMount } from 'svelte';
  import { wsStore } from '../../ws';
  import { waitForJWT } from '../../jwt'; // Assuming you have a jwt export from your auth module
  //import { Api, type IMessageResults } from '$components/old_api.svelte.ts.old';
  import { Api, type IPostResults } from '$lib/api';

  const URL_ADMIN = import.meta.env.VITE_PUBLIC_API_PATH + '/admin/qa/validate';
  const WS_URL = 'wss://ws.clearbyte.io';

  let waitingForResults = $state(false);
  let loading = $state(false);

  onMount(() => {
    // Simulate some analysis work with a timeout
    setTimeout(async () => {
      console.log('Starting WebSocket connection for analysis...');
      const jwt = await waitForJWT(); // waits up to 1 minute
      if (!jwt) {
        wsStore.disconnect();
        console.log('No JWT found within 1 minute, giving up');
        return { ok: false, reason: 'timeout' } as const;
      }

      // NOTE: if your wsStore expects `protocol` (not `protocols`), use that.
      wsStore.connect({
        url: WS_URL,
        protocols: [jwt, 'admin'], // Sec-WebSocket-Protocol
        reconnect: true,
      });
    }, 1000); // 1 second delay
  });

  const validate: any = async () => {
    try {
      //let api = new Api('admin/qa');
      //api.appendUrl('qa/validate');
      //let res: any | undefined = await api.POST<any>();
      loading = true;
      const url = new URL(URL_ADMIN);
      const api = new Api(url);
      const res = await api.Post<IPostResults>();
      if (res.ok) {
        console.log('Validation successful:', res);
        waitingForResults = true;
      } else {
        console.error('Validation failed:', res.message);
      }
    } catch (error: any) {
      console.error('Error during validation:', error);
    } finally {
      loading = false;
    }
  };

  // Reset 'waitingForResults' after 5 seconds
  $effect(() => {
    if (waitingForResults) {
      const timer = setTimeout(() => {
        waitingForResults = false;
      }, 5000);
      return () => clearTimeout(timer);
    }
  });

</script>

<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <button
      onclick={validate}
      class="btn btn-primary"
      disabled={loading || waitingForResults}
    >
      {#if loading}
        <span class="loading loading-spinner"></span>
        Validating...
      {:else}
        Validate Lab Activity
      {/if}
    </button>
    {#if waitingForResults}
      <div class="alert alert-info mt-4">
        <span class="loading loading-spinner"></span>
        <div>
          <span>Validation in progress...</span>
        </div>
      </div>
    {/if}
  </div>
</div>
