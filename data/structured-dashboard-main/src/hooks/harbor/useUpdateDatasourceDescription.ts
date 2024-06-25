import { DataSource } from '../../interfaces/DataTypes';
import axios from 'axios';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { Schema } from 'components/harbor/DataViewModal';

const useUpdateDatasourceDescription = () => {
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
    const selectedDataSourceOnDataView = useHarborStore((state) => state.selectedDataSourceOnDataView);
    const setSelectedDataSourceOnDataView = useHarborStore((state) => state.setSelectedDataSourceOnDataView);

    const saveDescription = async (
        datasourceId: string,
        description: string,
    ) => {
        try {
            setIsUploading(true);
            const response = await axios.post('/api/harbor/useUpdateDatasourceDescription', {
                WorkspaceId: currentWorkspace.WorkspaceID,
                datasourceId: datasourceId,
                description: description,
            });

            console.log('result', response.data);
            if (response.status === 200) {
                setIsUploading(false);
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
            return false;
        }
    };

    const saveDescriptionForColumnInSchema = async (
        columnName: string,
        description: string,
    ) => {
        try {
            const updatedDataSources = dataSources.map((dataSource) => {
                if (dataSource.id === selectedDataSourceOnDataView.id) {
                    return {
                        ...dataSource,
                        fileMetadata: {
                            ...dataSource.fileMetadata,
                            schema: dataSource.fileMetadata.schema.map((schema: Schema) => {
                                if (schema.columnName === columnName) {
                                    console.log('schema', schema, columnName)
                                    return {
                                        ...schema,
                                        description: description,
                                    } as Schema;
                                }
                                return schema;
                            }),
                        }
                    };
                }
                return dataSource;
            });
            setDataSources(updatedDataSources);
            const updatedSelectedDataSourceOnDataView = {
                ...selectedDataSourceOnDataView,
                fileMetadata: {
                    ...selectedDataSourceOnDataView.fileMetadata,
                    schema: selectedDataSourceOnDataView.fileMetadata.schema.map((schema: Schema) => {
                        if (schema.columnName === columnName) {
                            return {
                                ...schema,
                                description: description,
                            } as Schema;
                        }
                        return schema;
                    }),
                }
            };
            setSelectedDataSourceOnDataView(
                updatedSelectedDataSourceOnDataView
            );
            setIsUploading(true);
            const response = await axios.post('/api/harbor/useSaveDescriptionForColumnInSchema', {
                WorkspaceId: currentWorkspace.WorkspaceID,
                datasourceId: selectedDataSourceOnDataView.id,
                columnName: columnName,
                description: description,
            });

            console.log('result', response.data);
            if (response.status === 200) {
                setIsUploading(false);
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
            return false;
        }
    }

    return {
        saveDescription,
        uploadStatus,
        errorMessage,
        uploadProgress,
        setUploadStatus,
        setErrorMessage,
        setUploadProgress,
        isUploading,
        saveDescriptionForColumnInSchema
    };
};

export default useUpdateDatasourceDescription;
