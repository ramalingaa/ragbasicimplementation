import { useAuthStore } from 'zustand/auth/authStore';
import { v4 as uuidv4 } from 'uuid';
import {
  QueryConversation,
  useQueriesState,
  QueryConversationItem,
  checkIfConversationExists,
} from '../../zustand/queries/queriesStore';
import axios from 'axios';
import { useState } from 'react';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

function useQueriesConversation() {
  const { user } = useAuthStore();
  const userId = user?.sub;

  const [deleting, setDeleting] = useState(false);

  const addConversationToHistory = useQueriesState(
    (state) => state.addConversationToHistory,
  );
  const addItemToConversation = useQueriesState(
    (state) => state.addItemToConversation,
  );

  const setQueryConversationHistory = useQueriesState(
    (state) => state.setQueryConversationHistory,
  );

  const setCurrentQueryConversation = useQueriesState(
    (state) => state.setCurrentQueryConversation,
  );

  const deleteConversationFromHistory = useQueriesState(
    (state) => state.deleteConversationFromHistory,
  );
  const { currentQueryConversation } = useQueriesState();
  const { setSelectedDrillDownReport, setQueryReport } = useReportsStore();
  const { setCurrentCarouselIndex } =
    useQueriesState();
  const { currentWorkspace } = useWorkspaceStore();

  const {
    setReportsChosenDataSource,
  } = useHarborStore();


  const initiateSaveQueryConversation = async (
    newConversation: QueryConversation,
    newItem: QueryConversationItem,
  ) => {
    try {
      const response = await axios.post('/api/queries/saveQueryConversation', {
        userId: currentWorkspace.WorkspaceID,
        queryConversation: newConversation,
      });

      console.log("____________________________")

      // if (newConversation.items.length === 1) {
      //   addConversationToHistory(newConversation);
      //   console.log('conversation added to history', newConversation)
      // } else {

      // addItemToConversation(newConversation.id, newItem);
      console.log('item added to conversation', newItem);
      // }

      console.log('conversation saved', newConversation);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAllConversations = async (onClose: void) => {
    setDeleting(true);
    try {
      const response = await axios.post(
        '/api/queries/deleteQueryConversations',
        {
          WorkspaceID: currentWorkspace.WorkspaceID,
        },
      );

      setQueryConversationHistory(null);
      setCurrentQueryConversation(null);
      setDeleting(false);
    } catch (error) {
      console.error('Failed to delete conversations:', error);
      setDeleting(false);
    }
  };

  const deleteQueryConversation = async (conversationId: string) => {
    setDeleting(true);
    try {
      const response = await axios.post(
        '/api/queries/deleteQueryConversation',
        {
          userId: currentWorkspace.WorkspaceID,
          conversationId,
        },
      );
      deleteConversationFromHistory(conversationId);
      setDeleting(false);
      // if currentQueryConversation is the one being deleted, set it to null
      if (currentQueryConversation.id === conversationId) {
        setCurrentCarouselIndex(0);
        setSelectedDrillDownReport(null);
        setQueryReport(null);
        setReportsChosenDataSource(null);
        setCurrentQueryConversation(null);
      }

      console.log('Conversation deleted', conversationId);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      setDeleting(false);

    }
  };

  return {
    initiateSaveQueryConversation,
    deleteAllConversations,
    deleteQueryConversation,
    deleting,
  };
}

export default useQueriesConversation;
