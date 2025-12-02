export interface ICell {
    type: string;
    pos: number;
    content: string;
};

////////////

import type { NodeViewProps } from '@tiptap/core';

export interface ExtendedNodeViewProps extends NodeViewProps {
  additionalProp: string;
}