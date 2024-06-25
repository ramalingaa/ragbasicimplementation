import { useState } from 'react';
import axios from 'axios';
import {
  CompleteReport,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useUpdateReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const updateCompleteReport = useReportsStore(
    (state) => state.updateCompleteReport,
  );
  const { currentWorkspace } = useWorkspaceStore();

  const updateReport = async (completeReport: CompleteReport) => {
    setIsLoading(true);
    setError(null);

    try {
      updateCompleteReport(completeReport);
      await axios.post('/api/reports/saveReport', { userId:currentWorkspace.WorkspaceID, completeReport });
    } catch (error) {
      setError('An error occurred while updating the report.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateReport,
  };
};

export default useUpdateReport;
