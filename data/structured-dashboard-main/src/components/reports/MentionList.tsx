import './MentionList.scss';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { QueryConversationItem, useQueriesState } from '../../zustand/queries/queriesStore';
import useFetchQueriesHistory from 'hooks/queries/useFetchQueriesHistory';

interface MentionListProps {
  command: (props: {
    id: string;
    queryConversationItem: QueryConversationItem;
  }) => void;
}

interface MentionListRef {
  onKeyDown: (props: { event: React.KeyboardEvent<HTMLDivElement> }) => boolean;
  query: string;
  editor: any;
  event: KeyboardEvent;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { queryConversationHistory } = useQueriesState();
    const { isLoading } = useFetchQueriesHistory();

    const bookmarkedItems = queryConversationHistory?.conversations
      .flatMap((conversation) =>
        conversation.items.filter((item) => item.bookmarked),
      )
      .sort((a, b) => (a.id < b.id ? 1 : -1));

    const selectItem = (index: number) => {
      const item = bookmarkedItems[index];
      console.log('item', item);
      if (item) {
        props.command({ id: item.id, queryConversationItem: item });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (prevIndex) =>
          (prevIndex + bookmarkedItems.length - 1) % bookmarkedItems.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((prevIndex) => (prevIndex + 1) % bookmarkedItems.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }
        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }
        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }
        return false;
      },
      query: '',
      editor: null,
      event: new KeyboardEvent(''),
    }));

    return (
      <div className="items">
        {bookmarkedItems && bookmarkedItems.length ? (
          bookmarkedItems.map((item, index) => (
            <button
              className={`item ${index === selectedIndex ? 'is-selected' : ''}`}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.query}
            </button>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </div>
    );
  },
);

MentionList.displayName = 'MentionList';
