import { Editor, Node, } from '@tiptap/core'
import { type Attrs } from "./model";

const NODE_NAME = 'file';
const CONTAINER_CLASS = 'border rounded-lg p-4 border-2 border-gray-500 max-w-md';
const DEFAULT_FILE_TYPES: string[] = ['.*'];
const DEFAULT_TITLE = 'File Upload';
const DEFAULT_INSTRUCTIONS = '';

////////////////////
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    File: {
      /**
       * Add a 'File' to the editor
       * @param attrs The File type
       * @example editor.commands.addFile('multiple')
       */
      addFile: (attrs?: Attrs) => ReturnType,
    }
  }
}

///////////////////////
export function getDefaultFileAttributes(): Attrs {
  return {
    fid: "0",//findFirstAvailableId(F_FILE_ID),
    title: DEFAULT_TITLE,
    caption: DEFAULT_INSTRUCTIONS,
    file_types: DEFAULT_FILE_TYPES,
  };
}

////////////////////
export const File = Node.create({
  name: NODE_NAME,
  atom: true,
  draggable: true, // Optional: to make the node draggable
  selectable: true,
  inline: false,
  group: 'block',

  // Add any 'new' attributes to the node
  addAttributes(this: any) {
    return {
      fid: {
        default: "0",   //findFirstAvailableId(DATA_ID),
      },
      title: {
        default: DEFAULT_TITLE,
      },
      caption: {
        default: DEFAULT_INSTRUCTIONS,
      },
      fileTypes: {
        default: DEFAULT_FILE_TYPES,
      },
    };
  },

  // A command to add a question to the editor
  addCommands() {
    return {
      ...this.parent?.(),
      addFile: (attrs?: Attrs) => ({ commands }: { commands: any }) => {
        if (!attrs) {
          attrs = getDefaultFileAttributes();
        } else {
           attrs.fid = "0"  //findFirstAvailableId(DATA_ID); // Overwrite the id
         }

         return commands.insertContent({
          type: this.name,
          attrs,
        });
      }
    };
  },

  // Since the document is stored as plain HTML, 
  // we need to parse the HTML to extract the file input attributes
  parseHTML() {
    console.log('parseHTML');
    return [
      {
        tag: 'div[data-fid][data-file-types][data-title][data-caption]',
        getAttrs: (dom) => {
          return {
            fid: "0", //dom.getAttribute('data-id'),
            title: dom.getAttribute('data-title'),
            caption: dom.getAttribute('data-caption'),
            fileTypes: JSON.parse(dom.getAttribute('data-file-types') || '[]'),
          };
        },
      },
    ];
  },

  // This called when the node is rendered to the editor (saved).
  // Just save the date attributes to the div element.
  renderHTML({ HTMLAttributes }) {
    console.log('renderHTML');
    return [
      'div',
      {
        'data-fid': "0", //HTMLAttributes.id,
        'data-title': HTMLAttributes.title,
        'data-caption': HTMLAttributes.caption,
        'data-file-types': JSON.stringify(HTMLAttributes.fileTypes),
      },
    ];
  },

  // This function provided the interactive behavior for the node.
  addNodeView() {
    return ({ node, editor }) => {

      // Container
      const container = document.createElement('div');
      container.className = CONTAINER_CLASS;
      container.setAttribute('data-fid', node.attrs.fid);
      container.setAttribute('data-title', node.attrs.title);
      container.setAttribute('data-caption', node.attrs.caption);
      container.setAttribute('data-file-types', JSON.stringify(node.attrs.fileTypes));

      // Title
      const titleValue = document.createElement('h2');
      titleValue.innerHTML = node.attrs.title;
      container.appendChild(titleValue);


      // Caption Label
      const captionLabel = document.createElement('div');
      captionLabel.className = 'label';
      container.appendChild(captionLabel);

      // Caption Text
      const captionValue = document.createElement('span');
      captionValue.innerHTML = node.attrs.caption; // Using innerHTML to render the bold HTML tags
      captionValue.className = 'label-text break-words whitespace-normal';
      captionLabel.appendChild(captionValue);

      // File input
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.className = 'file-input file-input-bordered w-full max-w-xs';
      fileInput.placeholder = 'Choose a file';
      fileInput.disabled = true;
      container.appendChild(fileInput);

      // Horizontal Rule
      const hr = document.createElement('hr');
      container.appendChild(hr);

      // Card Actions
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'flex items-center justify-between w-full';
      container.appendChild(actionsContainer);

      // File Types Display
      const fileTypesValue = document.createElement('p');
      fileTypesValue.className = 'text-left text-sm';
      fileTypesValue.innerHTML = '<b>Allowed File Types:</b> ' + node.attrs.fileTypes.join(', ');
      actionsContainer.appendChild(fileTypesValue);

      // Edit Button
      const editButton = document.createElement('button');
      editButton.className = 'text-right btn btn-primary';
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => createFileUploadDialog(editor, node));
      actionsContainer.appendChild(editButton);

      ////////////////////
      // Return the custom DOM element and update logic
      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== node.type.name) return false;
          titleValue.innerHTML = updatedNode.attrs.title;
          captionValue.innerHTML = updatedNode.attrs.caption;
          fileTypesValue.innerHTML = '<b>Allowed File Types:</b> ' + updatedNode.attrs.fileTypes.join(', ');
          return true;
        },
        selectNode: () => container.style.border = '2px solid blue',
        deselectNode: () => container.style.border = '',
      };
    };
  }
});

