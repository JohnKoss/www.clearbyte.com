<!-- <script lang="ts">
  import MultipleSelect from "./MultipleSelect.svelte";
  import { json } from "@codemirror/lang-json";
  import CodeMirror from "svelte-codemirror-editor";

  export const show = () => {
    dialog.showModal();
  };

  let dialog: HTMLDialogElement;

  ////////////

  let selectedOptions: string[] = [];
  const options = ["iam", "s3", "cloudwatch"];

  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      selectedOptions = selectedOptions.filter(
        (selected) => selected !== option,
      );
    } else {
      selectedOptions = [...selectedOptions, option];
    }
  };

  const handleSelect = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    selectedOptions = Array.from(selectElement.selectedOptions).map(
      (option) => option.value,
    );
  };

  const removeOption = (option: string) => {
    selectedOptions = selectedOptions.filter((selected) => selected !== option);
  };

  const handleSave = (): void => {
    console.debug("Selected Options:", selectedOptions);
    // Add your save logic here
  };

  let value: string = `"resource "config" "services" {
  services {
    create = ["iam"]
    delete = [
      "iam",
      "s3",
      "cloudwatch",
    ]
    snapshot = ["s3"]
  }
}`;
  let view: any;
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
    <div class="p-4">
      <form on:submit|preventDefault={handleSave} class="space-y-4">
        <h2 class="text-lg font-bold">Resource Configuration</h2>
        <div class="flex flex-col items-center mt-4">
          <label for="resourceName" class="mb-2">Resource Name:</label>
          <input
            type="text"
            id="resourceName"
            name="resourceName"
            class="input input-bordered w-full max-w-xs"
          />
        </div>
    
        <div class="flex justify-center space-x-4">
        <MultipleSelect label={"'Create'"} />
        <MultipleSelect label={"'Delete'"} />
        <MultipleSelect label={"'Snapshot'"} />
    </div>
        <div class="mt-4">
          {#each selectedOptions as option}
            <span class="badge badge-primary mr-2 mb-2">
              {option}  
              <button
                type="button"
                class="ml-2"
                onclick={() => removeOption(option)}>x</button
              >
            </span>
          {/each}
        </div>

        <hr />

        <CodeMirror
        bind:value
        readonly={true}
        editable={false}
        lang={json()}
        placeholder="Initializing...."
        on:ready={(e) => (view = e.detail)}
      />

        <button type="submit" class="btn btn-primary">Save</button>
      </form>
    </div>
  </div>
</dialog> -->
