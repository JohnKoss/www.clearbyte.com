<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { Api, type IPostResults } from '$lib/api';
  import { LoadJwt } from '$lib/auth';
  import Alert from '$lib/Alert.svelte';
  import {
    TITLES,
    TAB_INSTRUCTIONS,
    TAB_ACTIONS,
    TAB_SCORESHEET,
    TAB_PROPERTIES,
    TAB_ANALYSIS,
  } from './constants';
  import cx from 'clsx';
  import { TabItems } from './items.svelte';
  //import InstructionEditor from '$components/instruction/InstructionEditor.svelte'; //InstructionsStore,
  import InstructionEditor from '../lib/components/instruction/InstructionEditor.svelte';
  import Config from '../lib/components/properties/Config.svelte';
  import ActionsEditor from '../lib/components/actions/ActionsEditor.svelte';
  import Analysis from '../lib/components/analysis/Analysis.svelte';
  //const URL_ADMIN = import.meta.env.VITE_PUBLIC_API_PATH + '/admin/labs/all';

  ////////////
  let isSaving = $state(false);

  //const { data }: { data: { content?: any; error?: boolean } } = $props();

  //////////////
  let alertAutoClose = $state(false);
  let alertType = $state('success');
  let alertMsg = $state('');
  let alertShow = $state(false);
  const showAlert = (at: string, am: string, autoClose: boolean) => {
    alertType = at;
    alertMsg = am;
    alertAutoClose = autoClose;
    alertShow = true;
  };

  /////
  let activeTabValue = $state(TAB_INSTRUCTIONS);
  //const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);

  let dataError = $state(false);
  let loadingSuccess = $state(false);

  onMount(async () => {
    loadingSuccess = true;
    
    try {
      await LoadJwt();
      await loadLabData();
    } catch (error) {
      console.error('Error during initialization:', error);
      dataError = true;
    } finally {
      loadingSuccess = false;
    }
  });

  const loadLabData = async () => {
    const url = new URL(
      import.meta.env.VITE_PUBLIC_API_PATH + '/admin/labs/all',
    );
    const api = new Api(url);
    const res = await api.Get<IPostResults>();

    if (!res.ok) {
      throw new Error('Failed to load lab activity data');
    }

    const dataItems = JSON.parse(res.message) as string[];
    Object.keys(dataItems).forEach((key) => {
      TabItems[parseInt(key)].data = dataItems[parseInt(key)];
    });
  };

  const saveContent: any = async () => {
    isSaving = true;
    alertShow = false;
    try {
      console.log('TabItems', JSON.stringify(TabItems));
      //let res: any | undefined = await new Api().POST<any>(
      //JSON.stringify(TabItems),
      //);
      const url = new URL(
        import.meta.env.VITE_PUBLIC_API_PATH + '/admin/labs/save',
      );
      const api = new Api(url);
      const res = await api.Post<IPostResults>(TabItems);

      if (res.ok) {
        showAlert('alert-success', res.message, true);
      } else {
        showAlert('alert-error', res.message, false);
      }
    } catch (error: any) {
      showAlert('alert-error', error, false);
    } finally {
      isSaving = false;
    }
  };
</script>

<svelte:head />

{#if loadingSuccess}
  <dialog class="modal modal-open">
    <div class="modal-box">
      <div class="flex items-center m-4">
        <h3 class="text-lg font-bold">Loading lab activity...</h3>
        <span class="loading loading-bars loading-md ml-2"></span>
      </div>
    </div>
  </dialog>
{/if}

<div class="p-4">
  <div class="mb-4">
    {#if alertShow}
      <Alert message={alertMsg} type={alertType} autoClose={alertAutoClose} />
    {/if}
    {#if dataError}
      <Alert
        type="alert-error"
        message="Error loading lab data"
        autoClose={false}
      />
    {/if}
  </div>
  <div class="tabs tabs-lift tabs-lg">
    <input
      type="radio"
      name="main-tabs"
      class="tab"
      aria-label={TITLES[TAB_INSTRUCTIONS]}
      onclick={() => (activeTabValue = TAB_INSTRUCTIONS)}
      checked={activeTabValue === TAB_INSTRUCTIONS}
    />
    <div class="tab-content bg-base-100 border-base-300">
      <InstructionEditor
        id={TAB_INSTRUCTIONS}
        data={TabItems[TAB_INSTRUCTIONS].data}
      />
    </div>

    <input
      type="radio"
      name="main-tabs"
      class="tab"
      aria-label={TITLES[TAB_ACTIONS]}
      onclick={() => (activeTabValue = TAB_ACTIONS)}
      checked={activeTabValue === TAB_ACTIONS}
    />
    <div class="tab-content bg-base-100 border-base-300">
      <ActionsEditor id={TAB_ACTIONS} data={TabItems[TAB_ACTIONS].data} />
    </div>

    <input
      type="radio"
      name="main-tabs"
      class="tab"
      aria-label={TITLES[TAB_SCORESHEET]}
      onclick={() => (activeTabValue = TAB_SCORESHEET)}
      checked={activeTabValue === TAB_SCORESHEET}
    />
    <div class="tab-content bg-base-100 border-base-300">
      <ActionsEditor id={TAB_SCORESHEET} data={TabItems[TAB_SCORESHEET].data} />
    </div>

    <input
      type="radio"
      name="main-tabs"
      class="tab"
      aria-label={TITLES[TAB_PROPERTIES]}
      onclick={() => (activeTabValue = TAB_PROPERTIES)}
      checked={activeTabValue === TAB_PROPERTIES}
    />
    <div class="tab-content bg-base-100 border-base-300">
      <Config id={TAB_PROPERTIES} data={TabItems[TAB_PROPERTIES].data} />
    </div>

    <input
      type="radio"
      name="main-tabs"
      class="tab"
      aria-label={TITLES[TAB_ANALYSIS]}
      onclick={() => (activeTabValue = TAB_ANALYSIS)}
      checked={activeTabValue === TAB_ANALYSIS}
    />
    <div class="tab-content bg-base-100 border-base-300">
      <Analysis />
    </div>
    <!-- {#each TabItems as item}
      {console.debug('item', item)}
      {@render tabs(item)}
    {/each} -->
    <button
      class={cx('tab btn btn-warning ml-2 mr-2', {
        'loading loading-spinner': isSaving,
      })}
      onclick={saveContent}>Save</button
    >
  </div>
</div>

<!-- <Tabs {items} {onSave} {isLoading} /> -->
<!-- {@render children()} -->

<!-- {#if import.meta.env.MODE === "development"}
  <template></template>
{/if} -->