function createFileUploadDialog(editor: Editor, node: any) {
  // Create the container and insert the HTML
  const container = document.createElement('div');
  container.innerHTML = `
   <dialog class="modal" open="true">
    <div class="modal-box" method="dialog">
        <form>
            <fieldset class="fieldset">
                <label class="fieldset-label">Title:</label>
                <input id="title" type="text" class="input" required />
                <label class="fieldset-label">Caption:</label>
                <input id="caption" type="text" class="input" required placeholder="Enter caption" />
                <label class="fieldset-label">Select Allowed File Types:</label>
                <select id="file-types" name="fileTypes" multiple size="5" required>
                    <option value=".png">PNG Image (.png)</option>
                    <option value=".jpg">JPEG Image (.jpg)</option>
                    <option value=".jpeg">JPEG Image (.jpeg)</option>
                    <option value=".gif">GIF Image (.gif)</option>
                    <option value=".html">Web Page (.html)</option>
                    <option value=".pdf">PDF Document (.pdf)</option>
                    <option value=".plain">Text File (.txt)</option>
                    <option value=".doc">Word Document (.doc)</option>
                    <option value=".docx">Word Document (.docx)</option>
                    <option value=".xls">Excel Spreadsheet (.xls)</option>
                    <option value=".xlsx">Excel Spreadsheet (.xlsx)</option>
                    <option value=".json">JSON Data (.json)</option>
                    <option value=".yml">YAML Data (.yml)</option>
                    <option value=".yaml">YAML Data (.yaml)</option>
                    <option value=".zip">ZIP Archive (.zip)</option>
                    <option value="none">No Extension (none)</option>
                </select>
                <div class="modal-action">
                    <div class="flex gap-4 p-4">
                        <button id="save-btn" class="btn btn-primary" type="submit">Save</button>
                        <button id="cancel-btn" class="btn" type="button">Cancel</button>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</dialog>
`;

  // Add the container to the body
  document.body.appendChild(container);

  // Add event listeners to the buttons
  const dialog = container.querySelector('dialog');
  const saveButton = container.querySelector('#save-btn');
  const cancelButton = container.querySelector('#cancel-btn');
  const titleInput = container.querySelector('#title');
  const captionInput = container.querySelector('#caption');
  const fileTypesSelect = container.querySelector('#file-types');

  // Initialize with previously saved values
  if (titleInput) {
    (titleInput as HTMLInputElement).value = node.attrs.title || ''; // Set title value
  }
  if (captionInput) {
    (captionInput as HTMLInputElement).value = node.attrs.caption || ''; // Set caption value
  }
  const selectedFileTypes = node.attrs.fileTypes || [];

  // Set selected options in multi-select
  if (fileTypesSelect) {
    Array.from((fileTypesSelect as HTMLSelectElement).options).forEach((option) => {
      option.selected = selectedFileTypes.includes(option.value);
    });
  }

  saveButton?.addEventListener('click', (event) => {
    event.preventDefault();
    const titleElement = container.querySelector('#title');
    const title = titleElement ? (titleElement as HTMLInputElement).value : '';

    const captionElement = container.querySelector('#caption');
    const caption = captionElement ? (captionElement as HTMLInputElement).value : '';

    if (!caption.trim()) {
      alert('Please enter a caption.');
      return;
    }

    const fileTypesElement = container.querySelector('#file-types');
    const selectedFileTypes = fileTypesElement ? Array.from((fileTypesElement as HTMLSelectElement).selectedOptions).map((opt) => opt.value) : [];

    if (selectedFileTypes.length === 0) {
      alert('Please select at least one file type.');
      return;
    }

    // Update node attributes in the editor
    editor.chain().focus().updateAttributes(node.type.name, {
      title: title,
      caption: caption,
      fileTypes: selectedFileTypes,
    }).run();

    // Close modal
    dialog?.close();
    container.remove();
  });

  cancelButton?.addEventListener('click', () => {
    const dialog = container.querySelector('dialog');
    dialog?.close(); // Close the dialog
    container.remove();
  });

  return container;
}

