import { useState } from 'react';
import axios from 'axios';

import { DataSource } from '../../interfaces/DataTypes';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useAuthStore } from 'zustand/auth/authStore';

const useCsvConnection = () => {
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingCsvConnectionId, setDeletingCsvConnectionId] = useState<
    string | null
  >(null);
  const {
    setNotificationState,
  } = useNotificationStore();

  const { currentWorkspace } = useWorkspaceStore();

  const { user } = useAuthStore();

  const setDataSources = useHarborStore((state) => state.setDataSources);
  const dataSources = useHarborStore((state) => state.dataSources);

  const saveFiles = async (uploadedFiles: File[]) => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);

    try {
      if (!currentWorkspace) {
        throw new Error('No workspace found');
      }

      const responses = await Promise.all(uploadedFiles.map(async (file) => {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user?.sub);
        formData.append('WorkspaceID', currentWorkspace.WorkspaceID);

        const response = await axios.post(
          '/api/harbor/useCsvFileConnection',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );
        console.log('response', response.data);

        if (response.status === 200) {
          setUploadStatus('success');
          const newDataSource: DataSource = response.data.dataSource;
          console.log({ newDataSource });
          return { success: true, newDataSource };
        } else {
          throw new Error('Upload failed');
        }
      }));

      // After all files have been processed, update the data sources
      const successfulUploads = responses.filter(r => r.success).map(r => r.newDataSource);
      setDataSources([...dataSources, ...successfulUploads]);

      setIsUploading(false);
      setNotificationState(true, 'CSV files added successfully', 'success');
    } catch (error: unknown) {
      setIsUploading(false);
      setUploadStatus('error');

      console.log('error', error);
      if (error instanceof Error) {
        setNotificationState(true, error.message, 'failure');
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
        setNotificationState(true, 'Unknown error occurred.', 'failure');
      }
    }
  };

  const deleteCsvConnection = async (fileId: string, fileName: string) => {
    setIsUploading(true);
    setDeletingCsvConnectionId(fileId);
    setErrorMessage(null);

    if (!fileId || !fileName) {
      setIsUploading(false);
      setErrorMessage('File ID or file name is missing');
      return;
    }

    try {
      if (!currentWorkspace) {
        throw new Error('No workspace found');
      }
      const response = await axios.delete('/api/harbor/deleteCsvConnection', {
        data: {
          WorkspaceID: currentWorkspace.WorkspaceID,
          fileId: fileId,
          fileName: fileName,
        },
      });

      if (response.status === 200) {
        console.log('File and metadata deleted successfully');

        // Filter out the deleted datasource
        const updatedDataSources = dataSources.filter(
          (dataSource) => dataSource.id !== fileId,
        );
        setDataSources(updatedDataSources);

        setIsUploading(false);
      }
    } catch (error) {
      console.error('Error deleting file and metadata', error);
      setIsUploading(false);
      setErrorMessage('Failed to delete file and metadata');
    }
  };

  return {
    uploadStatus,
    errorMessage,
    uploadProgress,
    setUploadStatus,
    setErrorMessage,
    setUploadProgress,
    isUploading,
    saveFiles,
    deletingCsvConnectionId,
    deleteCsvConnection,
  };
};

export default useCsvConnection;
