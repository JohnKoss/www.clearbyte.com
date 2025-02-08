import { Node } from '@tiptap/core';
import type { Attrs } from '@tiptap/pm/model';

////////////////////
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    DataAsAnchors: {
      /**
       * Add a 'question' to the editor
       * @param attrs The question type
       * @example editor.commands.addQuestion('multiple')
       */
      setDataAsAnchors: (attrs: Attrs) => ReturnType,
    }
  }
}

export const DataAsAnchors = Node.create({
  name: 'dataAsAnchors',

  group: 'block',

  content: 'text*',

  parseHTML() {
    return [
      {
        tag: 'div[data-xxx][data-yyy]',
        getAttrs: dom => {
          const element = dom as HTMLElement;
          return {
            xxx: element.getAttribute('data-xxx'),
            yyy: element.getAttribute('data-yyy'),
          };
        },
      },
    ];
  },

  // Responsible for defining how a node (or mark) is serialized into HTML.
  renderHTML({ HTMLAttributes }) {
    const { xxx, yyy, ...rest } = HTMLAttributes;

    // Store all attributes on the div
    return [
      'div',
      { ...rest, 'data-xxx': xxx, 'data-yyy': yyy },
      ['a', { href: xxx }, xxx],
      ['a', { href: yyy }, yyy],
    ];
  },

  addAttributes() {
    return {
      xxx: {
        default: null, // No default value; optional
      },
      yyy: {
        default: null, // No default value; optional
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setDataAsAnchors: (attrs: Attrs) => ({ commands }: { commands: any }) => {
        return commands.insertContent({
          type: this.name,
          attrs: attrs,
        });
      },
    };
  },

});
