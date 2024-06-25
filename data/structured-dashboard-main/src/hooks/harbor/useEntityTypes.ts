import { useEffect, useState } from 'react';

import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { set } from '@auth0/nextjs-auth0/dist/session';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useAuthStore } from 'zustand/auth/authStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useNotificationStore } from 'zustand/notification/notificationStore';

export default function useEntityTypes() {
    const { user } = useAuthStore();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const dataSources = useHarborStore((state) => state.dataSources);
    const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore();
    const {
        entityTypes,
        setEntityTypes,
    } = useHarborStore();

    const {
        setNotificationState,
    } = useNotificationStore();

    const generateEntityTypes = async () => {
        try {
            const url = "/api/harbor/getEntityTypes";
            setIsLoading(true);
            if (!currentWorkspace) {
                throw new Error('No workspace found');
            }
            if (!dataSources || dataSources.length === 0) {
                console.log("NO DATA SOURCES")
                return;
            }
            console.log("FETCHING ENTITY TYPES")
            const backend_url = "https://structuredlabs--get-entity-types.modal.run";
            // const backend_url = "https://structuredlabs--get-entity-types-dev.modal.run";
            const reqData = {
                userId: user?.sub,
                workspaceId: currentWorkspace.WorkspaceID,
                datasourcesIds: dataSources.map((ds) => ds.id),
            }
            const response = await axios.post(url, { backend_url, reqData });
            console.log('ENTITY TYPES reponse data', response.data);
            if (response.data.message === 'success') {
                console.log('ENTITY TYPES reponse data', response.data.res);
                const updatedEntityTypes = response.data.res;
                console.log({ updatedEntityTypes })
                setNotificationState(true, 'Entity Types Generated Successfully', 'success');
                setEntityTypes(updatedEntityTypes);
                setCurrentWorkspace({
                    ...currentWorkspace,
                    dbDetails: null,
                })
            } else {
                setNotificationState(true, 'Entity Types Generation Failed', 'failure');
            }
            setIsLoading(false);
        } catch (error: unknown) {
            setNotificationState(true, 'Entity Types Generation Failed', 'failure');
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEntityTypes = async () => {
        try {
            setIsLoading(true);
            if (!currentWorkspace) {
                throw new Error('No workspace found');
            }
            console.log("FETCHING ENTITY TYPES")
            const response = await axios.post('/api/harbor/fetchEntityTypes', {
                WorkspaceID: currentWorkspace.WorkspaceID,
            });
            console.log('response.data', response.data);
            if (response.status == 200) {
                setEntityTypes(response.data as DataSource[]);
            } else {
                throw new Error('Failed to fetch entity types');
            }
            setIsLoading(false);
            return response.data;
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

    return { errorMessage, isLoading, generateEntityTypes, fetchEntityTypes };
}