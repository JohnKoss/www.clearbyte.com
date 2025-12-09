
// lib/stores/tiptap-ui.svelte.ts
export const tiptapUI = $state({
    // formatting
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    code: false,

    // colors
    textColor: '#000000',
    bgColor: '#ffffff',

    // Highlight
    highlight: false,

    // blocks
    blockStyle: 'paragraph',

    listStyle: 'none',

    blockquote: false,
    codeBlock: false,

    align: 'left',
    horizontalRule: false,

    link: false,

    // history
    canUndo: false,
    canRedo: false,

    // state
    dirty: 0,
});
