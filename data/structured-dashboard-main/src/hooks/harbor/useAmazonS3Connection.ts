import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from 'zustand/auth/authStore';
import useFetchDataSources from './useFetchDataSources';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { DataSource } from 'interfaces/DataTypes';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

const useAmazonS3Connection = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {
        setNotificationState,
    } = useNotificationStore();

    const setDataSources = useHarborStore((state) => state.setDataSources);
    const dataSources = useHarborStore((state) => state.dataSources);
    const { currentWorkspace } = useWorkspaceStore();

    const { user } = useAuthStore();

    const addAmazonS3BucketDetailsToDB = async (accessKeyID: string, secretAccessKey: string, bucketName: string, fileName: string, region: string) => {
        setIsConnecting(true);
        setErrorMessage(null);

        try {
            if (!currentWorkspace) {
                throw new Error('No workspace found');
            }
            const response = await axios.post('/api/harbor/useAmazonS3Connection', {
                userId: user?.sub,
                WorkspaceID: currentWorkspace.WorkspaceID,
                accessKeyID,
                secretAccessKey,
                bucketName,
                fileName,
                region,
            });
            console.log('Response:', response.data);
            if (response.status === 200) {
                setNotificationState(true, 'Amazon S3 bucket details added successfully', 'success');
                setIsConnecting(false);
                const newDataSource: DataSource = response.data.dataSource;
                setDataSources([...dataSources, newDataSource]);
                return true;
            }
            setNotificationState(true, 'Unknown error occurred.', 'failure');
            return false
        } catch (error) {
            console.error('Error connecting to Amazon S3', error);
            setNotificationState(true, 'Failed to connect to Amazon S3', 'failure');
            setIsConnecting(false);
            setErrorMessage('Failed to connect to Amazon S3');
            return false;
        }
    };

    return {
        addAmazonS3BucketDetailsToDB,
        isConnecting,
        errorMessage,
    };
}

export default useAmazonS3Connection;