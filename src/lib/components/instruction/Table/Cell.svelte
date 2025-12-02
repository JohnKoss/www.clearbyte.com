<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { isEditable } from '$components/instruction/state.js';

  export let row: number;
  export let col: number;
  export let content: string;
  export let handleClick: (row: number, col: number) => void;

  let hoveredCell: { row: number; col: number } | null = null;
  const dispatch = createEventDispatcher();

  const handleHover = (e: Event) => {
    if (!isEditable) return;
    hoveredCell = { row, col };
    dispatch('hover', hoveredCell);
  };

  const handleLeave = () => {
    if (!isEditable) return;
    hoveredCell = null;
    dispatch('hover', hoveredCell);
  };
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<td
  class={hoveredCell && $isEditable ? 'cursor-pointer border bg-yellow-100' : 'bg-white-200'}
  onclick={() => handleClick(row, col)}
  on:mouseover={handleHover}
  on:mouseleave={handleLeave}
>
  {content}
</td>
