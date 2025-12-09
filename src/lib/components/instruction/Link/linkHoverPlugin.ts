import { Plugin } from '@tiptap/pm/state';
import { type Editor } from '@tiptap/core'
import { mount } from 'svelte'
import LinkContextMenu from './LinkContextMenu.svelte';
import type { Attrs } from './model';
import { DOMSerializer, type DOMOutputSpec } from '@tiptap/pm/model';
const DLG_ID = 'linkHoverDlg-';

export function linkHoverPlugin(editor: any) {
  let popup: HTMLDivElement | null = null;
  let currentLinkEl: HTMLElement | null = null;
  let hideTimeout: any = null;
  let isHoveringPopup = false;

  function createPopup(href?: string) {
    popup = document.createElement('div');
    popup.className =
      'fixed z-50 flex gap-1 bg-base-100 border border-base-300 rounded shadow p-1 text-xs';

    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open';
    openBtn.className = 'btn btn-ghost btn-xs';

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn btn-ghost btn-xs';

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn btn-ghost btn-xs text-error';

    popup.append(openBtn, editBtn, removeBtn);
    document.body.appendChild(popup);

    // ✅ CRITICAL: Keep menu alive while hovering popup
    popup.addEventListener('mouseenter', () => {
      isHoveringPopup = true;
      clearTimeout(hideTimeout);
    });

    popup.addEventListener('mouseleave', () => {
      isHoveringPopup = false;
      scheduleHide();
    });

    openBtn.onclick = () => {
      if (!currentLinkEl) return;
      window.open(currentLinkEl.getAttribute('href') || '', '_blank', 'noopener');
      hidePopup();
    };

    editBtn.onclick = () => {
      if (!currentLinkEl) return;

      const href = currentLinkEl.getAttribute('href');
      if (!href) return;
      const pos = editor.view.posAtDOM(currentLinkEl, 0);
      if (pos === null) return;

      showLinkDlg(editor, { id: '0', url: href }, pos);
      hidePopup();
    };

    removeBtn.onclick = () => {
      editor.chain().focus().unsetLink().run();
      hidePopup();
    };
  }

  function showPopup(target: HTMLElement) {
    if (!popup) createPopup(target.getAttribute('href') || '');
  

    const rect = target.getBoundingClientRect();
    popup!.style.top = `${rect.bottom + 6}px`;
    popup!.style.left = `${rect.left}px`;
    popup!.style.display = 'flex';

    clearTimeout(hideTimeout);
  }

  function scheduleHide() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!isHoveringPopup) hidePopup();
    }, 120); // ✅ delay prevents accidental flicker
  }

  function hidePopup() {
    if (popup) popup.style.display = 'none';
    currentLinkEl = null;
  }

  return new Plugin({
    props: {
      handleDOMEvents: {
        mouseover(view, event) {
          const target = event.target as HTMLElement;
          const tagName = target?.tagName;

          if (tagName === 'A') {
            const href = target.getAttribute('href');
            if (!href) return
            const pos = view.posAtDOM(target, 0);
            if (pos === null) return

            currentLinkEl = target;
            showPopup(target);
            editor.chain().focus().setTextSelection(pos).extendMarkRange('link').setLink({ href }).run();

          }
          return false;
        },

        mouseout(view, event) {
          const target = event.target as HTMLElement;

          // ✅ DO NOT immediately hide — schedule instead
          if (target?.tagName === 'A') {
            scheduleHide();
          }
          return false;
        },
      },
    },
  });
}

function showLinkDlg(editor: Editor, attrs: Attrs, pos: number): HTMLDialogElement {
  const modal = Object.assign(document.createElement('dialog'), { id: DLG_ID + attrs.id, className: 'modal modal-open font-normal' });
  mount(LinkContextMenu, {
    target: modal,
    props: {
      closeModal: (attrs: Attrs | null) => {
        modal.remove();
        if (attrs) {
          // Update the PM node with the new attributes... this won't update the DOM
          const node = editor.state.doc.nodeAt(pos);
          if (!node) return;
          editor.chain().focus().setTextSelection(pos).extendMarkRange('link').setLink({ href: attrs.url }).run();
        }
      },
      attrs,
    },
  })
  document.body.appendChild(modal);
  return modal;
}
