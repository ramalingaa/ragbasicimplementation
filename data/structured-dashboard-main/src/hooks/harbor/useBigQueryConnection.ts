import { DataSource } from '../../interfaces/DataTypes';
import Papa from 'papaparse';
import axios from 'axios';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import useFetchDataSources from './useFetchDataSources';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useAuthStore } from 'zustand/auth/authStore';

export type BigQueryConnectionFormInputs = {
    type: string;
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
    universe_domain: string;
    tableName: string;
}

const useBigQueryConnection = () => {
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const setDataSources = useHarborStore((state) => state.setDataSources);
    const dataSources = useHarborStore((state) => state.dataSources);
    const {
        setNotificationState,
    } = useNotificationStore();
    const { currentWorkspace } = useWorkspaceStore();
    const { user } = useAuthStore();

    const saveBigQueryConnectionDetails = async (
        bigQueryVariables: BigQueryConnectionFormInputs,
    ) => {
        try {
            setIsUploading(true);
            if (!currentWorkspace) {
                throw new Error('No workspace found');
            }
            const response = await axios.post('/api/harbor/useBigQueryConnection', {
                userId: user?.sub,
                WorkspaceID: currentWorkspace.WorkspaceID,
                ...bigQueryVariables,
            });

            if (response.status === 200) {
                setUploadStatus('success');
                setIsUploading(false);
                setNotificationState(true, 'BigQuery connection details added successfully', 'success');
                const newDataSource: DataSource = response.data.dataSource;
                setDataSources([...dataSources, newDataSource]);
                return true;
            }
            setUploadStatus('error');
            setErrorMessage('An unknown error occurred');
            setNotificationState(true, 'Unknown error occurred.', 'failure');
            return false;
        } catch (error: unknown) {
            setIsUploading(false);

            console.log('error', error);
            if (error instanceof Error) {
                setNotificationState(true, 'Failed to connect to BigQuery', 'failure');
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
                setNotificationState(true, 'Unknown error occurred.', 'failure');
            }
            setUploadStatus('error');
            return false;
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
        saveBigQueryConnectionDetails,
    };
};

export default useBigQueryConnection;