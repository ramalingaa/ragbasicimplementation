import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import TipTapComponent from './TipTapComponent';

export default Node.create({
  name: 'reactComponent',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      queryConversationItem: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute('data-query-conversation-item'),
        renderHTML: (attributes) => {
          return {
            'data-query-conversation-item': attributes.queryConversationItem,
            class: 'mention',
          };
        },
      },
      position: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-position'),
        renderHTML: (attributes) => {
          return {
            'data-position': attributes.position,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'react-component[data-query-conversation-item]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['react-component', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TipTapComponent);
  },
});
