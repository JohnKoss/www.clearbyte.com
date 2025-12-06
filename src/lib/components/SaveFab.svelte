<svelte:options runes={true} />

<script lang="ts">
  import { onMount } from 'svelte';

  // Props
  let {
    onSave,
    onSaving,
    onSavingError,
    tooltip = 'Save changes',
    icon = '💾',
    tooltipPlacement = 'tooltip-left',
    showStatus = true,

    // Position / container customization
    initialX,
    initialY,
    constrainToViewport = true,
    containerClass = 'z-50'
  }: {
    onSave: (args?: any) => Promise<void> | void;
    onSaving?: (args?: any) => Promise<void> | void;
    onSavingError?: (error: any) => Promise<void> | void;
    pending?: boolean;
    disabled?: boolean;
    tooltip?: string;
    icon?: string;
    dirty?: boolean;
    tooltipPlacement?: string;
    showStatus?: boolean;

    initialX?: number;
    initialY?: number;
    constrainToViewport?: boolean;
    containerClass?: string;
  } = $props();

  let pending = $state(false);
  let disabled = $state(false);
  let dirty = $state(false);

  // Drag state
  let position = $state({ x: 0, y: 0 });
  let dragging = $state(false);
  let dragOffset = { x: 0, y: 0 };

  // Keyboard shortcut: Ctrl/Cmd+S
  const handler = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toLowerCase().includes('mac');
    const combo = isMac ? e.metaKey : e.ctrlKey;
    if (combo && e.key.toLowerCase() === 's') {
      e.preventDefault();
      triggerSave();
    }
  };

  const triggerSave = async () => {
    if (disabled || pending) return;
    pending = true;
    try {
      await onSave?.();
      dirty = false;
      await onSaving?.();
    } catch (err) {
      console.error('Save failed:', err);
      await onSavingError?.(err);
    } finally {
      pending = false;
    }
  };

  // Drag handlers
  const startDrag = (e: PointerEvent) => {
    // Only left button
    if (e.button !== 0) return;
    dragging = true;
    dragOffset.x = e.clientX - position.x;
    dragOffset.y = e.clientY - position.y;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!dragging) return;

    let nextX = e.clientX - dragOffset.x;
    let nextY = e.clientY - dragOffset.y;

    if (constrainToViewport && typeof window !== 'undefined') {
      const padding = 16; // keep a bit inside the edges
      const barWidth = 260; // rough width of the bar
      const barHeight = 64; // rough height of the bar

      const maxX = window.innerWidth - barWidth - padding;
      const maxY = window.innerHeight - barHeight - padding;

      if (nextX < padding) nextX = padding;
      if (nextY < padding) nextY = padding;
      if (nextX > maxX) nextX = maxX;
      if (nextY > maxY) nextY = maxY;
    }

    position.x = nextX;
    position.y = nextY;
  };

  const handlePointerUp = () => {
    dragging = false;
  };

  // Lifecycle
  onMount(() => {
    // Initial position: bottom-right by default
    if (typeof window !== 'undefined') {
      const barWidth = 260;
      const barHeight = 64;
      const padding = 24;
      position.x = initialX ?? window.innerWidth - barWidth - padding;
      position.y = initialY ?? window.innerHeight - barHeight - padding;
    }

    window.addEventListener('keydown', handler);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  });
</script>

<!-- Draggable floating menu-bar container -->
<div
  class={`fixed pointer-events-none ${containerClass}`}
  style={`left: ${position.x}px; top: ${position.y}px;`}
>
  <!-- Menu bar: background, rounded, shadow -->
  <div
    class="pointer-events-auto flex items-center gap-3 px-3 py-2 bg-base-200 border border-base-300 rounded-box shadow-xl"
  >
    <!-- Drag handle (like a small title bar grip) -->
    <div
      class="flex flex-col justify-center items-center px-1 mr-1 cursor-move select-none"
      onpointerdown={startDrag}
    >
      <div class="w-6 h-1.5 rounded-full bg-base-300 mb-0.5"></div>
      <div class="w-6 h-1.5 rounded-full bg-base-300 opacity-80"></div>
    </div>

    <!-- Button with tooltip -->
    <div class={`tooltip ${tooltipPlacement}`} data-tip={tooltip}>
      <button
        class="btn btn-primary btn-circle shadow transition"
        aria-label="Save"
        onclick={triggerSave}
        disabled={disabled || pending}
        class:bg-success={dirty === false && !pending}
      >
        {#if pending}
          <span class="loading loading-spinner loading-sm"></span>
        {:else}
          {icon}
        {/if}
      </button>
    </div>

  </div>
</div>
