<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte';
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
    CustomLink,
    CustomTable,
  } from './Schema';

  import {
    CustomImage,
    dropImage,
  } from '$components/instruction/Image/ImageExtension';

  import Color from '@tiptap/extension-color';
  //import TextStyle from '@tiptap/extension-text-style';
  import { TextStyleKit } from '@tiptap/extension-text-style'
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

  import { MenuItem, createMenuItems } from './menuitem.svelte';
  import Icon from '@iconify/svelte';
  import cx from 'clsx';

  import { File } from '$components/instruction/File/FileExtension.svelte';
  //import { TabItems } from '../../routes/items.svelte';
  import { TabItems } from '../../../routes/items.svelte';

  let { id, data }: { id: number; data: string } = $props();

  //////////////
  $effect(() => {
    const currentVal = editor?.getHTML() ?? '';
    if (data !== currentVal) {
      untrack(() => {
        editor && editor.commands.setContent(data);
      });
    }
  });

  //////////////
  let menuItems: MenuItem[] = $state([]);
  let editor: Editor | null = null;
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
        History,
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
        CustomLink.configure({
          openOnClick: false,
          autolink: true,
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
        DataAsAnchors,
        CustomImage.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
      content: data,
      onTransaction: (e: any) => {
        menuItems.forEach(
          (item) =>
            (item.isActive = item.active ? (item.active() ?? false) : false),
        );
      },
      editorProps: {
        handleDrop: dropImage,
      },
    });
    menuItems = createMenuItems(editor);

    //////////////////
    editor.on('update', ({ editor }) =>
      setTimeout(() => (TabItems[id].data = editor.getHTML())),
    );
  });

  //////////////
  onDestroy(() => editor?.destroy());
</script>

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
</div>

<div bind:this={element}></div>
