import { useEffect, useState } from 'react';
import axios from 'axios';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import useRefreshTrigger from 'hooks/refreshTrigger';

const useFetchReports = () => {
  const { generatedReports, setGeneratedReportsArr } = useReportsStore();

  const [isLoading, setIsLoading] = useState(false);
  const { currentWorkspace } = useWorkspaceStore();
  const { setReportsChosenDataSource } = useHarborStore();

  const refreshTrigger = useRefreshTrigger();

  const fetchReports = async () => {
    try {
      setIsLoading(true);

      if (!currentWorkspace) {
        console.log('No user ID found, skipping fetch');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(`/api/reports/fetchReports`, {
        WorkspaceID: currentWorkspace.WorkspaceID,
      });

      console.log('response.data.data', response.data.data);
      setGeneratedReportsArr(response.data.data);
      setReportsChosenDataSource(null);
      console.log('generatedReports', generatedReports);
    } catch (error) {
      console.log('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentWorkspace, refreshTrigger]);

  return { isLoading };
};

export default useFetchReports;
