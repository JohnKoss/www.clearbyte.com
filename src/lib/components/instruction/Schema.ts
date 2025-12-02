import { mergeAttributes } from '@tiptap/core'
import type { Node } from '@tiptap/pm/model'
import type { Attributes } from '@tiptap/core'

//////////////
import { Heading } from '@tiptap/extension-heading'
export const CustomHeading = Heading.extend({
    levels: [1, 2, 3],
    renderHTML({ node, HTMLAttributes }: { node: Node; HTMLAttributes: Attributes }) {
        const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];
        const classes: { [index: number]: string } = {
            1: 'text-2xl font-bold',
            2: 'text-xl font-bold',
            3: 'text-lg font-bold',
        };
        return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `${classes[level]}`,
            }),
            0,
        ];
    },
})

//////////////
import { HorizontalRule } from '@tiptap/extension-horizontal-rule'
export const CustomHorizontalRule = HorizontalRule.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            CSSAttributes: {
                border: 'divider', // Example: Adding a custom CSS attribute
            },
        };
    }
});

//////////////
import { ListItem } from '@tiptap/extension-list-item';
export const CustomListItem = ListItem.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'mb-0', // Example: Adding a custom class
            },
        };
    }
});

//////////////
import { BulletList } from '@tiptap/extension-bullet-list';
export const CustomBulletList = BulletList.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'list-disc list-outside ml-10 mb-4', // Example: Adding a custom class   
            },
        };
    }
});

//////////////
import { OrderedList } from '@tiptap/extension-ordered-list';
export const CustomOrderedList = OrderedList.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'list-decimal list-outside ml-10 mb-4', // Example: Adding a custom class
            },
        };
    }
});

//////////////
import { Bold } from '@tiptap/extension-bold';
export const CustomBold = Bold.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'font-bold', // Example: Adding a custom class
            },
        };
    }
});

// Extension: Italic
import { Italic } from '@tiptap/extension-italic';
export const CustomItalic = Italic.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'italic', // Example: Adding a custom class
            },
        };
    }
});

// Underline extension
import { Underline } from '@tiptap/extension-underline';
export const CustomUnderline = Underline.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'underline', // Example: Adding a custom class   
            },
        };
    }
});

// Strike extension
import { Strike } from '@tiptap/extension-strike';
export const CustomStrike = Strike.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'line-through', // Example: Adding a custom class
            },
        };
    }
});

// Blockquote extension
import { Blockquote } from '@tiptap/extension-blockquote';
export const CustomBlockquote = Blockquote.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'border-l-4 border-gray-400 pl-2', // Example: Adding a custom class
            },
        };
    }
});


//////////////
import { Code } from '@tiptap/extension-code';
export const CustomCode = Code.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'bg-gray-100 p-2 rounded', // Example: Adding a custom class
            },
        };
    }
});

//////////////
import { CodeBlock } from '@tiptap/extension-code-block';
export const CustomCodeBlock = CodeBlock.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'bg-gray-100 p-2 rounded', // Example: Adding a custom class
            },
        };
    }
});

//////////////
import Link from '@tiptap/extension-link';
export const CustomLink = Link.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'text-blue-500 underline', // Example: Adding a custom class
            },
        };
    }
});

//////////////
import TextAlign from '@tiptap/extension-text-align';
export const CustomTextAlign = TextAlign.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'text-center', // Example: Adding a custom class
            },
        };
    }
});

//////////////
// import Highlight from '@tiptap/extension-highlight';
// export const CustomHighlight = Highlight.extend({
//     addOptions() {
//         return {
//             ...this.parent?.(),
//             HTMLAttributes: {
//                 //class: 'bg-yellow-100', // Example: Adding a custom class
//             },
//         };
//     }
// });

//////////////
import {Table} from "@tiptap/extension-table";
export const CustomTable = Table.extend({
    addOptions() {
        return {
            ...this.parent?.(),
            HTMLAttributes: {
                class: 'table table-bordered border border-1', // DaisyUI and Tailwind CSS classes for table with border
            },
        };
    }
});
