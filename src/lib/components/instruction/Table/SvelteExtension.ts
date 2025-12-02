import { Node, mergeAttributes } from '@tiptap/core';
import { SvelteNodeViewRenderer } from 'svelte-tiptap';
import Table from './Table.svelte';


/////////////
export const TableExtension = Node.create({
  name: 'tableComponent',
  group: 'block',
  content: 'block+',
  atom: true,
  draggable: true, 
  selectable: true,

  addAttributes() {
    return {
      id: "",
      headings: [],
      data: [[]],
    };
  },

  parseHTML() {
    return [{ tag: 'table' }]
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'table',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ]
  },
 
  addNodeView() {
    return SvelteNodeViewRenderer(Table);
  },
});
