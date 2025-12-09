import { mount } from 'svelte'
import CollapsibleDlg from './Collapsible.svelte';
import { type Editor, Node, } from '@tiptap/core'
import { type Attrs } from "./model";
import { DOMSerializer, type DOMOutputSpec } from '@tiptap/pm/model';
import { findFirstAvailableId } from "../utils";

const COLLAPSIBLE_ID = 'data-cbid';
const DLG_ID = 'collapsibleDlg-';


////////////////////
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Collapsible: {
      /**
       * Add a 'question' to the editor
       * @param attrs The question type
       * @example editor.commands.addCollapsible({ cbid: "0", title: "My Collapsible" })
       */
      addCollapsible: (attrs: Attrs, showDlg?: boolean) => ReturnType,
    }
  }
}

///////////////////////
export function getDefaultCollapsibleAttributes(): Attrs {

  return {
    cbid: findFirstAvailableId(COLLAPSIBLE_ID),
    title: "",
    content: "",
  };
}

////////////////////
export const Collapsible = Node.create({
  name: 'collapsible',
  atom: true,
  draggable: true, // Optional: to make the node draggable
  selectable: true,
  inline: false,
  group: 'block',

  // Add any 'new' attributes to the node
  addAttributes(this: any) {
    return {
      cbid: {
        default: "0" //findFirstAvailableId(DATA_ID), 
      },
      title: {
        default: ""
      },
      content: {
        default: ""
      },
    };
  },

  // A command to add a code block to the editor
  addCommands() {
    return {
      ...this.parent?.(),
      addCollapsible: (attrs: Attrs) => ({ commands }: { commands: any }) => {
        attrs.cbid = findFirstAvailableId(COLLAPSIBLE_ID); // Overwrite the id
        return commands.insertContent({
          type: this.name,
          attrs,
        });
      }
    };
  },

  // Since the document is stored as plain HTML, 
  // we need to parse the HTML to extract the question attributes
  parseHTML() {
    return [
      {
        tag: 'div[data-cbid]',
        getAttrs: dom => {
          const element = dom as HTMLElement;
          return {
            cbid: element.getAttribute('data-cbid') || "0",
            title: element.getAttribute('data-title') || "", // No title in the HTML, so default to empty string
            content: element.getAttribute('data-content') || "", // No content in the HTML, so default to empty string
          };
        },
      },
    ];
  },

  // This called when the node is rendered to the editor (saved).
  // Just save the date attributes to the div element.
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-cbid': HTMLAttributes.cbid,
        'data-title': HTMLAttributes.title,
        'data-content': HTMLAttributes.content,
      },
    ];
  },

  // This function provided the interactive behavior for the node.
  addNodeView(this: any) {
    return ({ editor, node, getPos, HTMLAttributes, decorations, extension }) => {

      let domCollapsible = document.getElementById(HTMLAttributes.cbid)
      if (domCollapsible === null) {

        // Needed for the editor to render the node. 
        // Not saved as final HTML.
        domCollapsible = document.createElement("div");
        const rendered = DOMSerializer.renderSpec(document, collapsibleNodeSpec(HTMLAttributes as Attrs));
        domCollapsible.appendChild(rendered.dom);
      }

      // Add a click event listener to the edit button
      domCollapsible.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        if (target.id === 'id-edit') {
          // Get the current attributes of the node
          // and let the user edit them in a dialog
          const pos = getPos();
          const node = editor.state.doc.nodeAt(pos as number);
          if (node) showCollapsibleDlg(editor, node.attrs as Attrs, pos as number).showModal();
        }
      });

      // Return the node view object
      const domCollapsibleFirstChild = domCollapsible.firstChild as HTMLElement;
      return {
        dom: domCollapsible,
        selectNode: () => domCollapsibleFirstChild.style.border = '2px solid blue',
        deselectNode: () => domCollapsibleFirstChild.style.border = '',
      };
    };
  }
});

