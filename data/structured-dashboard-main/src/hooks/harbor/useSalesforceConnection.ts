import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useAuthStore } from 'zustand/auth/authStore';

// Define a type for the below variables
export type SalesforceVariables = {
  instanceUrl: string;
  apiVersion: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  filename: string;
  securityToken: string;
  salesforceImport?: string;
};

const useSalesforceConnection = () => {
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingCsvConnectionId, setDeletingCsvConnectionId] = useState<
    string | null
  >(null);
  const { currentWorkspace } = useWorkspaceStore();

  const {
    setNotificationState,
  } = useNotificationStore();

  const setDataSources = useHarborStore((state) => state.setDataSources);
  const dataSources = useHarborStore((state) => state.dataSources);

  const { user } = useAuthStore();

  const saveSalesforceFile = async (
    salesforceVariables: SalesforceVariables,
  ) => {
    try {
      setIsUploading(true);
      if (!currentWorkspace) {
        throw new Error('No workspace found');
      }
      const response = await axios.post('/api/harbor/useSalesforceFileConnection', {
        userId: user?.sub,
        WorkspaceID: currentWorkspace.WorkspaceID,
        ...salesforceVariables,
      });

      console.log('result', response.data);

      if (response.status === 200) {
        setNotificationState(true, 'Salesforce file uploaded successfully', 'success');
        setUploadStatus('success');
        setIsUploading(false);
        const newDataSource: DataSource = response.data.dataSource;
        setDataSources([...dataSources, newDataSource]);
        return true;
      }
      setNotificationState(true, 'Unknown error occurred.', 'failure');
      return false;
    } catch (error: unknown) {
      setIsUploading(false);

      console.log('error', error);
      if (error instanceof Error) {
        setNotificationState(true, 'Failed to connect to Salesforce', 'failure');
        setErrorMessage(error.message);
      } else {
        setNotificationState(true, 'Unknown error occurred.', 'failure');
        setErrorMessage('An unknown error occurred');
      }
      setUploadStatus('error');
      return false;
    }
  };

  const saveSalesforceDetails = async (
    salesforceVariables: SalesforceVariables,
  ) => {
    try {
      setIsUploading(true);
      const response = await axios.post('/api/harbor/useSalesforceConnection', {
        userId: user?.sub,
        WorkspaceID: currentWorkspace.WorkspaceID,
        ...salesforceVariables,
      });

      console.log('result', response.data);

      if (response.status === 200) {
        setNotificationState(true, 'Salesforce connection details added successfully', 'success');
        setUploadStatus('success');
        setIsUploading(false);
        const newDataSources: DataSource[] = response.data.dataSourcesRes;
        setDataSources([...dataSources, ...newDataSources]);
        return true;
      }
      setNotificationState(true, 'Unknown error occurred.', 'failure');
      return false;
    } catch (error: unknown) {
      setIsUploading(false);

      console.log('error', error);
      if (error instanceof Error) {
        setNotificationState(true, 'Failed to connect to Salesforce', 'failure');
        setErrorMessage(error.message);
      } else {
        setNotificationState(true, 'Unknown error occurred.', 'failure');
        setErrorMessage('An unknown error occurred');
      }
      setUploadStatus('error');
      return false;
    }
  };

  return {
    saveSalesforceFile,
    uploadStatus,
    errorMessage,
    uploadProgress,
    setUploadStatus,
    setErrorMessage,
    setUploadProgress,
    isUploading,
    saveSalesforceDetails,
  };
};

export default useSalesforceConnection;
