import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useAuthStore } from 'zustand/auth/authStore';

// Define a type for the below variables
export type SnowflakeVariables = {
    account: string;
    username: string;
    password: string;
    application?: string;
    role?: string;
    warehouse: string;
    database: string;
    schema: string;
    tableName: string;
};

const useSnowflakeConnection = () => {
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const { currentWorkspace } = useWorkspaceStore();

    const {
        setNotificationState,
    } = useNotificationStore();

    const setDataSources = useHarborStore((state) => state.setDataSources);
    const dataSources = useHarborStore((state) => state.dataSources);

    const { user } = useAuthStore();

    const saveSnowflakeFile = async (
        snowflakeVariables: SnowflakeVariables,
    ) => {
        try {
            setIsUploading(true);
            const response = await axios.post('/api/harbor/useSnowflakeConnection', {
                userId: user?.sub,
                WorkspaceID: currentWorkspace.WorkspaceID,
                ...snowflakeVariables,
            });

            console.log('result', response.data);

            if (response.status === 200) {
                setNotificationState(true, 'Snowflake file uploaded successfully', 'success');
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
                setNotificationState(true, 'Failed to connect to Snowflake', 'failure');
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
        saveSnowflakeFile,
        uploadStatus,
        errorMessage,
        uploadProgress,
        setUploadStatus,
        setErrorMessage,
        setUploadProgress,
        isUploading,
    };
};

export default useSnowflakeConnection;
