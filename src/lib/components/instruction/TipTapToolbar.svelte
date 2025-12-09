<!-- TiptapToolbar.svelte -->
<script lang="ts">
  import { Editor } from '@tiptap/core';
  import { tiptapUI } from './tiptap-ui.svelte';
  import { chooseImage, IMG_STYLE_LEFT } from './Image/ImageExtension';
  import { getDefaultCollapsibleAttributes } from './Collapsible/CollapsibleExtension.svelte';

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

  function insertImage() {
    if (!editor) return;
    chooseImage((imageData) => {
      const imageAttributes = {
        src: imageData.src,
        alt: imageData.name,
        title: imageData.name,
        width: imageData.width,
        height: imageData.height,
        style: IMG_STYLE_LEFT,
      };

      editor.chain().focus().setImage(imageAttributes).run();
    });
  }

  function promptForQuestion() {
    if (!editor) return;
    const questionText = window.prompt('Enter the question text:');
    if (questionText && questionText.trim() !== '') {
      //editor.chain().focus().insertQuestion({ question: questionText.trim() }).run();
    }
  }

  function submitFile() {
    editor?.chain().focus().addFile().run();
  }

  function onCollapse() {
    editor
      ?.chain()
      .focus()
      .addCollapsible(getDefaultCollapsibleAttributes())
      .run();
  }
</script>

<div class="bg-base-200 border-b border-base-300 text-sm font-sans">
  <div class="flex flex-wrap items-center gap-1 px-2 py-1 bg-base-100">
    <!-- TEXT STYLE -->
    <button
      class="btn btn-ghost px-1.5 font-bold min-h-7 h-7"
      title="Bold"
      onclick={() => cmd('toggleBold')}
      class:btn-active={tiptapUI.bold}>B</button
    >
    <button
      class="btn btn-ghost px-1.5 italic min-h-7 h-7"
      title="Italic"
      onclick={() => cmd('toggleItalic')}
      class:btn-active={tiptapUI.italic}>I</button
    >
    <button
      class="btn btn-ghost px-1.5 underline min-h-7 h-7"
      title="Underline"
      onclick={() => cmd('toggleUnderline')}
      class:btn-active={tiptapUI.underline}>U</button
    >
    <button
      class="btn btn-ghost px-1.5 line-through min-h-7 h-7"
      title="Strikethrough"
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
      class="select select-xs h-7 min-h-7 w-16"
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

    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Insert Link"
      class:btn-active={tiptapUI.link}
      onclick={setLink}>🔗</button
    >

    <div class="divider divider-horizontal mx-1"></div>

    <!-- INSERT -->
    <button
      class="btn btn-ghost px-1.5 min-h-7 h-7"
      title="Insert Image"
      class:btn-active={tiptapUI.imageSelected}
      onclick={insertImage}>🖼</button
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

    <div class="divider divider-horizontal mx-1"></div>
    <button
      type="button"
      class="btn btn-ghost px-2 min-h-8 h-8 flex items-center gap-1"
      aria-label="Add Question"
      title="Add Question"
      onclick={promptForQuestion}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- Rounded box -->
        <rect x="3" y="3" width="18" height="18" rx="4" />

        <!-- Question mark curve -->
        <path d="M9.5 9a3 3 0 0 1 5.5 1.5c0 2-3 2.5-3 4" />

        <!-- Question mark dot -->
        <circle cx="12" cy="17" r="0.8" />
      </svg>
    </button>

    <button
      class="btn btn-ghost px-2 min-h-8 h-8 flex items-center gap-1"
      aria-label="Submit File"
      title="Submit File"
      onclick={submitFile}
      class:btn-active={tiptapUI.fileSelected}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" />
        <path d="M12 3v12" />
        <path d="M7 8l5-5 5 5" />
      </svg>
    </button>

    <button
      class="btn btn-ghost px-2 min-h-8 h-8 flex items-center gap-1"
      aria-label="Toggle Collapse"
      title="Toggle Collapse"
      onclick={onCollapse}
      class:btn-active={tiptapUI.collapseSelected}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 transition-transform duration-200"
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </button>

  </div>
</div>
