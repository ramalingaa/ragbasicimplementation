import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from 'zustand/auth/authStore';

import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useDeleteAllUserDataSources = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { user } = useAuthStore();
  const setDataSources = useHarborStore((state) => state.setDataSources);
  const { currentWorkspace } = useWorkspaceStore();

  const deleteAllUserDataSources = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const response = await axios.delete(
        '/api/harbor/deleteAllUserDataSources',
        {
          data: {
            WorkspaceID: currentWorkspace.WorkspaceID,
          },
        },
      );

      if (response.status === 200) {
        console.log('All user data sources deleted successfully');

        // Clear the data sources in the store
        setDataSources([]);

        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting all user data sources', error);
      setIsDeleting(false);
      setErrorMessage('Failed to delete all user data sources');
    }
  };

  return {
    deleteAllUserDataSources,
    isDeleting,
    errorMessage,
  };
};

export default useDeleteAllUserDataSources;
