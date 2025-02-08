<script lang="ts">
  import "../app.css";
  import { type TabItem } from "../model";
  import { Api } from "$components/api.svelte";
  import Alert from "$lib/Alert.svelte";
  import { TITLES, TAB_PROPERTIES } from "./constants";
  import cx from "clsx";
  import { TabItems } from "./items.svelte";

  ////////////
  let isSaving = $state(false);

  const { data } = $props();

  //////////////
  let alertShow = $state(false);
  let alertType = $state("success");
  let alertMsg = $state("");
  const showAlert = (at: string, am: string) => {
    alertType = at;
    alertMsg = am;
    alertShow = true;
    setTimeout(() => {
      alertShow = false;
    }, 2000);
  };

  /////
  let activeTabValue = $state(TAB_PROPERTIES);
  const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);

  const saveContent: any = async () => {
    isSaving = true;
    try {
      let res: any | undefined = await new Api().POST<any>(JSON.stringify(TabItems));
      if (res.ok) {
        showAlert("success", "Activity SAVED!");
      } else {
        showAlert("error", res.message);        
      }
    } catch (error: any) {
      showAlert("error", error);        
    } finally {
      isSaving = false;
    }
  };
</script>

{#snippet tabs(item: TabItem)}
  <input
    type="radio"
    name="main-tabs"
    role="tab"
    class="tab hover:bg-base-200"
    aria-label={TITLES[item?.id]}
    checked={activeTabValue === item?.id}
    onclick={handleClick(item?.id)}
  />
  <div
    role="tabpanel"
    class="tab-content bg-base-100 border-base-300 rounded-box"
  >
    <item.component
      id={item.id}
      data={data.content ? data.content[item.id] : null}
    />
  </div>
{/snippet}

<svelte:head />

{#if !data.content}
  <dialog id="my_modal_1" class="modal modal-open">
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
      <Alert type={alertType} message={alertMsg} />
    {/if}
    {#if data.error}
      <Alert type="error" message={data.content[0]} />
    {/if}
  </div>
  <div role="tablist" class="tabs tabs-lift tabs-lg">
    {#each TabItems as item}
      {@render tabs(item)}
    {/each}
    <button

    class={cx("tab btn btn-warning ml-2 mr-2", {
      "loading loading-spinner": isSaving,
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
