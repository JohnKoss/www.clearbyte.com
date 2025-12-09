<!-- TiptapToolbar.svelte -->
<script lang="ts">
  import { Editor } from '@tiptap/core';
  import { tiptapUI } from './tiptap-ui.svelte';

  let { editor = null }: { editor: Editor | null } = $props();

  const cmd = (fn: string, value?: any) => {
    const chain = editor?.chain().focus() as any;
    return value ? chain[fn](value).run() : chain[fn]().run();
  };

  let textColorPicker: HTMLInputElement;
  let bgColorPicker: HTMLInputElement;

  function openTextColor() {
    textColorPicker?.click();
  }

  function openBgColor() {
    bgColorPicker?.click();
  }

  function applyTextColor(e: Event) {
    const target = e.target as HTMLInputElement;
    cmd('setColor', target.value);
  }

  function applyBgColor(e: Event) {
    const target = e.target as HTMLInputElement;
    cmd('setHighlight', { color: target.value });
  }

  function applyBlockStyle() {
    const value = tiptapUI.blockStyle;
    if (value === '¶') {
      cmd('setParagraph');
    } else {
      const level = Number(value.slice(1));
      cmd('toggleHeading', { level });
    }
  }

  function cycleList() {
    const value = tiptapUI.listStyle;

    // NONE → BULLET
    if (value === 'none') {
      cmd('toggleBulletList');
      return;
    }

    // BULLET → ORDERED
    if (value === 'bullet') {
      cmd('toggleBulletList'); // turn off bullet
      cmd('toggleOrderedList'); // turn on ordered
      return;
    }

    // ORDERED → NONE
    if (value === 'ordered') {
      cmd('toggleOrderedList');
    }
  }

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);

    if (url === null) return; // user cancelled
    if (url === '') {
      editor.chain().focus().unsetLink().run(); // remove link
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }
</script>

<div class="bg-base-200 border-b border-base-300 text-sm font-sans">
  <div class="flex items-center gap-1 px-2 py-1 bg-base-100">
    <!-- TEXT STYLE -->
    <button
      class="btn btn-ghost px-1.5 font-bold min-h-7 h-7"
      onclick={() => cmd('toggleBold')}
      class:btn-active={tiptapUI.bold}>B</button
    >
    <button
      class="btn btn-ghost px-1.5 italic min-h-7 h-7"
      onclick={() => cmd('toggleItalic')}
      class:btn-active={tiptapUI.italic}>I</button
    >
    <button
      class="btn btn-ghost px-1.5 underline min-h-7 h-7"
      onclick={() => cmd('toggleUnderline')}
      class:btn-active={tiptapUI.underline}>U</button
    >
    <button
      class="btn btn-ghost px-1.5 line-through min-h-7 h-7"
      onclick={() => cmd('toggleStrike')}
      class:btn-active={tiptapUI.strike}>S</button
    >
    <!-- HIGHLIGHT -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Highlight"
      class:btn-active={tiptapUI.highlight}
      onclick={() => cmd('toggleHighlight')}>🖍</button
    >

    <div class="divider divider-horizontal mx-1"></div>

    <!-- TEXT & BACKGROUND COLOR (BUTTONS) -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7 relative"
      title="Text Color: {tiptapUI.textColor}"
      aria-label="Text Color"
      onclick={openTextColor}
    >
      <span
        class="w-4 h-4 rounded border"
        style="background: {tiptapUI.textColor}"
      ></span>
    </button>

    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7 relative"
      title="Background Color: {tiptapUI.bgColor}"
      aria-label="Background Color"
      onclick={openBgColor}
    >
      <span
        class="w-4 h-4 rounded border"
        style="background: {tiptapUI.bgColor}"
      ></span>
    </button>

    <!-- ✅ HIDDEN NATIVE PICKERS -->
    <input
      type="color"
      class="hidden"
      bind:this={textColorPicker}
      oninput={applyTextColor}
      bind:value={tiptapUI.textColor}
    />

    <input
      type="color"
      class="hidden"
      bind:this={bgColorPicker}
      oninput={applyBgColor}
      bind:value={tiptapUI.bgColor}
    />

    <div class="divider divider-horizontal mx-1"></div>

    <!-- HEADINGS -->
    <select
      class="select select-xs h-7 min-h-7"
      bind:value={tiptapUI.blockStyle}
      onchange={applyBlockStyle}
    >
      <option selected>¶</option>
      <option>H1</option>
      <option>H2</option>
      <option>H3</option>
      <option>H4</option>
      <option>H5</option>
      <option>H6</option>
    </select>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- ALIGNMENT -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Align Left"
      aria-label="Align Left"
      onclick={() => cmd('setTextAlign', 'left')}
      class:btn-active={tiptapUI.align === 'left'}
    >
      <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 5h12v2H4zM4 9h8v2H4zM4 13h12v2H4zM4 17h8v2H4z" />
      </svg>
    </button>

    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Align Center"
      aria-label="Align Center"
      onclick={() => cmd('setTextAlign', 'center')}
      class:btn-active={tiptapUI.align === 'center'}
    >
      <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 5h12v2H6zM8 9h8v2H8zM6 13h12v2H6zM8 17h8v2H8z" />
      </svg>
    </button>

    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Align Right"
      aria-label="Align Right"
      onclick={() => cmd('setTextAlign', 'right')}
      class:btn-active={tiptapUI.align === 'right'}
    >
      <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5h12v2H8zM12 9h8v2h-8zM8 13h12v2H8zM12 17h8v2h-8z" />
      </svg>
    </button>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- LISTS -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      class:btn-active={tiptapUI.listStyle !== 'none'}
      onclick={cycleList}
      title="Toggle List"
    >
      {tiptapUI.listStyle === 'bullet'
        ? '•'
        : tiptapUI.listStyle === 'ordered'
          ? '1.'
          : '≡'}
    </button>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- CODE -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Inline Code"
      aria-label="Inline Code"
      onclick={() => cmd('toggleCode')}
      class:btn-active={tiptapUI.code}
    >
      <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 7 4 12l4 5M16 7l4 5-4 5" />
      </svg>
    </button>

    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Code Block"
      aria-label="Code Block"
      onclick={() => cmd('toggleCodeBlock')}
      class:btn-active={tiptapUI.codeBlock}
    >
      <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M9.17 8.17 7 10.34 9.17 12.5 7.75 13.92 4.17 10.34 7.75 6.75zM14.83 8.17 17 10.34l-2.17 2.16 1.42 1.42 3.58-3.58-3.58-3.59z"
        />
      </svg>
    </button>

    <div class="divider divider-horizontal mx-1"></div>

    <!-- INSERT -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Insert Link"
      class:btn-active={tiptapUI.link}
      onclick={setLink}>🔗</button
    >
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Remove Link"
      onclick={() => cmd('unsetLink')}
    >
      ❌🔗
    </button>

    <button class="btn btn-ghost px-1.5 min-h-7 h-7" title="Insert Image"
      >🖼</button
    >
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Block Quote"
      onclick={() => cmd('toggleBlockquote')}
      class:btn-active={tiptapUI.blockquote}>❝</button
    >
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Horizontal Rule"
      onclick={() => cmd('setHorizontalRule')}
      class:btn-active={tiptapUI.horizontalRule}>―</button
    >

    <div class="divider divider-horizontal mx-1"></div>

    <!-- HISTORY -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Undo"
      onclick={cmd('undo')}
      disabled={!tiptapUI.canUndo}>↺</button
    >
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Redo"
      disabled={!tiptapUI.canRedo}
      onclick={cmd('redo')}>↻</button
    >
  </div>
</div>
