<script lang="ts">
  import type { Editor } from "@tiptap/core";
  import {
    IMG_STYLE_LEFT,
    IMG_STYLE_RIGHT,
    IMG_STYLE_CENTER,
    IMG_STYLE_INLINE,
  } from "./ImageExtension";

  const { editor, closeModal } = $props<{editor: Editor, closeModal: () => void}>();

  const doAlign = (style: string) => {
    editor.chain().focus().updateAttributes("image", { style: style }).run();
    closeModal();
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

</script>

<svelte:window on:keyup={handleEscape} />

<ul
  class="menu menu-xs menu-horizontal bg-base-200 rounded-box"
  onblur={() => alert("ffff")}
>
  <li><button onclick={() => doAlign(IMG_STYLE_LEFT)}>Left</button></li>
  <li><button onclick={() => doAlign(IMG_STYLE_CENTER)}>Center</button></li>
  <li><button onclick={() => doAlign(IMG_STYLE_RIGHT)}>Right</button></li>
  <li><button onclick={() => doAlign(IMG_STYLE_INLINE)}>Inline</button></li>
</ul>
