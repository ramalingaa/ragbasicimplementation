'use client';

import { useEffect, useState } from 'react';

import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { set } from '@auth0/nextjs-auth0/dist/session';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import useFetchDataSources from './useFetchDataSources';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

export default function useDeleteDataSources() {
  const { currentWorkspace } = useWorkspaceStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setDataSources = useHarborStore((state) => state.setDataSources);
  const dataSources = useHarborStore((state) => state.dataSources);
  const setSelectedDataSources = useHarborStore((state) => state.setSelectedDataSources);
  const { originalSources,
    setOriginalSources,
    joinedSources,
    setJoinedSources, } = useHarborStore();
  const {
    setNotificationState,
  } = useNotificationStore();

  const deleteDataSources = async (dataSourcesSelected: DataSource[]) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/harbor/deleteDataSources', {
        WorkspaceID: currentWorkspace.WorkspaceID,
        // fileNames: dataSourcesSelected.map((dataSource) => dataSource.name),
        files: dataSourcesSelected.map((dataSource) => { return { fileName: dataSource.name, uuid: dataSource.uuid } }),
      });
      console.log('response.data', response.data);
      // if status code != 200
      if (response.status == 500) {
        setErrorMessage(response.data.error);
      }
      if (response.status == 200) {
        setNotificationState(true, 'Data sources deleted successfully', 'success');
        setDataSources(
          dataSources.filter(
            (dataSource) => !dataSourcesSelected.includes(dataSource),
          ),
        );
        setSelectedDataSources([]);
      }
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setNotificationState(true, error.message, 'failure');
      } else {
        setErrorMessage('An unknown error occurred');
        setNotificationState(true, 'An unknown error occurred', 'failure');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { errorMessage, isLoading, deleteDataSources };
}
