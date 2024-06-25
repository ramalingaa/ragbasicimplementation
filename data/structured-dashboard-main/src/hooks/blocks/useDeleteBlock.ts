import { useState } from 'react';
import axios from 'axios';
import { useBlocksStore } from '../../zustand/blocks/blocksStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useDeleteBlock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeBlock = useBlocksStore((state) => state.removeBlock);
  const { currentWorkspace } = useWorkspaceStore();

  const deleteBlock = async (blockId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post('/api/blocks/deleteBlock', {
        blockId,
        WorkspaceID: currentWorkspace.WorkspaceID,
      });
      removeBlock(blockId);

      console.log('Block deleted successfully');
    } catch (error) {
      setError('An error occurred while deleting the block.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    deleteBlock,
  };
};

export default useDeleteBlock;
