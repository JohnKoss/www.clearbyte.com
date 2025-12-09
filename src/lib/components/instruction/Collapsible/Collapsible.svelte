<script lang="ts">
  import { type Attrs } from './model';
  import { onMount } from 'svelte';

  const { attrs, closeModal } = $props<{
    attrs: Attrs;
    closeModal: (attrs: Attrs | null) => void;
  }>();

  const copyAttrs = $state<Attrs>({
    cbid: attrs.cbid,
    title: attrs.title,
    content: attrs.content,
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
    if (copyAttrs.title.trim() === '') {
      showAlertWithTimeout('Collapse title cannot be empty.');
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

  <h3 class="text-lg font-bold">Collapse #{Number(copyAttrs.cbid) + 1}</h3>
  <div class="divider"></div>
  <div class="form-control mb-4">
    <label for="title" class="label">Title</label>
    <input
      type="text"
      class="input input-primary input-sm w-full"
      placeholder="Enter title here..."
      bind:value={copyAttrs.title}
      title="The title that will be displayed to the user"
    />
    <label for="content" class="label mt-4">Content</label>
    <textarea
      id="content"
      class="textarea textarea-primary w-full font-mono"
      rows="10"
      placeholder="Enter collapsible content here..."
      bind:value={copyAttrs.content}
      title="The collapsible content with formatting preserved"
    ></textarea>
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
