import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import { useAuthStore } from 'zustand/auth/authStore';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

export type HubspotConnectionFormInputs = {
    apiKey: string;
    portalId: string;
}

const useHubspotConnection = () => {
    const [uploadStatus, setUploadStatus] = useState<
        'idle' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const { currentWorkspace } = useWorkspaceStore();
    const setDataSources = useHarborStore((state) => state.setDataSources);
    const dataSources = useHarborStore((state) => state.dataSources);

    const {
        setNotificationState,
    } = useNotificationStore();
    const { user } = useAuthStore();

    const saveHubspotConnectionDetails = async (
        hubspotVariables: HubspotConnectionFormInputs,
    ) => {
        try {
            setIsUploading(true);
            if (!currentWorkspace) {
                throw new Error('No workspace found');
            }
            const response = await axios.post('/api/harbor/useHubspotConnection', {
                userId: user?.sub,
                WorkspaceID: currentWorkspace.WorkspaceID,
                ...hubspotVariables,
            });

            console.log('result', response.data);

            if (response.status === 200) {
                setUploadStatus('success');
                setIsUploading(false);
                const newDataSources: DataSource[] = response.data.newDataSources;
                const errors: string[] = response.data.errors;
                if (errors.length > 0) {
                    setErrorMessage(errors.join('\n'));
                }
                setDataSources([...newDataSources, ...dataSources]);
                setNotificationState(true, 'Hubspot connection details added successfully', 'success');
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
        saveHubspotConnectionDetails,
    };
};

export default useHubspotConnection;