import { Editor } from "@tiptap/core";
import { chooseImage } from "./Image/ImageExtension";
import { IMG_STYLE_LEFT } from "$components/instruction/Image/const";
import { getDefaultQuestionAttributes } from "./Question/QuestionExtension.svelte";

///////////////////////////
export class MenuItem {
  name: string;
  icon: string;
  command: () => void;
  active: (() => boolean | null) | undefined;
  isActive: boolean = $state(false);
  separator: boolean = false;

  constructor(
    name: string,
    icon: string,
    command: () => void,
    active?: () => boolean | null,
    separator: boolean = false,
  ) {
    this.name = name;
    this.icon = icon;
    this.command = command;
    this.active = active;
    this.separator = separator;
  }
}

export class MenuItems {
  static menuItems: MenuItem[] = [];
  static Add(menuItems: MenuItem[]) {
    this.menuItems = menuItems;
  }
  static Update() {
    this.menuItems.forEach(item => item.isActive = item.active ? item.active() ?? false : false);
  }
}
//////////////////////
// TODO: Make this a Svelte component or prettier.
function chooseTable(callback: (tableData: { rows: number; cols: number; withHeaderRow: boolean }) => void) {

  // create a daisyUI modal
  const modal = document.createElement('dialog');
  modal.className = 'modal modal-open font-normal';
  modal.innerHTML = `
  <div class="modal-box p-4">
     <h3 class="text-lg font-bold">Rows</h3>
    <input type="number" id="table-rows" class="w-full mb-4" value="3">
     <h3 class="text-lg font-bold">Columns</h3>
    <input type="number" id="table-cols" class="w-full mb-4" value="3">
    <label class="block mb-2">
      <input type="checkbox" id="table-header-row" class="mr-2">
      <h3 class="text-lg font-bold">Header Row</h3>
    </label>
   <div class="modal-action">
      <button id="insert-table" class="btn btn-primary">Insert table</button>
      <button id="cancel" class="btn">Cancel</button>
    </div>
  </div> `;
  document.body.appendChild(modal);

  // open the modal
  modal.showModal();

  // Event listener for the insert button
  document.getElementById('insert-table')?.addEventListener('click', () => {
    const rows = (document.getElementById('table-rows') as HTMLInputElement).valueAsNumber;
    const cols = (document.getElementById('table-cols') as HTMLInputElement).valueAsNumber;
    const withHeaderRow = (document.getElementById('table-header-row') as HTMLInputElement).checked;

    callback({ rows, cols, withHeaderRow });

    // Close and remove the modal
    modal.close();
    document.body.removeChild(modal);
  });

  // Event listener for the cancel button
  document.getElementById('cancel')?.addEventListener('click', () => {
    // Close and remove the modal
    modal.close();
    document.body.removeChild(modal);
  });
}

