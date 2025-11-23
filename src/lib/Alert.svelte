<script>
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  export let message = 'Success!'; // Default message
  export let type = 'alert-success'; // DaisyUI: alert-success, alert-error, alert-warning, alert-info
  export let autoClose = false;      // true = fade away after 3s

  let visible = true;

  onMount(() => {
    if (autoClose) {
      setTimeout(() => {
        visible = false;
      }, 3000);
    }
  });

  function closeAlert() {
    visible = false;
  }
</script>

{#if visible}
<div class="alert {type}" transition:fade={{ duration: 300 }}>
  <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>{message}</span>
  <button class="btn btn-sm btn-circle btn-ghost ml-auto" on:click={closeAlert}>✕</button>
</div>
{/if}
