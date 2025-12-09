<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte';
  import { tiptapUI } from './tiptap-ui.svelte';
  import { Editor } from '@tiptap/core';
  import { Document } from '@tiptap/extension-document';
  import { Text } from '@tiptap/extension-text';
  import {
    CustomHeading,
    CustomHorizontalRule,
    CustomListItem,
    CustomBulletList,
    CustomOrderedList,
    CustomBold,
    CustomItalic,
    CustomUnderline,
    CustomStrike,
    CustomBlockquote,
    CustomCode,
    CustomCodeBlock,
    //CustomLink,
    CustomTable,
  } from './Schema';

  import {
    CustomImage,
    dropImage,
  } from '$components/instruction/Image/ImageExtension';

  import Color from '@tiptap/extension-color';
  import Link from '@tiptap/extension-link';
  //import TextStyle from '@tiptap/extension-text-style';
  import { TextStyleKit } from '@tiptap/extension-text-style';
  import Highlight from '@tiptap/extension-highlight';
  import Gapcursor from '@tiptap/extension-gapcursor';
  import Dropcursor from '@tiptap/extension-dropcursor';
  import Paragraph from '@tiptap/extension-paragraph';
  import History from '@tiptap/extension-history';
  import HardBreak from '@tiptap/extension-hard-break';
  import TextAlign from '@tiptap/extension-text-align';
  import TableCell from '@tiptap/extension-table-cell';
  import TableHeader from '@tiptap/extension-table-header';
  import TableRow from '@tiptap/extension-table-row';

  import { Question } from '$components/instruction/Question/QuestionExtension.svelte';
  import { DataAsAnchors } from '$components/instruction/DataAsAnchors/DataAsAnchorsExtension';
  import { Collapsible } from '$lib/components/instruction/Collapsible/CollapsibleExtension.svelte';

  //import { MenuItem, createMenuItems } from './menuitem.svelte';
  //import Icon from '@iconify/svelte';
  //import cx from 'clsx';
  import TiptapToolbar from '$lib/components/instruction/TipTapToolbar.svelte';

  import { File } from '$components/instruction/File/FileExtension.svelte';
  //import { TabItems } from '../../routes/items.svelte';
  import { TabItems } from '../../../routes/items.svelte';
  import { linkHoverPlugin } from './Link/linkHoverPlugin';

  let {
    id,
    data,
    dirty = $bindable(),
  }: { id: number; data: string; dirty: number } = $props();

  //////////////
  $effect(() => {
    const currentVal = editor?.getHTML() ?? '';
    if (data !== currentVal) {
      console.log(
        'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX Data prop changed, updating editor content.',
        data !== currentVal,
      );
      untrack(() => {
        editor && editor.commands.setContent(data);
      });
    } else {
      console.log(
        'DDDDDDDDDDDDDDDDDDDDDDDDDDDD Data prop change matches editor content, no update needed.',
        data === currentVal,
      );
      resetUndo();
    }
  });

  function resetUndo() {
    if (!editor) return;
    const { state, view } = editor;
    const tr = state.tr;

    tr.setMeta('ADD_TO_HISTORY', false); // do not add this reset to history
    tr.setMeta('history$reset', true); // ProseMirror reset flag

    view.dispatch(tr);
  }

  //////////////
  //let menuItems: MenuItem[] = $state([]);
  let editor: Editor | null = $state(null);
  let element: HTMLDivElement;

  //////////////
  onMount(async () => {
    editor = new Editor({
      element: element,
      autofocus: 'start',
      extensions: [
        Document,
        Text,
        TextStyleKit,
        Color,
        History.configure({
          depth: 100, // default is 100
          newGroupDelay: 500, // group changes within 500ms
        }),
        HardBreak,
        Paragraph,
        Gapcursor,
        Dropcursor,
        CustomHorizontalRule,
        CustomHeading,
        CustomListItem,
        CustomBulletList,
        CustomOrderedList,
        CustomBold,
        CustomItalic,
        CustomStrike,
        CustomBlockquote,
        CustomCode,
        CustomCodeBlock,
        CustomUnderline,
        Highlight.configure({
          multicolor: true, // Allow multiple colors, including custom ones
        }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
          defaultProtocol: 'https',
        }),
        CustomTable.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Question,
        File,
        Collapsible,
        DataAsAnchors,
        CustomImage.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
      content: data,
      onTransaction: ({ editor, transaction }) => {
        // Check if the transaction actually modified the document
        if (transaction.docChanged) {
          dirty = dirty + 1;
        }
        // // Inline formatting state
        // tiptapUI.bold = editor.isActive('bold');
        // tiptapUI.italic = editor.isActive('italic');
        // tiptapUI.underline = editor.isActive('underline');
        // tiptapUI.strike = editor.isActive('strike');
        // tiptapUI.code = editor.isActive('code');

        // // headings

        // // Block formatting
        // if (editor.isActive('heading')) {
        //   const level = editor.getAttributes('heading').level;
        //   tiptapUI.blockStyle = `H${level}`;
        // } else {
        //   tiptapUI.blockStyle = '¶';
        // }

        // tiptapUI.align =
        //   editor.getAttributes('paragraph')?.textAlign ||
        //   editor.getAttributes('heading')?.textAlign ||
        //   'left';

        // // Combined list detection
        // if (editor.isActive('bulletList')) {
        //   tiptapUI.listStyle = 'bullet';
        // } else if (editor.isActive('orderedList')) {
        //   tiptapUI.listStyle = 'ordered';
        // } else {
        //   tiptapUI.listStyle = 'none';
        // }

        // tiptapUI.blockquote = editor.isActive('blockquote');
        // tiptapUI.codeBlock = editor.isActive('codeBlock');

        // tiptapUI.link = editor.isActive('link');

        // // Undo / Redo
        // tiptapUI.canUndo = editor.can().undo();
        // tiptapUI.canRedo = editor.can().redo();

        // // Highlight
        // tiptapUI.highlight = editor.isActive('highlight');

        // // color state
        // tiptapUI.textColor =
        //   editor.getAttributes('textStyle').color || '#000000';
        // tiptapUI.bgColor = editor.getAttributes('highlight').color || '#ffffff';

        // tiptapUI.imageSelected = editor.isActive('image');
        // tiptapUI.fileSelected = editor.isActive('file');
        // tiptapUI.collapseSelected = editor.isActive('collapsible');

        // // // Update menu items state regardless of content changes
        // menuItems.forEach(
        //   (item) =>
        //     (item.isActive = item.active ? (item.active() ?? false) : false),
        // );
      },
      editorProps: {
        handleDrop: dropImage,
        handleClickOn(view, pos, node, nodePos, event) {
          // prevents accidental navigation
          if ((event.target as HTMLElement)?.tagName === 'A') {
            event.preventDefault();
            return true;
          }
          return false;
        },
      },
    });
    //menuItems = createMenuItems(editor);
    editor.registerPlugin(linkHoverPlugin(editor));

    //////////////////
    editor.on('update', ({ editor }) => {
      console.log('Content updated, dirty:', dirty);
      setTimeout(() => (TabItems[id].data = editor.getHTML()));
    });
  });

  //////////////
  onDestroy(() => editor?.destroy());
</script>

{#if editor}
  <TiptapToolbar {editor} />
{/if}
<!-- 
{#snippet MenuButton(item: MenuItem)}
  <button
    type="button"
    title={item.name}
    class={cx('hover:bg-black hover:text-white w-5 h-6 rounded', {
      'bg-black text-white': item.isActive,
    })}
    onclick={() => item.command()}
  >
    <span class="flex items-center justify-center text-2xl">
      <Icon icon={item.icon} />
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
</div> -->

<div bind:this={element}></div>