//////////////////////////////////

// function createFileUploadDialog(editor:Editor, node:any) {
//   // Create dialog container
//   const container = document.createElement('div');
//   container.setAttribute('x-data', '{ openDlg: true }');

//   // Dialog element
//   const dialog = document.createElement('dialog');
//   dialog.setAttribute(':open', 'openDlg');

//   const article = document.createElement('article');

//   // Header
//   const titleer = document.createElement('titleer');
//   titleer.innerHTML = `<strong>File Upload Properties</strong>`;
//   article.appendChild(titleer);

//   // Form
//   const form = document.createElement('form');
//   form.className = 'card-body';

//   // Caption input
//   const formControl = document.createElement('div');
//   formControl.className = 'form-control';

//   const label = document.createElement('label');
//   label.className = 'label';
//   const labelText = document.createElement('span');
//   labelText.className = 'label-text';
//   labelText.textContent = 'Caption';
//   label.appendChild(labelText);

//   const captionInput = document.createElement('input');
//   captionInput.type = 'text';
//   captionInput.placeholder = 'Place file upload instructions here.';
//   captionInput.className = 'input input-bordered';
//   captionInput.required = true;
//   formControl.appendChild(label);
//   formControl.appendChild(captionInput);
//   form.appendChild(formControl);

//   // File types multi-select
//   const fileTypeTitle = document.createElement('h2');
//   fileTypeTitle.className = 'text-xl mb-4';
//   fileTypeTitle.textContent = 'Select Allowed File Types:';
//   form.appendChild(fileTypeTitle);

//   const select = document.createElement('select');
//   select.name = 'fileTypes';
//   select.multiple = true;
//   select.size = 10;
//   select.className = 'select select-bordered w-full';
//   select.required = true;

//   const mimeTypes = [
//     { value: 'image/png', label: 'PNG Image (.png)' },
//     { value: 'image/jpeg', label: 'JPEG Image (.jpg, .jpeg)' },
//     { value: 'image/gif', label: 'GIF Image (.gif)' },
//     { value: 'application/pdf', label: 'PDF Document (.pdf)' },
//     { value: 'text/plain', label: 'Text File (.txt)' },
//     { value: 'application/msword', label: 'Word Document (.doc)' },
//     { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'Word Document (.docx)' },
//     { value: 'application/vnd.ms-excel', label: 'Excel Spreadsheet (.xls)' },
//     { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'Excel Spreadsheet (.xlsx)' },
//     { value: 'application/zip', label: 'ZIP Archive (.zip)' },
//     { value: 'application/x-rar-compressed', label: 'RAR Archive (.rar)' },
//   ];

//   mimeTypes.forEach((type) => {
//     const option = document.createElement('option');
//     option.value = type.value;
//     option.textContent = type.label;
//     select.appendChild(option);
//   });
//   form.appendChild(select);

//   // Buttons
//   const buttonContainer = document.createElement('div');
//   buttonContainer.className = 'flex gap-4 p-4';

//   const saveButton = document.createElement('button');
//   saveButton.className = 'btn btn-primary';
//   saveButton.type = 'submit';
//   saveButton.textContent = 'Save';
//   buttonContainer.appendChild(saveButton);

//   const cancelButton = document.createElement('button');
//   cancelButton.className = 'btn';
//   cancelButton.type = 'button';
//   cancelButton.textContent = 'Cancel';
//   cancelButton.addEventListener('click', () => {
//     dialog.close();
//     container.remove();
//   });
//   buttonContainer.appendChild(cancelButton);

//   form.appendChild(buttonContainer);
//   article.appendChild(form);
//   dialog.appendChild(article);
//   container.appendChild(dialog);
//   document.body.appendChild(container);

//   // Handle form submission
//   form.addEventListener('submit', (event) => {
//     event.preventDefault();

//     const caption = captionInput.value;
//     const selectedFileTypes = Array.from(select.selectedOptions).map((option) => option.value);

//     editor.chain().focus().updateAttributes(node.type.name, {
//       caption: caption,
//       fileTypes: selectedFileTypes,
//     }).run();

//     dialog.close();
//     container.remove();
//   });

//   return container;
// }

