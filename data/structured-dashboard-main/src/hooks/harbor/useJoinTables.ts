import axios from 'axios';
import { useState } from 'react';

import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useNotificationStore } from 'zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useAuthStore } from 'zustand/auth/authStore';

interface ErrorType {
  name: string;
  message: string;
  stack?: string;
}

function useJoinTables() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorType | null>(null);

  const { selectedDataSources } = useHarborStore((state) => ({
    selectedDataSources: state.selectedDataSources,
  }));

  const setDataSources = useHarborStore((state) => state.setDataSources);
  const dataSources = useHarborStore((state) => state.dataSources);

  const { currentWorkspace } = useWorkspaceStore();
  
  const {user} = useAuthStore();
  const {
    setNotificationState,
  } = useNotificationStore();


  const joinMultipleTables = async () => {
    const url = '/api/harbor/joinTables';
    // let interval: any;

    if (!url) {
      console.error('Backend URL is not defined');
      setError({
        name: 'Configuration Error',
        message: 'Joining URL is not defined',
      });
      return;
    }

    try {
      if (!currentWorkspace) {
        throw new Error('No workspace found');
      }

      setLoading(true);
      setError(null);

      // let file1 = selectedDataSources[0].name;
      // let file2 = selectedDataSources[1].name;
      // let base1 = file1.slice(0, -4);
      // let base2 = file2.slice(0, -4);
      // let combined = base1 + '_' + base2;

      let files = selectedDataSources.map(dataSource => dataSource.name);
      let uuids = selectedDataSources.map(dataSource => dataSource.uuid);
      let bases = files.map(file => file.slice(0, -4));
      let combined = bases.join('_');
      let output_file_key = combined + '.csv';

      // const backend_url = process.env.NODE_ENV === 'development' ? "https://structuredlabs--harbor-multi-join-dev.modal.run" : "https://structuredlabs--harbor-multi-join.modal.run";
      // const backend_url = "https://structuredlabs--harbor-multi-join.modal.run";
      const backend_url = "https://structuredlabs--harbor-multi-join.modal.run";
      // const backend_url = "https://structuredlabs--harbor-multi-join-dev.modal.run";

      const joinData = {
        workspaceId: currentWorkspace.WorkspaceID,
        bucket: 'structured-harbor-uploads-v0',
        input_file_keys: files,
        input_file_uuids: uuids,
        output_file_key: output_file_key,
        userId: user?.sub,
      };
      console.log({ joinData });
      const response = await axios.post(url, { backend_url, joinData });
      console.log({ response });
      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status} ${response.statusText}`);
      }
      if (response.data.datasource != null && Object.keys(response.data.datasource).length > 0) {
        setDataSources([...dataSources, response.data.datasource]);
        setNotificationState(true, 'Tables joined successfully', 'success');
      }
      return true;
    } catch (err) {
      setLoading(false);
      console.error('Axios error:', err);
      if (axios.isAxiosError(err)) {
        setError({
          name: err.name,
          message: err.message,
          stack: err.stack,
        });
      }
      setNotificationState(true, 'Tables join operation failed', 'failure');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    joinMultipleTables,
  };
}

export default useJoinTables;
