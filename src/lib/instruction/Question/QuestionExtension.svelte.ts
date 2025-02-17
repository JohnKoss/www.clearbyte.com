import { mount } from 'svelte'
import MultipleSelectDlg from './MultipleSelectDlg.svelte'
import { type Editor, Node, } from '@tiptap/core'
import { type Attrs } from "./model";
import { DOMSerializer, type DOMOutputSpec } from '@tiptap/pm/model';
import { findFirstAvailableId } from "../utils";

const DATA_ID = 'data-qid';
const DLG_ID = 'questionDlg-';

const QUESTION_TYPE_TRUE_FALSE = '1';
const QUESTION_TYPE_MULTIPLE_CHOICE = '2';
const QUESTION_TYPE_MULTIPLE_ANSWERS = '3';
const QUESTION_TYPE_SHORT_ANSWER = '4';
const QUESTION_TYPE_ESSAY = '5';


////////////////////
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    Question: {
      /**
       * Add a 'question' to the editor
       * @param attrs The question type
       * @example editor.commands.addQuestion('multiple')
       */
      addQuestion: (attrs: Attrs, showDlg?: boolean) => ReturnType,
    }
  }
}

///////////////////////
export function getDefaultQuestionAttributes(): Attrs {

  return {
    qid: findFirstAvailableId(DATA_ID), 
    type: QUESTION_TYPE_MULTIPLE_CHOICE, // Multiple choice
    points: '5',
    questionText: 'Sample question text',
    options: [
      { text: 'Option 1', selected: false },
      { text: 'Option 2', selected: false },
    ],
  };
}

////////////////////
export const Question = Node.create({
  name: 'question',
  atom: true,
  draggable: true, // Optional: to make the node draggable
  selectable: true,
  inline: false,
  group: 'block',

  // Add any 'new' attributes to the node
  addAttributes(this: any) {
    return {
      qid: {
        default: findFirstAvailableId(DATA_ID), 
      },
      type: {
        default: '0',
      },
      points: {
        default: '0',
      },
      questionText: {
        default: '',
      },
      options: {
        default: [],
      },
    };
  },

  // A command to add a question to the editor
  addCommands() {
    return {
      ...this.parent?.(),
      addQuestion: (attrs: Attrs) => ({ commands }: { commands: any }) => {
        attrs.qid = findFirstAvailableId(DATA_ID); // Overwrite the id
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
        tag: 'div[data-qid][data-type][data-points][data-points][data-question-text][data-options]',
        getAttrs: dom => {
          const element = dom as HTMLElement;
          return {
            qid: element.getAttribute('data-qid'),
            type: element.getAttribute('data-type'),
            points: element.getAttribute('data-points'),
            questionText: element.getAttribute('data-question-text'),
            options: JSON.parse(element.getAttribute('data-options') || '[]'),
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
        'data-qid': HTMLAttributes.qid,
        'data-type': HTMLAttributes.type,
        'data-points': HTMLAttributes.points,
        'data-question-text': HTMLAttributes.questionText,
        'data-options': JSON.stringify(HTMLAttributes.options),
      },
    ];
  },

  // This function provided the interactive behavior for the node.
  addNodeView(this: any) {
    return ({ editor, node, getPos, HTMLAttributes, decorations, extension }) => {

      let domQ = document.getElementById(HTMLAttributes.qid)
      if (domQ === null) {

        // Needed for the editor to render the node. 
        // Not saved as final HTML.
        domQ = document.createElement("div");
        const rendered = DOMSerializer.renderSpec(document, questionNodeSpec(HTMLAttributes as Attrs));
        domQ.appendChild(rendered.dom);
      }

      // Add a dblclick event listener to the domQ
      domQ.addEventListener('dblclick', () => {
        // Get the current attributes of the node
        // and let the user edit them in a dialog
        const pos = getPos();
        const node = editor.state.doc.nodeAt(pos);
        if (node) showQuestionDlg(editor, node.attrs as Attrs, pos);
      });

      // Return the node view object
      const domQFirstChild = domQ.firstChild as HTMLElement;
      return {
        dom: domQ,
        selectNode: () => domQFirstChild.style.border = '2px solid blue',
        deselectNode: () => domQFirstChild.style.border = '',
      };
    };
  }
});

//////
function showQuestionDlg(editor: Editor, attrs: Attrs, pos: number): HTMLDialogElement {
  const modal = Object.assign(document.createElement('dialog'), { id: DLG_ID + attrs.qid, className: 'modal modal-open font-normal' });
  mount(MultipleSelectDlg, {
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

          // Update the existingQuestion DOM element with the new attributes
          //const domQuestion = document.getElementById(String(attrs.qid))
          const domQuestion = document.querySelector(`[qid="${attrs.qid}"]`);
          if (domQuestion) {
            const rendered = DOMSerializer.renderSpec(document, questionNodeSpec(attrs));
            domQuestion.replaceWith(rendered.dom);
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
const questionNodeSpec = (HTMLAttributes: Attrs): DOMOutputSpec => {
  const { qid, type, points, questionText, options } = HTMLAttributes;

  if (type != QUESTION_TYPE_MULTIPLE_CHOICE) {
    return ['div', { class: 'text-red-500' }, 'Unsupported question type'];
  }

  return [
    'div',
    {
      'data-qid': qid,
      'data-type': type,
      'data-points': points,
      'data-question-text': questionText,
      'data-options': JSON.stringify(options),
      class: "border rounded-lg p-4 border-2 border-gray-500 max-w-md",
    },
    [
      'div',
      { class: 'flex justify-between items-center w-full' },
      [
        'h3',
        { class: 'text-left text-gray-500 opacity-75 font-bold' },
        `Question ${Number(qid) + 1}`,
      ],
      [
        'span',
        {
          id: 'points',
          class: 'text-right badge badge-primary badge-outline'
        },
        `${points} pts`,
      ],
    ],
    ['h3', { id: 'question-text', class: 'text-left font-bold' }, questionText],
    // pass an index too        
    ...options.map((option: { text: any; selected: any; }, index: number) => [
      'div',
      { class: 'form-control pl-4' },
      [
        'label',
        { class: 'label cursor-pointer' },
        [
          'span',
          {
            id: 'option-text-' + qid + index,
            class: 'label-text'
          },
          option.text,
        ],
        [
          'input',
          {
            id: 'option-value-' + qid + index,
            type: 'radio',
            name: 'question-' + qid, // For grouping the radio buttons
            class: 'radio checked:bg-red-500',
            value: option.text,
            checked: option.selected ? 'checked' : undefined,
            disabled: true,
          },
        ],
      ],
    ]),
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
