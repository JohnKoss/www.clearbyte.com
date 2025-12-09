<script lang="ts">
  import { type Attrs } from './model';
  import { onMount } from 'svelte';

  const { attrs, closeModal } = $props<{
    attrs: Attrs;
    closeModal: (attrs: Attrs | null) => void;
  }>();

  const copyAttrs = $state<Attrs>({
    id: attrs.id,
    url: attrs.url,
  });

  let showAlert = $state<boolean>(false);
  let errorMessage = $state<string>('');

  //////////////////////////////////////////
  onMount(() => {});

  const onClose = (attrs: Attrs | null) => {
    if (!attrs) {
      closeModal(null);
      return;
    }

    // Validate the question
    if (copyAttrs.url.trim() === '') {
      showAlertWithTimeout('URL cannot be empty.');
      return;
    }
    closeModal(attrs);
  };

  const showAlertWithTimeout = (message: string) => {
    errorMessage = message;
    showAlert = true;
    setTimeout(() => {
      showAlert = false;
    }, 3000);
  };
</script>

<div class="modal-box">
  {#if showAlert}
    <div role="alert" class="alert alert-error mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{errorMessage}</span>
    </div>
  {/if}

  <h3 class="text-lg font-bold">Link</h3>
  <div class="divider"></div>
  <div class="form-control mb-4">
    <label for="title" class="label">Title</label>
    <input
      type="text"
      class="input input-primary input-sm w-full"
      placeholder="Enter URL here..."
      bind:value={copyAttrs.url}
      title="The URL that will be used for the link"
    />
    <label for="content" class="label mt-4">Content</label>
  </div>
  <!-- add ok and cancel buttons-->
  <div class="flex justify-end mt-4">
    <button class="btn btn-primary" onclick={() => onClose({ ...copyAttrs })}>
      OK
    </button>
    <button class="btn btn-secondary ml-2" onclick={() => onClose(null)}>
      Cancel
    </button>
  </div>
</div>