//////////////////////
function chooseColor(callback: (color: string) => void) {
  // Create a DaisyUI modal
  const modal = document.createElement('dialog');
  modal.className = 'modal modal-open font-normal';
  modal.innerHTML = `
  <div class="modal-box p-4">
    <h3 class="text-lg font-bold mb-4">Choose Color</h3>
    <label class="block mb-2">Color</label>
    <input type="color" id="color-input" class="w-full mb-4">
    <div class="modal-action">
      <button id="choose-color" class="btn btn-primary">Choose</button>
      <button id="cancel" class="btn">Cancel</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  // Open the modal
  modal.showModal();

  // Event listener for the choose button
  document.getElementById('choose-color')?.addEventListener('click', () => {
    const color = (document.getElementById('color-input') as HTMLInputElement).value;
    callback(color);

    // Close and remove the modal
    modal.close();
    document.body.removeChild(modal);
  });

  // Event listener for the cancel button
  document.getElementById('cancel')?.addEventListener('click', () => {
    // Close and remove the modal
    modal.close();
    document.body.removeChild(modal);
  });
}

//////////////////////
function chooseAnchor(editor: Editor, callback: (url: string) => void) {
  const previousUrl = editor.getAttributes('link').href || 'https://';

  const modal = document.createElement('dialog');
  modal.className = 'modal modal-open font-normal';
  modal.innerHTML = `
  <div class="modal-box p-4">
    <h3 class="text-lg font-bold mb-4">Enter URL</h3>
    <label class="block mb-2">URL</label>
    <input type="text" id="url-input" class="input w-full mb-4" value="${previousUrl}">
    <p id="error-message" class="text-red-500 text-sm hidden">Invalid URL. Please enter a valid URL.</p>
    <div class="modal-action">
      <button id="choose-url" class="btn btn-primary">Ok</button>
      <button id="cancel" class="btn">Cancel</button>
    </div>
  </div>`;
  document.body.appendChild(modal);

  // Open the modal
  modal.showModal();

  // Event listener for the choose button
  document.getElementById('choose-url')?.addEventListener('click', () => {
    const urlInput = document.getElementById('url-input') as HTMLInputElement;
    const url = urlInput.value.trim();

    try {
      new URL(url); // Built-in validation
      callback(url);
      modal.close();
      document.body.removeChild(modal);
    } catch (err) {
      console.error(err);
      const errorMessage = document.getElementById('error-message') as HTMLParagraphElement;
      errorMessage.classList.remove("hidden"); // Show error message
      return
    }
  });

  // Event listener for the cancel button
  document.getElementById('cancel')?.addEventListener('click', () => {
    modal.close();
    document.body.removeChild(modal);
  });
}
//////////////////////
export function createMenuItems(editor: Editor): MenuItem[] {
  return [
    new MenuItem(
      "bold",
      "mdi:format-bold",
      () =>
        editor.chain().focus().toggleBold().run(),
      () => editor.isActive("bold"),
    ),
    new MenuItem(
      "italic",
      "mdi:format-italic",
      () =>
        editor.chain().focus().toggleItalic().run(),
      () => editor.isActive("italic"),
    ),
    new MenuItem(
      "underline",
      "mdi:format-underline",
      () => editor.chain().focus().toggleUnderline().run(),
      () => editor.isActive("underline"),
    ),
    new MenuItem(
      "strike through",
      "mdi:format-strikethrough",
      () => editor.chain().focus().toggleStrike().run(),
      () => editor.isActive("strike"),
    ),
    new MenuItem(
      "highlight",
      "mdi:format-color-highlight",
      () => editor.chain().focus().toggleHighlight().run(),
      () => editor.isActive("highlight"),
    ),
    new MenuItem(
      "color",
      "mdi:palette",
      () => {
        chooseColor((color) => {
          editor.chain().focus().setColor(color).run();
        });
      },
      () => {
        const currentColor = editor.getAttributes('textStyle').color
        return editor.isActive('textStyle', { color: currentColor });
      },
    ),
    new MenuItem(
      "background-color",
      "mdi:palette-swatch",
      () => {
        chooseColor((color) => {
          editor.chain().focus().setHighlight({ color: 'bg-red-200' }).run()
          editor.chain().focus().toggleHighlight({ color }).run()
        });
      },
      () => {
        const currentBackgroundColor = editor.getAttributes('textStyle').backgroundColor;
        return editor.isActive('textStyle', { backgroundColor: currentBackgroundColor });
      },
      true,
    ),
    new MenuItem(
      "h1",
      "mdi:format-header-1",
      () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      () => editor.isActive("heading", { level: 1 }),
    ),
    new MenuItem(
      "h2",
      "mdi:format-header-2",
      () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      () => editor.isActive("heading", { level: 2 }),
    ),
    new MenuItem(
      "p",
      "mdi:format-paragraph",
      () => editor.chain().focus().setParagraph().run(),
      () => editor.isActive("paragraph"),
    ),

    new MenuItem(
      "text-align-left",
      "mdi:format-align-left",
      () => editor.chain().focus().setTextAlign("left").run(),
      () => editor.isActive({ textAlign: "left" }),// || editor.isActive("image", { style: IMG_STYLE_LEFT }),
    ),
    new MenuItem(
      "text-align-center",
      "mdi:format-align-center",
      () => editor.chain().focus().setTextAlign("center").run(),
      () => editor.isActive({ textAlign: "center" }),// || editor.isActive("image", { style: IMG_STYLE_LEFT }),
    ),
    new MenuItem(
      "text-align-right",
      "mdi:format-align-right",
      () => editor.chain().focus().setTextAlign("right").run(),
      () => editor.isActive({ textAlign: "right" }),// || editor.isActive("image", { style: IMG_STYLE_RIGHT }),
    ),
    new MenuItem(
      "hard-break",
      "mdi:arrow-down-bold",
      () => editor.chain().focus().setHardBreak().run(),
      () => editor.isActive("hardBreak"),
      true,
    ),

    new MenuItem(
      "code",
      "mdi:code-tags",
      () => editor.chain().focus().toggleCode().run(),
      () => editor.isActive("code"),
      true,
    ),
    new MenuItem(
      "bullet-list",
      "mdi:format-list-bulleted",
      () => editor.chain().focus().toggleBulletList().run(),
      () => editor.isActive("bulletList"),
    ),
    new MenuItem(
      "numbered-list",
      "mdi:format-list-numbered",
      () => editor.chain().focus().toggleOrderedList().run(),
      () => editor.isActive("orderedList"),
      true,
    ),
    new MenuItem(
      "horizontal-rule",
      "mdi:minus",
      () => editor.chain().focus().setHorizontalRule().run(),
      () => editor.isActive("horizontalRule"),
    ),

    new MenuItem(
      "blockquote",
      "mdi:format-quote-open",
      () => editor.chain().focus().toggleBlockquote().run(),
      () => editor.isActive("blockquote"),
    ),
    new MenuItem(
      "code-block",
      "mdi:code-braces",
      () => editor.chain().focus().toggleCodeBlock().run(),
      () => editor.isActive("codeBlock"),
      true,
    ),
    new MenuItem(
      "link",
      "mdi:link",
      () => {
        chooseAnchor(editor, (url) => {
          console.log(url);
          if (url === null) return; // User canceled input
          if (url.trim() === "") {
            editor.chain().focus().unsetLink().run();
          } else {
            editor.chain().focus().toggleLink({ href: url, target:"_blank", rel:"noopener noreferrer" }).run();
          }
        });
      },
      () => editor.isActive("link"),
    ),
    new MenuItem(
      "image",
      "mdi:image",
      () => {
        chooseImage((imageData) => {
          const imageAttributes = {
            src: imageData.src,
            alt: imageData.name,
            title: imageData.name,
            width: imageData.width,
            height: imageData.height,
            style: IMG_STYLE_LEFT
          };

          editor.chain().focus().setImage(imageAttributes).run();
        });
      },
      () => editor.isActive("image"),
    ),
    new MenuItem(
      "table",
      "mdi:table",
      () => {
        chooseTable((tableData) => {
          const tableAttributes = {
            rows: tableData.rows,
            cols: tableData.cols,
            withHeaderRow: tableData.withHeaderRow,
          };
          editor.chain().focus().insertTable(tableAttributes).run();
        });
        //editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

      },
      () => editor.isActive("table"),
      true,
    ),
    new MenuItem(
      "undo",
      "mdi:undo",
      () => editor.chain().focus().undo().run(),
      () => editor.isActive("undo"),
    ),
    new MenuItem(
      "redo",
      "mdi:redo",
      () => editor.chain().focus().redo().run(),
      () => editor.isActive("redo"),
      true,
    ),
    new MenuItem(
      "question",
      "mdi:question-mark",
      () => editor.chain().focus().addQuestion(getDefaultQuestionAttributes()).run(),
      () => editor.isActive("question"),
    ),
    new MenuItem(
      "file",
      "mdi:file-upload",
      () => editor.chain().focus().addFile().run(),
      () => editor.isActive("file"),
      true,
    ),
    new MenuItem(
      "open",
      "mdi:folder-open",
      //openFile,
      () => false,
    ),
  ];
}