import { useState, useEffect } from 'react';
import axios from 'axios';
import { Block, useBlocksStore } from '../../zustand/blocks/blocksStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import useRefreshTrigger from 'hooks/refreshTrigger';

const useFetchBlocks = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setBlocks = useBlocksStore((state) => state.setBlocks);
  const { currentWorkspace } = useWorkspaceStore();


  const refreshTrigger = useRefreshTrigger();

  useEffect(() => {
    console.log('useEffect here...');
    const fetchBlocks = async () => {
      console.log('fetchBlocks');
      setIsLoading(true);
      setError(null);

      if (!currentWorkspace) {
        console.log('No user ID found, skipping fetch');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post('/api/blocks/fetchBlocks', {
          WorkspaceID: currentWorkspace.WorkspaceID,
        });

        const fetchedBlocks: Block[] = response.data.data;
        console.log('fetchedBlocks', fetchedBlocks);
        setBlocks(fetchedBlocks);
      } catch (error) {
        console.log('An error occurred while fetching blocks', error);
        setError('An error occurred while fetching blocks.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlocks();
  }, [currentWorkspace, refreshTrigger]);

  return {
    isLoading,
    error,
  };
};

export default useFetchBlocks;
