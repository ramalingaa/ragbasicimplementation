import { useState } from 'react';
import axios from 'axios';
import {
  CompleteReport,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useSaveReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setGeneratedReports = useReportsStore(
    (state) => state.setGeneratedReports,
  );
  const { currentWorkspace } = useWorkspaceStore();

  const saveReport = async (completeReport: CompleteReport) => {
    setIsLoading(true);
    setError(null);

    try {
      setGeneratedReports(completeReport);
      await axios.post('/api/reports/saveReport', {
        WorkspaceID: currentWorkspace.WorkspaceID,
        completeReport,
      });
      console.log('Report saved successfully')
    } catch (error) {
      setError('An error occurred while saving the report.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    saveReport,
  };
};

export default useSaveReport;