//////
function showCollapsibleDlg(editor: Editor, attrs: Attrs, pos: number): HTMLDialogElement {
  const modal = Object.assign(document.createElement('dialog'), { id: DLG_ID + attrs.cbid, className: 'modal modal-open font-normal' });
  mount(CollapsibleDlg, {
    target: modal,
    props: {
      closeModal: (attrs: Attrs | null) => {
        modal.remove();
        if (attrs) {
          // Update the PM node with the new attributes... this won't update the DOM
          const node = editor.state.doc.nodeAt(pos);
          if (!node) return;

          const updatedNode = node.type.create(
            { ...attrs },
            node.content,
            node.marks
          );
          editor.view.dispatch(editor.view.state.tr.replaceWith(pos, pos + node.nodeSize, updatedNode));

          // Update the existingCollapsible DOM element with the new attributes
          const domCollapsible = document.querySelector(`[data-cbid="${attrs.cbid}"]`);
          if (domCollapsible) {
            const rendered = DOMSerializer.renderSpec(document, collapsibleNodeSpec(attrs));
            domCollapsible.replaceWith(rendered.dom);
          }
        }
      },
      attrs,
    },
  })
  document.body.appendChild(modal);
  return modal;
}

/////////////////////////////////
const collapsibleNodeSpec = (HTMLAttributes: Attrs): DOMOutputSpec => {
  const { cbid, title, content } = HTMLAttributes;

  return [
    'div',
    {
      'data-cbid': cbid,
      'data-title': title,
      'data-content': content,
      class: "border rounded-lg border-2 border-gray-200 max-w-xl",
    },
    [
      'details',
      {
        tabindex: '0',
        class: 'collapse collapse-arrow bg-base-100 border-base-300 border',
      },

      // ✅ Title Row
      [
        'summary',
        {
          class: 'collapse-title font-semibold pe-4 ps-4',
        },
        [
          'div',
          {
            class: 'flex items-center gap-2',
          },
          [
            'button',
            {
              id: 'id-edit',
              class: 'btn btn-primary btn-xs',
              type: 'button'
            },
            'Edit',
          ],
          [
            'span',
            {},
            title || 'Code Block',
          ],
        ],
      ],

      // ✅ Content
      [
        'div',
        { class: 'collapse-content' },
        [
          'pre',
          { class: 'bg-gray-100 p-2 rounded overflow-x-auto mt-2' },
          [
            'code',
            {},
            content || ''
          ]
        ]
      ]
    ]
  ];
};

////////////////////
function findFirstAvailableQid(): string {
  // Collect all existing `qid` values as numbers
  const elements = document.querySelectorAll(`[data-qid]`) as NodeListOf<HTMLElement>;
  const qids = Array.from(elements)
    .map((el) => parseInt(el.getAttribute("data-qid") || "-1", 10))
    .filter((qid) => qid >= 0);

  // Sort the `qids` in ascending order
  qids.sort((a, b) => a - b);

  // Find the first missing number in the sequence
  let availableQid = 0;
  for (const qid of qids) {
    if (qid !== availableQid) {
      return availableQid.toString();
    }
    availableQid++;
  }

  // If no gaps were found, return the next number after the largest `qid`
  return availableQid.toString();
}

// getAttrs: (element) => {
//   // Extract the `qid` from the container's attribute
//   const qid = element.getAttribute("qid");

//   // Extract the points from the span with id "points"
//   const pointsText = element.querySelector("#points")?.textContent;
//   const points = pointsText ? parseInt(pointsText.replace(" pts", ""), 10) : 0;

//   // Extract the question text from the h3 with id "question-text"
//   const questionText = element.querySelector("#question-text")?.textContent || "";

//   // Extract options, each within a "form-control pl-4" div
//   const options = Array.from(element.querySelectorAll(".form-control")).map((optionContainer, index) => {
//     const optionText = optionContainer.querySelector(`#option-text-${qid}${index}`)?.textContent || "";
//     const optionInput = optionContainer.querySelector(`#option-value-${qid}${index}`);
//     const selected = (optionInput as HTMLInputElement)?.checked || false;

//     return {
//       text: optionText,
//       selected: selected,
//     };
//   });

//   return { qid, points, questionText, options, };
// }
