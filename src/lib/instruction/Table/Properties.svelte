<script lang="ts">

export let handleTablePropertiesSave = (p0?: { tableWidth: string; borderStyle: string; backgroundColor: string; textAlignment: string; padding: string; }) => {};

  // Svelte component script
  let tableWidth = '';
  let borderStyle = 'None';
  let backgroundColor = '#ffffff';
  let textAlignment = 'Left';
  let padding = '';

  // Save Changes handler
  function saveChanges() {
    handleTablePropertiesSave({
      tableWidth,
      borderStyle,
      backgroundColor,
      textAlignment,
      padding,
    });
    // You can add further logic to apply these changes to a table.
  }


</script>

<!-- DaisyUI Form to Edit Table Properties -->
<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold mb-4">Edit Table Properties</h2>
  <form on:submit|preventDefault={saveChanges}>
    <div class="form-control mb-4">
      <label class="label">
        <span class="label-text">Table Width</span>
      </label>
      <input
        type="text"
        placeholder="e.g., 100%"
        class="input input-bordered w-full"
        bind:value={tableWidth}
      />
    </div>

    <div class="form-control mb-4">
      <label class="label">
        <span class="label-text">Border Style</span>
      </label>
      <select class="select select-bordered w-full" bind:value={borderStyle}>
        <option>None</option>
        <option>Solid</option>
        <option>Dashed</option>
        <option>Dotted</option>
      </select>
    </div>

    <div class="form-control mb-4">
      <label class="label">
        <span class="label-text">Background Color</span>
      </label>
      <input
        type="color"
        class="input input-bordered w-full"
        bind:value={backgroundColor}
      />
    </div>

    <div class="form-control mb-4">
      <label class="label">
        <span class="label-text">Text Alignment</span>
      </label>
      <select class="select select-bordered w-full" bind:value={textAlignment}>
        <option>Left</option>
        <option>Center</option>
        <option>Right</option>
      </select>
    </div>

    <div class="form-control mb-4">
      <label class="label">
        <span class="label-text">Padding</span>
      </label>
      <input
        type="text"
        placeholder="e.g., 10px"
        class="input input-bordered w-full"
        bind:value={padding}
      />
    </div>
    <button class="btn btn-primary w-full" type="submit">Save Changes</button>
  </form>
</div>
