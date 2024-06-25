import { useAuthStore } from 'zustand/auth/authStore';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';

function useFetchQueriesHistory() {
  const { user } = useAuthStore();
  const userId = user?.sub;
  const setQueryConversationHistory = useQueriesState(
    (state) => state.setQueryConversationHistory,
  );
  const { currentWorkspace } = useWorkspaceStore();

  const addConversationToHistory = useQueriesState(
    (state) => state.addConversationToHistory,
  )

  const queryConversationHistory = useQueriesState(
    (state) => state.queryConversationHistory,
  )

  const [isLoading, setIsLoading] = useState(false);
  const {
    setQueriesChosenDataSource,
    setReportsChosenDataSource,
  } = useHarborStore();
  const { setCurrentQueryConversation } = useQueriesState();

  const fetchQueriesHistory = async () => {
    console.log("gets here???")
    try {
      console.log("currentWorkspace", currentWorkspace)
      console.log("userId", userId)
      if (!userId || !currentWorkspace) return;
      setIsLoading(true);
      const response = await axios.post(
        '/api/queries/getQueryConversationHistory', {
        WorkspaceID: currentWorkspace.WorkspaceID,
      });
      const queryConversationHistory = response.data.queryConversationHistory;

      setQueryConversationHistory(queryConversationHistory);
      // setQueriesChosenDataSource(null);
      // setReportsChosenDataSource(null);
      // setCurrentQueryConversation(null);
      // addConversationToHistory(queryConversationHistory);
      console.log(
        'Query conversation history fetched:',
        queryConversationHistory,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueriesHistory();
  }, [currentWorkspace, userId]);

  return { isLoading };
}

export default useFetchQueriesHistory;
