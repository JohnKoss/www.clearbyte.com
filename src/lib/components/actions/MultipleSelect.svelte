<script lang="ts">
  import { onMount } from "svelte";

  export let label: string;
  interface Option {
    name: string;
    enabled: boolean;
  }

  let options: Option[] = [
    { name: "iam", enabled: true },
    { name: "s3", enabled: false },
    { name: "cloudwatch", enabled: true },
  ];

  onMount(() => {
    updateSelectedOptions();
  });

  let selectedOptions: string[] = [];
  const updateSelectedOptions = () =>
    (selectedOptions = options
      .filter((option) => option.enabled)
      .map((option) => option.name));

  const handleSave = (): void => {
    console.debug("Selected Options:", selectedOptions);
    // Add your save logic here
  };

  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      selectedOptions = selectedOptions.filter(
        (selected) => selected !== option,
      );
    } else {
      selectedOptions = [...selectedOptions, option];
    }

    // Update 'options' array
    options.forEach((opt) => {
      if (opt.name === option) {
        opt.enabled = !opt.enabled;
      }
    });
    options = [...options];
  };
</script>


<div class="dropdown dropdown-bottom">
  <div tabindex="0" role="button" class="btn m-1">{label}</div>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <ul
    tabindex="0"
    class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
  >
    {#each options as option}
      <div class="form-control">
        <li>
          <label class="label cursor-pointer">
            <span class="label-text">{option.name}</span>
            <input
              type="checkbox"
              checked={option.enabled}
              class="checkbox"
              onclick={() => handleOptionClick(option.name)}
            />
          </label>
        </li>
      </div>
    {/each}
  </ul>
</div>



<!-- <div id="bubba" class="mt-1">
  {#each selectedOptions as option}
    <span class="badge badge-primary mr-4 mb-2">
      {option}
      <button
        type="button"
        class="ml-2"
        onclick={() => handleOptionClick(option)}>x</button
      >
    </span>
  {/each}
</div> -->

