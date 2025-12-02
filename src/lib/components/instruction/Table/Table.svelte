<script lang="ts">
  //import cx from 'clsx';
  import Icon from '@iconify/svelte';
  import { isEditable } from '$components/instruction/state.js';
  import { NodeViewWrapper, Editor, NodeViewContent } from 'svelte-tiptap';
  import Cell from './Cell.svelte';
  import type { NodeViewProps } from '@tiptap/core';
  //import { onMount } from 'svelte';
  import Properties from './Properties.svelte';

  /////////////////////////////////////////
  export let node: NodeViewProps['node'];

  export let updateAttributes: NodeViewProps['updateAttributes'];

  //export let editor: Editor;
  //export let decorations;
  export let selected: boolean = true;
  //export let getPos;
  //export let extension;
  //export let deleteNode;

  let currentSelection: { i: number; j: number } | null = null;
  const handleClick = (i: number, j: number) => {
    //console.debug('cell clicked', e.target, i, j);
    //dialog?.showModal();
    currentSelection = { i, j };
  };

  let dialog: HTMLDialogElement | null = null;

  /////////////////////////////
  let hoveredCell: { row: number; col: number } | null = null;
  const handleHover = (
    event: CustomEvent<{ row: number; col: number } | null>,
  ) => {
    hoveredCell = event.detail;
  };

  const tableProperties = () => {
    dialog?.showModal();
  };

  const handleTablePropertiesSave = (p0?: {
    tableWidth: string;
    borderStyle: string;
    backgroundColor: string;
    textAlignment: string;
    padding: string;
  }) => {
    console.debug('Table Properties:', p0);
    dialog?.close();
  };

  const addRow = () => {
    updateAttributes({
      ...node.attrs,
      data: [
        ...node.attrs.data,
        Array(node.attrs.headings.length).fill({ content: 'xxx' }),
      ],
    });
  };

  const deleteRow = () => {
    if (!currentSelection) return;
    const { i } = currentSelection;
    updateAttributes({
      ...node.attrs,
      data: node.attrs.data.filter((_: any, index: number) => {
        return index !== i;
      }),
    });
  };

  console.debug('Table hover:', hoveredCell);
  console.debug('Table selected:', selected);
  console.debug('Table isEditable:', $isEditable);
</script>

<NodeViewWrapper id="svelte-component_table" data-drag-handle>
  {#if $isEditable}
    <dialog bind:this={dialog} class="modal">
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >✕</button
          >
        </form>
        <Properties {handleTablePropertiesSave} />
      </div>
    </dialog>

    <div class="dropdown dropdown-left dropdown-hover w-full">
      <table class="table w-full" contenteditable={true}>
        <thead>
          <tr>
            {#each node.attrs.headings as cell}
              <th>{cell.content}</th>
            {/each}
          </tr>
        </thead>

        <tbody>
          {#each node.attrs.data as rows, i}
            <tr>
              {#each rows as cell, j}
                <Cell
                  content={cell.content}
                  row={i}
                  col={j}
                  {handleClick}
                  on:hover={handleHover}
                />
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>

      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <ul
        tabindex="0"
        class="dropdown-content menu menu-xs menu-vertical p-2 shadow bg-base-200 rounded-box"
      >
        <li>
          <div class="tooltip" data-tip="Table Properties">
            <a data-tip="Add Row" onclick={tableProperties}>
              <Icon icon="lucide:table-properties" height={16} />
            </a>
          </div>
        </li>
        <li>
          <div class="tooltip" data-tip="Add Row After">
            <a data-tip="Add Row" onclick={addRow}>
              <Icon icon="mdi:table-row-plus-after" height={16} />
            </a>
          </div>
        </li>
        <li>
          <div class="tooltip" data-tip="Add Row Before">
            <a onclick={deleteRow}>
              <Icon icon="mdi:table-row-plus-before" height={16} />
            </a>
          </div>
        </li>
        <li>
          <div class="tooltip" data-tip="Delete Row">
            <a>
              <Icon icon="mdi:table-row-remove" height={16} />
            </a>
          </div>
        </li>
        <li>
          <div class="tooltip" data-tip="Add Column After">
            <a>
              <Icon icon="mdi:table-column-add-after" height={16} />
            </a>
          </div>
        </li>
        <li>
          <div class="tooltip" data-tip="Add Column Before">
            <a>
              <Icon icon="mdi:table-column-add-before" height={16} />
            </a>
          </div>
        </li>
      </ul>
    </div>
  {:else}
    <table class={'table w-96'}>
      <thead>
        <tr>
          {#each node.attrs.headings as cell}
            <th>{cell.content}</th>
          {/each}
        </tr>
      </thead>

      <tbody>
        {#each node.attrs.data as rows, i}
          <tr>
            {#each rows as cell, j}
              <td>{cell.content}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</NodeViewWrapper>
