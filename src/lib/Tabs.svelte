<script lang="ts">
  import { type TabItem } from "../model";
  import cx from "clsx";
  import { TITLES, TAB_INSTRUCTIONS } from "../routes/constants";
  
  
  let {
    items,
    isLoading,
    onSave,
  }: {
    items: TabItem[];
    isLoading: boolean;
    onSave: () => void;
  } = $props();

  $effect(() => {
    console.debug("items", items);
  });


  let activeTabValue = $state(TAB_INSTRUCTIONS);
  let instance: any | null = $state(null);
  
  // Handle tab clicks
  const handleClick = (tabValue: number) => () => (activeTabValue = tabValue);

  /// Save the content of the active tab
  const saveContent: any = () => {
    // Save any dirty data in the active tab
    if (instance) {
      instance.flushData({});
    }
    onSave();
  };
 

  // const toTitleCase = (str: string) => {
  //   return str
  //     .toLowerCase()
  //     .split(" ")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  // };
</script>

<div role="tablist" class="tabs tabs-lifted tabs-lg">
  {#each items as item}
  {console.debug("item", item)}
    <input
      type="radio"
      name="main-tabs"
      role="tab"
      class="tab hover:bg-base-200"
      aria-label={TITLES[item.id]}
      checked={activeTabValue === item.id}
      onclick={handleClick(item.id)}
    />

    <div
      role="tabpanel"
      class="tab-content bg-base-100 border-base-300 rounded-box"
    >
      {#if activeTabValue == item.id}
        <item.component bind:this={instance} id={item.id} action={item.id} />
      {/if}
    </div>
  {/each}

  <!-- <button
    class={cx("tab btn btn-secondary ml-2 mr-2", {
      "loading loading-spinner": isLoading,
    })}
    onclick={saveContent}
  >
    Save</button
  > -->
</div>

<!-- <ul>
  {#each items as item}
    <li class={activeTabValue === item.value ? 'active' : ''}>
      <span onclick={handleClick(item.value)}>{item.label}</span>
    </li>
  {/each}
</ul> -->

<!-- {#each items as item}
  {#if activeTabValue == item.value}
    <div class="box">
      <svelte:component this={item.component} />
    </div>
  {/if}
{/each} -->
<!-- 
<style>
  .box {
    margin-bottom: 10px;
    padding: 40px;
    border: 1px solid #dee2e6;
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    margin-bottom: -1px;
  }

  span {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  span:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  li.active > span {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
</style> -->
