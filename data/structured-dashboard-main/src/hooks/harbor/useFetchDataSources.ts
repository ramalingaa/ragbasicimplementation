'use client';

import { useEffect, useState } from 'react';

import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { set } from '@auth0/nextjs-auth0/dist/session';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useAuthStore } from 'zustand/auth/authStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import csv from 'csvtojson';
import { DATASOURCES_DIR } from 'utils/constants';

export default function useFetchDataSources() {
  const { user } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setDataSources = useHarborStore((state) => state.setDataSources);
  const dataSources = useHarborStore((state) => state.dataSources);
  const { currentWorkspace } = useWorkspaceStore();

  const { entityTypes,
    setEntityTypes } = useHarborStore();

  const fetchDataSources = async () => {
    try {
      setIsLoading(true);
      if (!currentWorkspace) {
        throw new Error('No workspace found');
      }
      console.log("FETCHING DATA SOURCES")
      const response = await axios.post('/api/harbor/fetchDataSources', {
        WorkspaceID: currentWorkspace.WorkspaceID,
      });
      console.log('response.data', response.data);
      if (response.status == 200) {
        setDataSources(response.data as DataSource[]);
      }
      setIsLoading(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFileContents = async (selectedDataSource: DataSource, s3Dir = DATASOURCES_DIR) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      console.log('FETHICNG FILE CONTENTS');
      const response = await axios.post('/api/registry/getFileContents', {
        WorkspaceID: currentWorkspace.WorkspaceID,
        fileName: selectedDataSource.name,
        uuid: selectedDataSource.uuid,
        s3Dir,
      });

      const originalFileContents = response.data.fileContents;

      // const MAX_SIZE = 1024 * 1024; // 1 MB in bytes
      const MAX_SIZE = (1024 * 1024) / 15;
      let truncatedFileContents = originalFileContents.substring(0, MAX_SIZE);

      let decodedContents: any = Buffer.from(
        truncatedFileContents,
        'base64',
      ).toString('utf-8');
      decodedContents = await csv().fromString(decodedContents);

      const fileType = 'csv';
      if (s3Dir == DATASOURCES_DIR) {
        const updatedDataSources = dataSources.map((ds) => {
          if (ds.id === selectedDataSource.id) {
            return {
              ...ds,
              decodedContents,
              fileType,
            };
          }
          return ds;
        });
        setDataSources(updatedDataSources);
        return updatedDataSources.find((ds) => ds.id === selectedDataSource.id)?.decodedContents;
      } else {
        return decodedContents;
      }
    } catch (err) {
      console.error('Error fetching file contents:', err);
      setErrorMessage('Error fetching file contents');
    } finally {
      setIsLoading(false);
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    // 1. component loaded
    // 2. currentWorkspace is not null
    // 3. currentWorkspace is getting from the backend
    //    3.1 even if the currentWorkspace is the same after setCurrentWorkspace is called, this is getting triggered

    // fixes:
    // 1. storing previous states
    // 2. remove useEffect ffrom this custom hooks
    // 3. need to figure out zustand persisted state issue
    fetchDataSources();
  }, [currentWorkspace?.WorkspaceID]);

  return { errorMessage, isLoading, fetchDataSources, getFileContents };
}