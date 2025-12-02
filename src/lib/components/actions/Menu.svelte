<script module lang="ts">
  import { Compartment } from '@codemirror/state';
  export const themeCompartment = new Compartment();
  export const fontCompartment = new Compartment();
</script>

<script lang="ts">
  import Icon from '@iconify/svelte';
  import cx from 'clsx';
  import { EditorView } from 'codemirror';
  import { lightTheme, darkTheme } from './theme';
  import { MenuItem } from './menuitem.svelte';
  import FontSizeModal from './FontSize.svelte';
  import { undo, redo } from '@codemirror/commands';
  import { StateEffect, StateField } from '@codemirror/state';

  // https://github.com/prettier/prettier/issues/15473
  //import * as prettier from "prettier/standalone"; // Contributing to a larger bundle size
  //import * as prettierPluginBabel from "prettier/plugins/babel"; // Contributing to a larger bundle size
  //import prettierPluginEstree from "prettier/plugins/estree";

  const prettierPromise = import('prettier/standalone');
  const prettierPluginBabelPromise = import('prettier/plugins/babel');
  const prettierPluginEstreePromise = import('prettier/plugins/estree');

  import { highlightError, clearError } from './errorHighlighting';
  import { NEW_SCORE_SHEET } from './templates';

  const { editor }: { editor: EditorView | null } = $props();

  //let { bindableProp = $bindable('fallback') } = $props();

  let fontSize = $state(12);
  let show = $state(false);

  $effect(() => {
    $inspect('fontSize', fontSize);
    const currentTheme = editor?.state.facet(EditorView.darkTheme);
    // console.log("currentTheme", currentTheme);
    $inspect(currentTheme);
    $inspect('editor', editor);
    let on = editor ? fontCompartment.get(editor.state) : null;
    $inspect('on', on);
    editor?.dispatch({
      //effects: themeCompartment.reconfigure(currentTheme)
      effects: fontCompartment.reconfigure(
        EditorView.theme({
          '.cm-content': {
            fontSize: `${fontSize}px`, // Set the font size
          },
        }),
      ),
    });
  });

  //////////////////////////
  let menuItems: MenuItem[] = [
    new MenuItem('undo', 'mdi:undo', () => {
      if (editor) undo(editor);
    }),
    new MenuItem(
      'redo',
      'mdi:redo',
      () => {
        if (editor) redo(editor);
      },
      true,
    ),
    new MenuItem('toggle theme', 'mdi:theme-light-dark', function (
      this: MenuItem,
    ) {
      const currentTheme = editor?.state.facet(EditorView.darkTheme)
        ? lightTheme
        : darkTheme;
      editor?.dispatch({ effects: themeCompartment.reconfigure(currentTheme) });
      this.active = !this.active;
    }),
    new MenuItem('increase font size', 'mdi:format-font-size-increase', () => {
      if (fontSize < 44) {
        fontSize++;
      }
    }),
    new MenuItem(
      'decrease font size',
      'mdi:format-font-size-decrease',
      () => {
        if (fontSize > 2) {
          fontSize--;
        }
      },
      true,
    ),
    new MenuItem('format JSON', 'mdi:code-json', async () => {
      if (!editor) return;

      // Wait for the preloaded imports (avoids duplicate network requests)
      const prettier = (await prettierPromise).default;
      const prettierPluginBabel = (await prettierPluginBabelPromise).default;
      const prettierPluginEstree = (await prettierPluginEstreePromise).default;

      try {
        const unformattedCode = editor.state.doc.toString();
        const formattedCode = await prettier.format(unformattedCode, {
          parser: 'json',
          plugins: [prettierPluginBabel, prettierPluginEstree],
        });

        const end = editor.state.doc.length;
        editor.dispatch({
          changes: {
            from: 0,
            to: end,
            insert: formattedCode,
          },
        });
        clearError(editor); // ✅ Clear previous errors
      } catch (error) {
        alert(error);
        if (error instanceof Error) {
          const match = error.message.match(/\((\d+):(\d+)\)/);
          if (match) {
            const line = parseInt(match[1], 10) - 1;
            const ch = parseInt(match[2], 10) - 1;
            const pos = editor.state.doc.line(line + 1).from + ch;
            highlightError(editor, pos, pos + 1); // ✅ Highlight the error in CodeMirror
            editor.dispatch({
              effects: EditorView.scrollIntoView(pos, {
                y: 'center',
                yMargin: 50,
              }),
            });
          }
        }
      }
    }),
    new MenuItem('insert template', 'mdi:book-open-outline', () => {
      if (!editor) return;
      const endPos = editor.state.doc.length;
      editor.dispatch({
        changes: { from: endPos, insert: NEW_SCORE_SHEET },
      });
    }),
  ];
</script>

<FontSizeModal {show} />

{#snippet MenuButton(item: MenuItem)}
  <button
    type="button"
    title={item.name}
    class={cx('hover:bg-black hover:text-white w-8 h-8 rounded border', {
      'bg-black text-white': item.active,
    })}
    onclick={() => item.command()}
  >
    <span class="flex items-center justify-center text-2xl">
      <Icon icon={item.content} />
    </span>
  </button>
{/snippet}

<div class="bg-base-100 border-b sticky top-0 z-50 overflow-x-auto mt-2 p-2">
  <div class="flex">
    <div class="flex-1">
      {#each menuItems as item (item.name)}
        {@render MenuButton(item)}
        {#if item.separator}
          <span class="ml-2 mr-2"></span>
        {/if}
      {/each}
    </div>
  </div>
</div>

<!-- <button
      type="button"
      title="Save ScoreSheet"
      class="bg-primary text-white hover:bg-orange-600 w-8 h-8 rounded border"
      onclick={saveContent}
    >
      <span class="flex items-center justify-center text-2xl">
        <Icon icon="mdi:content-save" />
      </span>
    </button> -->

<!-- console.log("editor", editor);
    if (editor) {
      try {
        const parsedContent = JSON.parse(editor.state.doc.toString());
        editor?.dispatch({
          changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: JSON.stringify(parsedContent, null, 2),
          },
        });
      } catch (error) {
        console.error("Failed to parse JSON content:", error);
      }
    } -->
