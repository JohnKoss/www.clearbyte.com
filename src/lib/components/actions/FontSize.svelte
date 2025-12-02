<script lang="ts">
  //   export function createFontSize() {
  //     let value: number = $state<number>(12);
  //     return {
  //       get value() {
  //         return value;
  //       },
  //       set value(v: number) {
  //         value = v;
  //       },
  //     };
  //   }

  let { show }: { show: boolean } = $props();
  

  $effect(() => {
    if (show) {
      dialog.show();
    } else {
      dialog.close();
    }
  });

  let dialog: HTMLDialogElement;
</script>

<dialog bind:this={dialog} class="modal">
  <div class="modal-box">
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >✕</button
        >
      </form>
    </div>
  </div>
</dialog>
