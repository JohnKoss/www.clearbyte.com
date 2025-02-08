<script lang="ts">
  import { untrack } from 'svelte';
  import { metaData } from '../../routes/state.svelte';
  import { TabItems } from '../../routes/items.svelte';
  import { configState, type Props } from './state.svelte';
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
  } from './consts';
  import cx from 'clsx';
  import { Api } from '$components/api.svelte';
  import Alert from '$lib/Alert.svelte';

  const { id, data }: { id: number; data: string } = $props();

  export function flushData(): void {}

  /////////////
  $effect(() => {
    untrack(() => {
      // Keep 'configState' from causing a re-$effect loop.
      if (data !== '') configState.lab = JSON.parse(data) as Props;
      configState.lab.id = metaData.customClaims.lab_id;
      configState.lab.name = metaData.customClaims.lab_name;
    });
  });

  $effect(() => {
    TabItems[id].data = JSON.stringify(configState.lab);
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
    const hrs = Math.floor(configState.lab.duration / 3600);
    const mins = Math.floor((configState.lab.duration % 3600) / 60);
    const secs = configState.lab.duration % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /////
  let hours = $state<number>(0);
  let minutes = $state<number>(0);
  let seconds = $state<number>(0);
  let showConverter = $state(false);
  const convertToSeconds = (e: Event) => {
    e.preventDefault();
    hours = Math.floor(configState.lab.duration / 3600); // Get hours
    minutes = Math.floor((configState.lab.duration % 3600) / 60); // Get minutes
    seconds = configState.lab.duration % 60; // Get seconds
    showConverter = true;
    setTimeout(() => {
      document.getElementById('first-input')?.focus(); // Focus input after modal opens
    }, 10);
  };
  const converterClose = () => {
    showConverter = false;
    configState.lab.duration =
      (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
  };

  ////////////////////////////
  //////////////
  let isSaving = $state(false);

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
  const exportContent: any = async () => {
    isSaving = true;
    try {
      const newLabId = prompt('Enter a new value:');
      if (newLabId === null) {
        showAlert('error', 'No value entered.');
        return;
      }

      let api = new Api();
      api.url.searchParams.set('new_lab_id', newLabId);
      let res: any | undefined = await api.PUT<any>();
      if (res.ok) {
        showAlert('success', 'Activity SAVED!');
      } else {
        showAlert('error', res.message);
      }
    } catch (error: any) {
      showAlert('error', error);
    } finally {
      isSaving = false;
    }
  };
</script>

<dialog id="my_modal_1" class="modal {showConverter ? 'modal-open' : ''}">
  <div class="modal-box">
    <h3 class="text-lg font-bold">Convert to Seconds</h3>
    <label class="form-control w-full max-w-md mb-4">
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

{#if configState}
  <div class="mx-auto bg-white p-6">
    <div class="mb-4">
      {#if alertShow}
        <Alert type={alertType} message={alertMsg} />
      {/if}
    </div>

    <form>
      <div class="flex items-center gap-48">
        <h2
          class="text-xl font-bold mb-4"
          title={`LabID: ${configState.lab.id}`}
        >
          <em>"{configState.lab.name}"</em>
        </h2>

        <div class="join join-horizontal">
          <button
            class={cx('btn btn-secondary border-amber-300 join-item', {
              'loading loading-spinner': isSaving,
            })}>Import</button
          >
          <button class="btn btn-secondary border-amber-300 join-item" onclick={exportContent}
            >Export</button
          >
        </div>
      </div>

      <fieldset
        class="fieldset bg-base-200 border border-base-300 p-4 rounded-box w-full max-w-md"
      >
        <legend class="fieldset-legend">Configuration details</legend>
        <!-- Add a name description -->
        <label class="form-control w-full max-w-md mb-4">
          <div class="label">
            <span class="label-text">Description</span>
          </div>
          <textarea
            class="textarea textarea-bordered w-full"
            bind:value={configState.lab.desc}
            placeholder={"Please add a description for '" +
              configState.lab.name +
              "'"}
            required
          ></textarea>
        </label>

        <div class="flex space-x-2">
          <!-- Add an points field -->
          <label class="form-control max-w-md mb-4">
            <div class="label">
              <span class="label-text">Points</span>
            </div>
            <input
              type="number"
              class="input input-bordered"
              bind:value={configState.lab.points}
              min={LAB_POINTS_MIN.toString()}
              max={LAB_POINTS_MAX.toString()}
              placeholder="Points"
              required
            />
          </label>

          <!-- Add a level field -->
          <label class="form-control mb-4">
            <div class="label">
              <span class="label-text">Level (difficulty)</span>
            </div>
            <select
              class="select select-bordered max-w-md"
              bind:value={configState.lab.level}
              required
            >
              {#if placeholder}
                <option value="" disabled selected>{placeholder}</option>
              {/if}
              {#each levels as level}
                <option value={level}>{level}</option>
              {/each}
            </select>
          </label>
        </div>

        <div class="flex space-x-2">
          <!-- Add an attempts field -->
          <label class="form-control max-w-md mb-4">
            <div class="label">
              <span class="label-text">Attempts</span>
            </div>
            <input
              type="number"
              class="input input-bordered"
              bind:value={configState.lab.attempts}
              min={LAB_ATTEMPTS_MIN.toString()}
              max={LAB_ATTEMPTS_MAX.toString()}
              placeholder="Attempts"
              required
            />
          </label>

          <!-- Add a duration field -->
          <label class="form-control max-w-md mb-4">
            <div class="label">
              <span class="label-text">Duration (seconds)</span>
            </div>

            <div class="join">
              <input
                type="number"
                class="input input-bordered join-item"
                bind:value={configState.lab.duration}
                min={LAB_DURATION_MIN.toString()}
                max={LAB_DURATION_MAX.toString()}
                placeholder="Duration"
                required
              />
              <button
                class="btn btn-primary join-item"
                onclick={convertToSeconds}>{formatDuration()}</button
              >
            </div>
          </label>
        </div>
      </fieldset>
    </form>
    <div class="label-text-alt text-xs text-red-500 mt-1">
      <p>All fields are required.</p>
      <p>
        Changes to 'Attempts' or 'Duration' will not effect users who have
        already attempted the activity.
      </p>
    </div>
  </div>
{/if}
