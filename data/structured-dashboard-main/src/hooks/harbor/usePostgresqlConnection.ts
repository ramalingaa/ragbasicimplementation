import { DataSource } from '../../interfaces/DataTypes';
import Papa from 'papaparse';
import axios from 'axios';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import useFetchDataSources from './useFetchDataSources';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useAuthStore } from 'zustand/auth/authStore';

export type PostgresConnectionFormInputs = {
    hostName: string;
    port: number;
    databaseName: string;
    userName: string;
    password: string;
    tableName: string;
}

const usePostgresqlConnection = () => {
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);


    const setDataSources = useHarborStore((state) => state.setDataSources);
    const dataSources = useHarborStore((state) => state.dataSources);
    const { currentWorkspace } = useWorkspaceStore();

    const {
        setNotificationState,
    } = useNotificationStore();

    const { user } = useAuthStore();

    const savePostgresqlConnectionDetails = async (
        postgresqlVariables: PostgresConnectionFormInputs,
    ) => {
        try {
            setIsUploading(true);
            if (!currentWorkspace) {
                throw new Error('No workspace found');
            }
            const response = await axios.post('/api/harbor/usePostgresqlConnection', {
                userId: user?.sub,
                WorkspaceID: currentWorkspace.WorkspaceID,
                ...postgresqlVariables,
            });

            if (response.status === 200) {
                setNotificationState(true, 'Postgresql connection details added successfully', 'success');
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
                setNotificationState(true, error.message, 'failure');
                setErrorMessage(error.message);
            } else {
                setNotificationState(true, 'An unknown error occurred', 'failure');
                setErrorMessage('An unknown error occurred');
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
        savePostgresqlConnectionDetails,
    };
};

export default usePostgresqlConnection;