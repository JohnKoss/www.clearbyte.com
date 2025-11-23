<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { metaData } from '../../routes/state.svelte';
  import { TabItems } from '../../routes/items.svelte';
  import {
    LAB_DURATION_MIN,
    LAB_DURATION_MAX,
    LAB_ATTEMPTS_MIN,
    LAB_ATTEMPTS_MAX,
    LAB_POINTS_MIN,
    LAB_POINTS_MAX,
    LAB_LEVEL_EASY,
    LAB_LEVEL_MEDIUM,
    LAB_LEVEL_HARD,
    type ILab,
    type ILabData,
    ConfigProps,
  } from './state.svelte';
  import { Api, type IMessageResults } from '$components/api.svelte';
  import Alert from '$lib/Alert.svelte';

  /////////////
  const { id, data }: { id: number; data: string } = $props();

  /////////////
  let cp = $state<ConfigProps>(new ConfigProps());

  const MAX_LAB_NAME_LENGTH = 128;
  const MAX_LAB_DESC_LENGTH = 1024;

  // Used to maintain state....
  let lastCP = '';
  let lastData = '';

  onMount(() => (lastCP = JSON.stringify(cp)));
  $effect(() => {
    // Empty data....
    console.log('Data:....');
    if (data === '{}') {
      cp.id = metaData.customClaims.lab_id;
      cp.name = metaData.customClaims.lab_name;
      cp.attempts = 3;
      cp.points = 10;
      cp.duration = 3600;
      cp.level = '1';
    }

    // Data change (empty or otherwise)....
    if (lastData !== data) {
      lastData = data;
      cp = JSON.parse(data);
    }

    // CP Change....
    const strCP = JSON.stringify(cp);
    if (lastCP !== strCP) {
      lastCP = strCP;
      TabItems[id].data = lastCP;
    }
  });

  //////////////
  let placeholder = 'Lab Level';
  let levels = [
    LAB_LEVEL_EASY.toString(),
    LAB_LEVEL_MEDIUM.toString(),
    LAB_LEVEL_HARD.toString(),
  ];

  /////////////
  function formatDuration(): string {
    const hrs = Math.floor(cp.duration / 3600);
    const mins = Math.floor((cp.duration % 3600) / 60);
    const secs = cp.duration % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /////
  let hours = $state<number>(0);
  let minutes = $state<number>(0);
  let seconds = $state<number>(0);
  let showConverter = $state(false);
  const convertToSeconds = (e: Event) => {
    e.preventDefault();
    hours = Math.floor(cp.duration / 3600); // Get hours
    minutes = Math.floor((cp.duration % 3600) / 60); // Get minutes
    seconds = cp.duration % 60; // Get seconds
    showConverter = true;
    setTimeout(() => {
      document.getElementById('first-input')?.focus(); // Focus input after modal opens
    }, 10);
  };

  // /////
  const converterClose = () => {
    showConverter = false;
    cp.duration = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  };

  //////////////
  let isExporting = $state(false);
  let isImporting = $state(false);

  let alertShow = $state(false);
  let alertType = $state('success');
  let alertMsg = $state('');

  const showAlert = (at: string, am: string) => {
    alertType = at;
    alertMsg = am;
    alertShow = true;
    setTimeout(() => {
      alertShow = false;
    }, 2000);
  };

  ////////
  let exportLabName = $state<string | null>(null);
  let exportUrl = $state<string | null>(null);
  const exportContent: any = async () => {
    isExporting = true;
    try {
      let api = new Api();
      api.appendUrl('export');
      let res: any | undefined = await api.POST<any>();
      if (res.ok) {
        const obj = JSON.parse(res.message);
        exportLabName = obj.name;
        exportUrl = obj.url;
      } else {
        alert('Error: Lab activity not exported!');
      }
    } catch (error: any) {
      showAlert('error', error);
    } finally {
      isExporting = false;
    }
  };

  //////////////
  let showExports = $state(false);
  let exportedLabs = $state<Map<string, ILab>>(new Map());
  ///
  const importContent: any = async (evt: Event) => {
    evt.preventDefault();
    isImporting = true;
    try {
      let api = new Api();
      api.appendUrl('export/list');
      let res = await api.GET<any>();
      if (res.ok) {
        const parsedLabData: ILabData = JSON.parse(res.message);
        exportedLabs = new Map(Object.entries(parsedLabData));
        showExports = true;
      } else {
        alert('Error: Lab activities not available to import!');
      }
    } catch (error: any) {
      showAlert('error', error);
    } finally {
      isImporting = false;
    }
  };
  ///////////
  const exportChosen = async (evt: Event, labId: string) => {
    evt.preventDefault();
    showExports = false;
    try {
      let api = new Api();
      api.appendUrl('import');
      api.url.searchParams.append('lab_id', labId);
      let res = await api.GET<IMessageResults>();
      if (res.ok) {
        const dataItems = JSON.parse(res.message) as string[];
        Object.keys(dataItems).forEach((key) => {
          TabItems[parseInt(key)].data = dataItems[parseInt(key)];
        });
      } else {
        alert('Error: Lab activity not imported!');
      }
    } catch (error: any) {
      showAlert('error', error);
    } finally {
      isImporting = false;
    }
  };
</script>

<dialog class="modal {showConverter ? 'modal-open' : ''}">
  <div class="modal-box max-w-sm">
    <h3 class="text-lg font-bold">Convert to Seconds</h3>
    <label class="form-control w-full max-w-sm mb-4">
      <div class="label">
        <span class="label-text">HH : MM : SS</span>
      </div>
      <div class="join">
        <!-- svelte-ignore a11y_autofocus -->
        <input
          id="first-input"
          bind:value={hours}
          type="number"
          min="0"
          max="4"
          class="input xinput-bordered join-item input-xs w-16"
          placeholder="00"
        />
        <span>&nbsp;:&nbsp;</span>
        <input
          bind:value={minutes}
          type="number"
          min="0"
          max="59"
          class="input xinput-bordered join-item input-xs w-16"
          placeholder="00"
        />
        <span>&nbsp;:&nbsp;</span>
        <input
          bind:value={seconds}
          type="number"
          min="0"
          max="59"
          class="input xinput-bordered join-item input-xs w-16"
          placeholder="00"
        />
      </div>
    </label>

    <div class="modal-action">
      <form method="dialog">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn primary" onclick={converterClose}>OK</button>
        <button class="btn primary" onclick={() => (showConverter = false)}
          >Cancel</button
        >
      </form>
    </div>
  </div>
</dialog>

<dialog class="modal {showExports ? 'modal-open' : ''}">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Exported Lab Activities</h3>
    <div class="m-8">
      {#each [...exportedLabs] as [key, value]}
        <div class="flex items-center gap-3 p-2 odd:bg-white even:bg-slate-100">
          <div class="font-bold">
            <!-- svelte-ignore a11y_invalid_attribute -->
            <a
              class="text-sky-600"
              href="#"
              title={key}
              onclick={(e) => exportChosen(e, key)}>{value.name}</a
            >&nbsp;
          </div>
          <div class="text-sm opacity-70">
            {@html value.desc}
          </div>
          <p class="text-xs">{value.points} pts.</p>
        </div>
      {/each}
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn" onclick={() => (showExports = false)}
            >Close</button
          >
        </form>
      </div>
    </div>
  </div>
</dialog>

<div class="mx-auto bg-white pl-4 pb-4">
  <div class="mb-4">
    {#if alertShow}
      <Alert type={alertType} message={alertMsg} />
    {/if}
  </div>

  <form>
    <fieldset class="fieldset pl-4 pb-4">
      <p class="text-sm pb-4 text-gray-400">"{cp.id}"</p>
      <label for="i1" class="fieldset-label"
        >Name - <span class="label-text-alt"
          >Maximum of <span class="text-rose-600">{MAX_LAB_NAME_LENGTH}</span> characters.</span
        ></label
      >
      <input
        id="i1"
        type="text"
        class="input mb-2"
        bind:value={cp.name}
        placeholder="Name"
        min="1"
        max={MAX_LAB_NAME_LENGTH}
        required
      />

      <!-- Add a name description -->
      <label for="t1" class="fieldset-label"
        >Description - <span class="label-text-alt"
          >Maximum of <span class="text-rose-600">{MAX_LAB_DESC_LENGTH}</span> characters.</span
        ></label
      >
      <textarea
        id="t1"
        class="textarea mb-2"
        bind:value={cp.desc}
        placeholder={"Please add a description for '" + cp.name + "'"}
        minlength="1"
        maxlength={MAX_LAB_DESC_LENGTH}
        required
      ></textarea>

      <!-- Add an attempts field -->
      <label for="i2" class="fieldset-label">Attempts</label>
      <input
        id="i2"
        type="number"
        class="input mb-2"
        bind:value={cp.attempts}
        min={LAB_ATTEMPTS_MIN.toString()}
        max={LAB_ATTEMPTS_MAX.toString()}
        placeholder="Attempts"
        required
      />

      <!-- Add an points field -->
      <label for="i3" class="fieldset-label">Points</label>
      <input
        id="i3"
        type="number"
        class="input mb-2"
        bind:value={cp.points}
        min={LAB_POINTS_MIN.toString()}
        max={LAB_POINTS_MAX.toString()}
        placeholder="Points"
        required
      />

      <!-- Duration Field -->
      <label for="i4" class="fieldset-label"
        >Duration (seconds)
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="#" class="link link-primary" onclick={convertToSeconds}>
          {formatDuration()}
        </a>
      </label>
      <input
        id="i4"
        type="number"
        class="input mb-2"
        bind:value={cp.duration}
        min={LAB_DURATION_MIN.toString()}
        max={LAB_DURATION_MAX.toString()}
        placeholder="Duration"
        required
      />

      <!-- Level Field -->
      <label for="s1" class="fieldset-label">Level (difficulty)</label>
      <select id="s1" class="select mb-2" bind:value={cp.level} required>
        {#if placeholder}
          <option value="" disabled selected>{placeholder}</option>
        {/if}
        {#each levels as level}
          <option value={level}>{level}</option>
        {/each}
      </select>

      <div class="label-text-alt text-xs text-red-500">
        <p>
          All fields are required. Changes to 'Attempts' or 'Duration' will not
          effect users who have already viewed or attempted this activity.
        </p>
      </div>
    </fieldset>
  </form>
  <div class="divider w-full max-w-xl">Lab Activity Import/Export</div>

  <fieldset
    class="fieldset bg-base-100 w-xs  pl-4"
  >
    
    <div class="join">
      <button class="btn btn-info join-item border-white" onclick={importContent}>
      {#if isImporting}
        <span class="loading loading-spinner"></span>
      {/if}
      Import</button
      >

      <button class="btn btn-info join-item border-white" onclick={exportContent}>
      {#if isExporting}
        <span class="loading loading-spinner"></span>
      {/if}
      Export</button
      >
    </div>
    <p class="label">Please save lab activities before export</p>
  </fieldset>
  {#if exportUrl}
    <div class="mt-4 text-sm">
      Click to download:
      <a
      title="click to download"
      class="link link-info font-bold"
      href={exportUrl}>{exportLabName}</a
      >
    </div>
  {/if}
</div>
