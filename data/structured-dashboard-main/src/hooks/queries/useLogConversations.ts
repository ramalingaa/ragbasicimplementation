import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from 'zustand/auth/authStore';

import { useDashboardStore } from '../../zustand/reports/store';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

type LogItem = {
  logSearchQuery: string;
  logSearchResponse: string;
};

type LogConversation = {
  id: string;
  conversationTitle: string;
  timeStamp?: string;
  items: LogItem[];
  isLogConversationOpen?: boolean;
};

const useLogConversations = () => {
  const { user } = useAuthStore();
  const userId = user?.sub;

  const [deleting, setDeleting] = useState(false);

  const { addToSessionHistory, clearSessionHistory } = useDashboardStore();
  const { currentWorkspace } = useWorkspaceStore();

  const initiateSaveLogConversation = async (query: string, text: string) => {
    try {
      const conversationId = uuidv4();

      const newConversation: LogConversation = {
        id: conversationId,
        conversationTitle: `${query.substring(0, 40)}...`,
        timeStamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: [
          {
            logSearchQuery: query,
            logSearchResponse: text,
          },
        ],
      };

      const response = await axios.post('/api/queries/saveLogConversation', {
        WorkspaceID: currentWorkspace.WorkspaceID,
        logConversation: newConversation,
      });

      const newResource = {
        name: `Conversation_${conversationId}`,
        list: `/history/${conversationId}`,
        meta: {
          label: newConversation.conversationTitle,
          parent: 'History',
          iconName: 'FaCommentDots',
        },
      };

      console.log('newResource:', newResource);

      // Add the new LogConversation to sessionHistory
      addToSessionHistory(newConversation);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllConversations = async () => {
    console.log('fetchAllConversations: user?.sub: ', user?.sub);

    try {
      const response = await axios.post('/api/queries/getLogConversations', {
        WorkspaceID: currentWorkspace.WorkspaceID,
      });

      if (response.data && response.data.data) {
        response.data.data.forEach((conversation: LogConversation) => {
          // Add the LogConversation to sessionHistory
          addToSessionHistory(conversation);

          // Add a new resource for this conversation
          const newResource = {
            name: `Conversation_${conversation.id}`,
            list: `/history/${conversation.id}`,
            meta: {
              label: conversation.conversationTitle,
              parent: 'History',
              iconName: 'FaCommentDots',
            },
          };
        });
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
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

      clearSessionHistory();
      setDeleting(false);
    } catch (error) {
      console.error('Failed to delete conversations:', error);
      setDeleting(false);
    }
  };

  return {
    initiateSaveLogConversation,
    fetchAllConversations,
    deleteAllConversations,
    deleting,
  };
};

export default useLogConversations;
