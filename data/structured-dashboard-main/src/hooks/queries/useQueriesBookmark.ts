import { useState } from 'react';
import axios from 'axios';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useQueriesBookmark = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toggleItemBookmark, currentQueryConversation, setItemBookmark } =
    useQueriesState();
  const { currentWorkspace } = useWorkspaceStore();

  const updateItemBookmark = async (item: any, itemId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('item', item);
      console.log('itemId', itemId);
      const updatedItem: any = {
        ...item,
        bookmarked: !item.bookmarked,
      };

      toggleItemBookmark(currentQueryConversation.id, itemId);

      await axios.post('/api/queries/updateItemBookmark', {
        userId: currentWorkspace.WorkspaceID,
        queryConversation: currentQueryConversation,
        updatedItem: updatedItem,
      });

      console.log('Item bookmark updated successfully');
    } catch (error) {
      setError('An error occurred while updating the item bookmark.');
    } finally {
      setIsLoading(false);
    }
  };

  const unbookmarkItem = async (item: any, itemId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedItem: any = {
        ...item,
        bookmarked: false,
      };
      setItemBookmark(currentQueryConversation.id, itemId, false);
      await axios.post('/api/queries/updateItemBookmark', {
        userId: currentWorkspace.WorkspaceID,
        queryConversation: currentQueryConversation,
        updatedItem: updatedItem,
      });
      console.log('Item unbookmarked successfully');
    } catch (error) {
      setError('An error occurred while unbookmarking the item.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateItemBookmark,
    unbookmarkItem,
  };
};

export default useQueriesBookmark;
