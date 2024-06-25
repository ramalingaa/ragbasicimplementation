import { useAuthStore } from 'zustand/auth/authStore';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { QueryConversationItem, useQueriesState } from '../../zustand/queries/queriesStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

function useFetchBookmarkedQueryItems() {
  const { user } = useAuthStore();
  const userId = user?.sub;
  const setBookmarkedQueryItems = useQueriesState(
    (state) => state.setBookmarkedQueryItems,
  );
  const { currentWorkspace } = useWorkspaceStore();
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookmarkedQueryItems = async () => {
    try {
      if (!userId || !currentWorkspace) return;
      setIsLoading(true);
      const response = await axios.post(
        '/api/queries/getBookmarkedQueryItems',
        {
          WorkspaceID: currentWorkspace.WorkspaceID,
        },
      );
      const bookmarkedQueryItems: QueryConversationItem[] =
        response.data.bookmarkedQueryItems;
      setBookmarkedQueryItems(bookmarkedQueryItems);
      console.log('Bookmarked query items fetched:', bookmarkedQueryItems);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedQueryItems();
  }, [currentWorkspace, userId]);

  return { isLoading };
}

export default useFetchBookmarkedQueryItems;
