// tiptapMenu.ts
import type { Editor } from "@tiptap/core";

export type ToolbarItem = {
  id: string;
  icon: string;
  label: string;
  action: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
};

export function createToolbar(editor: Editor): ToolbarItem[] {
  return [
    {
      id: "bold",
      icon: "mdi:format-bold",
      label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
      isDisabled: () => !editor.can().chain().focus().toggleBold().run(),
    },
    {
      id: "italic",
      icon: "mdi:format-italic",
      label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
      isDisabled: () => !editor.can().chain().focus().toggleItalic().run(),
    },
    {
      id: "underline",
      icon: "mdi:format-underline",
      label: "Underline",
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: () => editor.isActive("underline"),
      isDisabled: () => !editor.can().chain().focus().toggleUnderline().run(),
    },
    {
      id: "strike",
      icon: "mdi:format-strikethrough",
      label: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
      isDisabled: () => !editor.can().chain().focus().toggleStrike().run(),
    },

    // --- Headings ---
    {
      id: "h1",
      icon: "mdi:format-header-1",
      label: "H1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      id: "h2",
      icon: "mdi:format-header-2",
      label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },

    // --- Lists ---
    {
      id: "bulletList",
      icon: "mdi:format-list-bulleted",
      label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      id: "orderedList",
      icon: "mdi:format-list-numbered",
      label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },

    // --- Block ---
    {
      id: "blockquote",
      icon: "mdi:format-quote-open",
      label: "Quote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },

    // --- Undo / Redo ---
    {
      id: "undo",
      icon: "mdi:undo",
      label: "Undo",
      action: () => editor.chain().focus().undo().run(),
      isDisabled: () => !editor.can().undo(),
    },
    {
      id: "redo",
      icon: "mdi:redo",
      label: "Redo",
      action: () => editor.chain().focus().redo().run(),
      isDisabled: () => !editor.can().redo(),
    },
  ];
}
