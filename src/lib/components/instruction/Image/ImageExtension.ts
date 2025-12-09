import { mount, unmount } from 'svelte'
import ImageContextMenu from './ImageContextMenu.svelte'
//import { IMG_STYLE_LEFT} from "./const";

export const IMG_STYLE_LEFT = 'display:block; margin-right:auto;'
export const IMG_STYLE_CENTER = 'display:block; margin-left:auto; margin-right:auto;'
export const IMG_STYLE_RIGHT = 'display:block; margin-left:auto;'
export const IMG_STYLE_INLINE = 'display:inline-block;'


// //import {SvelteMap} from 'svelte/reactivity';
export interface ImageProps {
  //id: number;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  //pos: number;
}
///////////////////////////////////////////////////////

import {
  mergeAttributes,
  Editor,
} from '@tiptap/core'

const MENU_ID = 'context-menu';

/// https://tiptap.dev/docs/editor/extensions/custom-extensions/extend-existing
import { Image as ImageOrg } from "@tiptap/extension-image";
import type { EditorView } from '@tiptap/pm/view';
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
      HTMLAttributes: {},
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

  _old_addNodeView() {
    return ({ editor, node, getPos }: { editor: Editor; node: any; getPos: () => number | undefined }) => {
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
            style: "right"
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
        update(node: { type: { name: string }; attrs: { src: string; alt: string; title: string; width: number; height: number; style: string } }) {
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

  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement('div');
      container.className = 'relative inline-block';

      const img = document.createElement('img');
      img.src = node.attrs.src;
      img.style.width = node.attrs.width || 'auto';
      img.className = 'block max-w-full rounded';

      const handle = document.createElement('div');
      handle.className =
        'absolute right-0 bottom-0 w-3 h-3 bg-blue-500 cursor-se-resize';

      let startX = 0;
      let startWidth = 0;

      handle.onmousedown = (e) => {
        startX = e.clientX;
        startWidth = img.clientWidth;

        document.onmousemove = (e) => {
          const delta = e.clientX - startX;
          img.style.width = `${Math.max(50, startWidth + delta)}px`;
        };

        document.onmouseup = () => {
          document.onmousemove = null;
          document.onmouseup = null;

          const pos = getPos();
          if (pos !== undefined) {
            editor
              .chain()
              .focus()
              .command(({ tr }) => {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  width: img.style.width,
                });
                return true;
              })
              .run();
          }
        };
      };

      // add double click event listener    
      container.addEventListener('dblclick', () => {
        chooseImage((imageData) => {
          const imageAttributes = {
            src: imageData.src,
            alt: imageData.name,
            title: imageData.name,
            width: imageData.width,
            height: imageData.height,
            style: "right"
          };
          editor.chain().focus().setImage(imageAttributes).run();
        });
      })

      // Add context menu event listener
      container.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        showContextMenu(event, editor, getPos);
      });

      container.appendChild(img);
      container.appendChild(handle);

      return {
        dom: container,
        selectNode() {
          container.classList.add('border-4', 'border-blue-500');
        },
        deselectNode() {
          container.classList.remove('border-4', 'border-blue-500');
        },
      };
    };
  },
});



// Function to show context menu
function showContextMenu(event: MouseEvent, editor: Editor, getPos: () => number | undefined) {

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

export function dropImage(view: EditorView, event: any, slice: any, moved: boolean) {
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
          src: base64Url,
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

// Image resize functionality
export function addResizeHandles(container: HTMLImageElement, editor: Editor, getPos: () => number | undefined) {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  wrapper.style.maxWidth = '100%';

  container.parentNode?.insertBefore(wrapper, container);
  wrapper.appendChild(container);

  const resizeHandle = document.createElement('div');
  resizeHandle.className = 'resize-handle';
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.right = '0';
  resizeHandle.style.bottom = '0';
  resizeHandle.style.width = '10px';
  resizeHandle.style.height = '10px';
  resizeHandle.style.backgroundColor = '#3b82f6';
  resizeHandle.style.cursor = 'nwse-resize';
  resizeHandle.style.display = 'none';

  wrapper.appendChild(resizeHandle);

  container.addEventListener('mouseenter', () => {
    resizeHandle.style.display = 'block';
  });

  wrapper.addEventListener('mouseleave', () => {
    resizeHandle.style.display = 'none';
  });

  let isResizing = false;
  let startX = 0;
  let startY = 0;
  let startWidth = 0;
  let startHeight = 0;
  let aspectRatio = 1;

  resizeHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = container.width;
    startHeight = container.height;
    aspectRatio = startWidth / startHeight;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });

  function handleMouseMove(e: MouseEvent) {
    if (!isResizing) return;

    const deltaX = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + deltaX);
    const newHeight = newWidth / aspectRatio;

    container.width = newWidth;
    container.height = newHeight;
  }

  function handleMouseUp(e: MouseEvent) {
    if (!isResizing) return;

    isResizing = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    const pos = getPos();
    if (pos !== undefined) {
      editor.chain().focus().updateAttributes('image', {
        width: container.width,
        height: container.height
      }).run();
    }
  }

  return wrapper;
}
