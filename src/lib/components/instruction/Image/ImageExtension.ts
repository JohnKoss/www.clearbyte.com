import { mount, unmount } from 'svelte'
import ImageContextMenu from './ImageContextMenu.svelte'
import { IMG_STYLE_LEFT} from "./const";
import {
  mergeAttributes,
  Editor,
} from '@tiptap/core'

const MENU_ID = 'context-menu';

/// https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing
import { Image as ImageOrg } from "@tiptap/extension-image";
import type { EditorView } from '@tiptap/pm/view';
//import type { type Editor } from '@tiptap/core';
export const CustomImage = ImageOrg.extend({

  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: 0 },
      height: { default: 0 },
      style: { default: IMG_STYLE_LEFT },
    }
  },

  addOptions() {
    return {
      ...this.parent?.(),
      HTMLAttributes: { },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: this.options.allowBase64
          ? 'img[src]'
          : 'img[src]:not([src^="data:"])',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addNodeView() {
    return ({ editor, node, getPos, HTMLAttributes, decorations, extension }) => {
      const container = document.createElement('img'); // Use span for inline element

      // Set the src and other attributes for the image
      container.src = node.attrs.src;
      container.alt = node.attrs.alt;
      container.title = node.attrs.title;
      container.width = node.attrs.width;
      container.height = node.attrs.height;
      container.setAttribute('style', node.attrs.style);

      // add double click event listener    
      container.addEventListener('dblclick', () => {
        chooseImage((imageData) => {
          const imageAttributes = {
            src: imageData.src,
            alt: imageData.name,
            title: imageData.name,
            width: imageData.width,
            height: imageData.height,
            style:"right"
          };
          editor.chain().focus().setImage(imageAttributes).run();
        });
      })

      // Add context menu event listener
      container.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showContextMenu(event, editor, getPos);
      });
      
      return {
        dom: container,
        selectNode: () => {
          editor.commands.focus();    
          container.className = 'border-4 border-blue-500';
        },
        deselectNode: () => {
          container.className = '';
          const menu = document.getElementById(MENU_ID);
          if (menu) {
            unmount(ImageContextMenu);
            menu.remove();
          }
        },
        update(node, decorations, innerDecorations) {
          if (node.type.name !== 'image') {
            return false
          }
          container.src = node.attrs.src;
          container.alt = node.attrs.alt;
          container.title = node.attrs.title;
          container.width = node.attrs.width;
          container.height = node.attrs.height;
          container.setAttribute('style', node.attrs.style);
          return true;
        },
        stopEvent: () => false,
        destroy() { }        
      }
    }
  },
});


// Function to show context menu
function showContextMenu(event: MouseEvent, editor: Editor, getPos: () => number) {
  
  //const container = Object.assign(document.createElement('dialog'), { id: "image_modal", className: 'modal modal-open font-normal' });
  const menu = document.createElement('div');
  menu.id = MENU_ID;
  menu.style.position = 'absolute';
  menu.style.top = `${event.clientY}px`;
  menu.style.left = `${event.clientX}px`;
  menu.style.zIndex = '1000';
  mount(ImageContextMenu, {
    target: menu,
    props: {
      editor,
      closeModal: () => {
        unmount(ImageContextMenu);
        menu.remove();
        
      }
    },
  })
  document.body.appendChild(menu);
  return;
  
  
  // // Remove any existing context menu
  // const existingMenu = document.getElementById('context-menu');
  // if (existingMenu) {
  //   existingMenu.remove();
  // }

  // // Create context menu
  // const menu = document.createElement('div');
  // menu.id = 'context-menu';
  // menu.style.position = 'absolute';
  // menu.style.top = `${event.clientY}px`;
  // menu.style.left = `${event.clientX}px`;
  // menu.style.backgroundColor = 'white';
  // menu.style.border = '1px solid #ccc';
  // menu.style.padding = '10px';
  // menu.style.zIndex = '1000';

  // //editor.chain().focus().setTextAlign("left").run(),

  // // Add menu items
  // const imgInline = document.createElement('div');
  // imgInline.textContent = 'Inline';
  // imgInline.className = 'hover:cursor-pointer hover:bg-gray-200';
  // imgInline.addEventListener('click', () => {    
  //   editor.chain().focus().updateAttributes('image', { style: 'display: inline' }).run();
  //   menu.remove();
  // });



  // const removeImage = document.createElement('div');
  // removeImage.textContent = 'Float Left';
  // removeImage.addEventListener('click', () => {
  //   editor.chain().focus().updateAttributes('image', { style: "STYLE_RIGHT_FLOAT" }).run();
  //   menu.remove();
  // });

  // menu.appendChild(imgInline);
  // menu.appendChild(removeImage);
  // document.body.appendChild(menu);

  // // Remove context menu on click outside
  // document.addEventListener('click', () => {
  //   menu.remove();
  // }, { once: true });
}

/////////////////////
export function chooseImage(callback: (imageData: { src: string, name: string, width: number, height: number }) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const imageData = {
            src: e.target?.result as string,
            name: file.name,
            width: img.width,
            height: img.height,
          };
          callback(imageData);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  input.click();
}

export function dropImage(view:EditorView, event:any, slice:any, moved:boolean) {
  if (
    !moved &&
    event.dataTransfer &&
    event.dataTransfer.files &&
    event.dataTransfer.files[0]
  ) {
    // if dropping external files
    let file = event.dataTransfer.files[0]; // the dropped file
    let filesize = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
    if (
      (file.type === "image/jpeg" || file.type === "image/png") &&
      parseFloat(filesize) < 10
    ) {
      // check valid image type under 10MB, check the dimensions
      let _URL = window.URL || window.webkitURL;
      let img = new Image(); /* global Image */
      img.src = _URL.createObjectURL(file);
      img.onload = function () {
        if (img.width > 5000 || img.height > 5000) {
          window.alert(
            "Your images need to be less than 5000 pixels in height and width.",
          ); // display alert
        } else {
          // valid image so upload to server
          // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
          getImageInfo(file).then(function (imgData) {
              // place the now uploaded image in the editor where it was dropped
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              const node = view.state.schema.nodes.image.create(imgData as any);
              if (coordinates) {
                const transaction = view.state.tr.insert(
                  coordinates.pos,
                  node,
                ); // places it in the correct position
                return view.dispatch(transaction);
              } else {
                console.error("Coordinates could not be determined.");
                return false;
              }
            })
            .catch(function (error) {
              if (error) {
                window.alert(
                  "There was a problem uploading your image, please try again.",
                );
              }
            });
        }
      };
    } else {
      window.alert(
        "Images need to be in jpg or png format and less than 10mb in size.",
      );
    }
    return true; // handled
  }
  return false; // not handled use default behavior
}
      
/////
function getImageInfo(file: Blob) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('The provided file is not an image.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const base64Url = event.target?.result;
      const img = new Image();

      img.onload = () => {
        const imageInfo = {
          src:base64Url,
          alt: (file as File).name,
          title: (file as File).name,
          width: img.width,
          height: img.height
        };
        resolve(imageInfo);
      };

      img.onerror = (error) => reject(error);

      if (typeof base64Url === 'string') {
        img.src = base64Url; // Set the base64 URL as the image source to load dimensions
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file); // Read the file as a data URL
  });
}