<script lang="ts">
  import Icon from "@iconify/svelte";
  import { type Attrs, type Option } from "./model";
  import { onMount } from "svelte";

  const { attrs, closeModal } = $props<{
    attrs: Attrs;
    closeModal: (attrs: Attrs | null) => void;
  }>();

  const copyAttrs = $state<Attrs>({
    qid: attrs.qid,
    type: attrs.type,
    questionText: attrs.questionText,
    points: attrs.points,
    options: attrs.options.map((option: any) => ({ ...option })),
  });

  let showAlert = $state<boolean>(false);
  let errorMessage = $state<string>("");
  let selectedOptionIndex = $state<number>(0);

  console.debug("MultipleSelect props:", attrs);
  //////////////////////////////////////////
  onMount(() => {
    selectedOptionIndex = attrs.options.findIndex(
      (option: Option) => option.selected,
    );
  });

  const onClose = (attrs: Attrs | null) => {
    if (!attrs) {
      closeModal(null);
      return;
    }

    // Validate the question
    if (copyAttrs.questionText.trim() === "") {
      showAlertWithTimeout("Question text cannot be empty.");
      return;
    }
    if (Number(copyAttrs.points) <= 0) {
      showAlertWithTimeout("Points must be greater than 0.");
      return;
    }
    if (copyAttrs.options.length < 2) {
      showAlertWithTimeout("You must have at least 2 options.");
      return;
    }
    if (
      copyAttrs.options.filter((option: Option) => option.selected).length !== 1
    ) {
      showAlertWithTimeout("You must select exactly one correct option.");
      return;
    }
    // If an option's text is empty, show an error message
    if (copyAttrs.options.some((option: Option) => option.text.trim() === "")) {
      showAlertWithTimeout("Option text cannot be empty.");
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

  const handleAddOption = () => {
    copyAttrs.options.push({ text: "", selected: false });
  };
  const handleRemoveOption = (index: number) => {
    if (copyAttrs.options.length <= 2) {
      showAlertWithTimeout("You must have at least 2 options.");
      return;
    }
    copyAttrs.options.splice(index, 1);
  };
  const handleUpOption = (index: number) => {
    if (index > 0) {
      const temp = copyAttrs.options[index - 1];
      copyAttrs.options[index - 1] = copyAttrs.options[index];
      copyAttrs.options[index] = temp;
    }
  };
  const handleDownOption = (index: number): any => {
    if (index < copyAttrs.options.length - 1) {
      const temp = copyAttrs.options[index + 1];
      copyAttrs.options[index + 1] = copyAttrs.options[index];
      copyAttrs.options[index] = temp;
    }
  };
  const handleOptionSelected = (index: number) => {
    selectedOptionIndex = index;
    copyAttrs.options.forEach((option: Option, i: number) => {
      option.selected = i === index;
    });
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
  <h3 class="text-lg font-bold">Question #{Number(copyAttrs.qid) +1}</h3>
  <div class="divider"></div>
  <div class="form-control mb-4">
    <label for="question" class="label">Question Text</label>
    <textarea
      class="textarea textarea-primary textarea-sm w-full"
      placeholder="Enter your text here..."
      bind:value={copyAttrs.questionText}
      title="The question text that will be displayed to the user"
    ></textarea>
  </div>
  <div class="form-control mb-4">
    <label for="points" class="label">Total Points</label>
    <input
      id="points"
      type="number"
      bind:value={copyAttrs.points}
      min="0"
      placeholder="Enter the total points"
      class="input input-bordered input-primary input-sm w-full"
      title="Total points for this question"
    />
  </div>

  <div class="flex items-center justify-between mb-4">
    <h3>Options:</h3>
    <button
      onclick={handleAddOption}
      title="Add new option"
      class="btn btn-success"
    >Add Option
    </button>
  </div>

  <div class="overflow-x-auto">
    <div class="max-h-96 overflow-y-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th class="w-1/2 bg-primary text-white">Text</th>
            <th colspan="2" class="w-1/4 bg-primary text-white">Arrange</th>
          </tr>
        </thead>
        <tbody>
          {#each copyAttrs.options as option, index}
            <tr>
              <td class="w-1/2">
                <textarea
                  class="textarea textarea-bordered textarea-xs w-full"
                  bind:value={option.text}
                  placeholder="Option text"
                ></textarea>
              </td>

              <td>
                <div class="flex space-x-1">
                  <button
                    onclick={() => handleUpOption(index)}
                    title="Move option up"
                    class="btn btn-primary btn-xs"
                    disabled={index === 0}
                  >
                    <Icon icon="mdi:arrow-up" height={18} />
                  </button>
                  <button
                    onclick={() => handleDownOption(index)}
                    title="Move option down"
                    class="btn btn-primary btn-xs"
                    disabled={index === copyAttrs.options.length - 1}
                  >
                    <Icon icon="mdi:arrow-down" height={18} />
                  </button>
                  <button
                    onclick={() => handleRemoveOption(index)}
                    title="Remove option"
                    class="btn btn-primary btn-xs"
                  >
                    <Icon icon="mdi:delete" height={18} />
                  </button>
                  <div class="form-control"></div>
                    <label class="label cursor-pointer">
                      <input
                        class="radio radio-xs checked:bg-blue-500"
                        type="radio"
                        name="selectedOption"
                        value={index}
                        bind:group={selectedOptionIndex}
                        onchange={() => handleOptionSelected(index)}
                      />
                    </label>
                  </div>                
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      <!-- add ok and cancel buttons-->
      <div class="flex justify-end mt-4">
        <button
          class="btn btn-primary"
          onclick={() => onClose({ ...copyAttrs})}
        >
          OK
        </button>
        <button class="btn btn-secondary ml-2" onclick={() => onClose(null)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>
