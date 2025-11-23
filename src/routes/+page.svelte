<script lang="ts">
  import '../app.css';
  import { type TabItem } from '../model.svelte.';
  import { Api } from '$components/api.svelte';
  import Alert from '$lib/Alert.svelte';
  import {
    TITLES,
    TAB_INSTRUCTIONS,
    TAB_ACTIONS,
    TAB_SCORESHEET,
    TAB_PROPERTIES,
  } from './constants';
  import cx from 'clsx';
  import { TabItems } from './items.svelte';
  import InstructionEditor from '$components/instruction/InstructionEditor.svelte'; //InstructionsStore,
  import Config from '$components/properties/Config.svelte';
  import ActionsEditor from '$components/actions/ActionsEditor.svelte';

  ////////////
  let isSaving = $state(false);

  const { data } = $props();

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

  const saveContent: any = async () => {
    isSaving = true;
    alertShow = false;
    try {
      console.log('TabItems', JSON.stringify(TabItems));
      let res: any | undefined = await new Api().POST<any>(
        JSON.stringify(TabItems),
      );
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

{#if !data.content}
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
    {#if data.error}
      <Alert type="alert-error" message={data.content[0]} autoClose={false} />
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
