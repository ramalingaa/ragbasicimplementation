import { useState } from 'react';
import axios from 'axios';
import { Block, useBlocksStore } from '../../zustand/blocks/blocksStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useSaveBlock = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBlock = useBlocksStore((state) => state.addBlock);
  const { currentWorkspace } = useWorkspaceStore();

  const saveBlock = async (block: Block) => {
    setIsLoading(true);
    setError(null);

    try {
      addBlock(block);
      await axios.post('/api/blocks/saveBlock', {
        WorkspaceID: currentWorkspace.WorkspaceID,
        block,
      });
      console.log('Block saved successfully');
    } catch (error) {
      setError('An error occurred while saving the block.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    saveBlock,
  };
};

export default useSaveBlock;
