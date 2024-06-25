import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useRegistry = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dataSources = useHarborStore((state) => state.dataSources);
  const setDataSources = useHarborStore((state) => state.setDataSources);
  const { currentWorkspace } = useWorkspaceStore();

  
  return {
    isLoading,
    error,
  };
};

export default useRegistry;
