import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance } from 'tippy.js';
import { MentionList } from './MentionList';
import { SuggestionKeyDownProps } from '@tiptap/suggestion';
import { QueryConversationItem } from 'zustand/queries/queriesStore';

interface MentionProps {
  query: string;
  clientRect?: ClientRect | (() => ClientRect);
  editor: any;
  queryConversationItem?: QueryConversationItem;
}

export default {
  render: () => {
    let reactRenderer: ReactRenderer<MentionProps>;
    let popup: Instance[];

    return {
      onStart: (props: MentionProps) => {
        if (!props.clientRect) {
          return;
        }
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });
        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => ClientRect,
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },
      onUpdate(props: MentionProps) {
        reactRenderer.updateProps(props);
        if (!props.clientRect) {
          return;
        }
        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => ClientRect,
        });
      },
      onKeyDown(props: SuggestionKeyDownProps): boolean {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return (reactRenderer.ref as any)?.onKeyDown(props) ?? false;
      },
      onExit() {
        popup[0].destroy();
        reactRenderer.destroy();
      },
    };
  },
};
