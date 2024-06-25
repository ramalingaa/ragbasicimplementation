import { v4 } from 'uuid';
import { useHarborStore } from 'zustand/harbor/harborStore';
import { Schema } from './DataViewModal';
import { MdJoinFull } from 'react-icons/md';
import Script from 'next/script'
import { FILE_SOURCE_TYPE } from 'utils/constants';
import { DataSource } from 'interfaces/DataTypes';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Node,
    Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCallback } from 'react';

const Associations = () => {
    const selectedDataSource = useHarborStore((state) => state.selectedDataSourceOnDataView);
    const { dataSources } = useHarborStore();

    function findJoinableDataSources() {
        // Check if selected data source is defined and has a schema
        if (!selectedDataSource?.fileMetadata?.schema) {
            console.log("Selected data source is undefined or lacks a schema.");
            return [];
        }

        const selectedSchemaColumns = selectedDataSource.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());

        return dataSources.filter(dataSource => {
            // Ensure we're not comparing the selected data source to itself
            if (dataSource.uuid === selectedDataSource.uuid) {
                return false;
            }

            // Check if the other data source has a schema and if so, check for overlaps
            if (!dataSource.fileMetadata?.schema) {
                return false;
            }

            const dataSourceSchemaColumns = dataSource.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());
            const overlappingColumns = selectedSchemaColumns.filter((columnName: string) => dataSourceSchemaColumns.includes(columnName));

            return overlappingColumns.length > 0; // Only include datasources with overlapping columns
        });
    }

    const getNodesForJoinedDataSource = () => {
        return [
            ...selectedDataSource?.fileMetadata?.sourceFileUUIDs.map((sourceFileUUID: string) => {
                const sourceDatasource = dataSources.find((dataSource) => dataSource.uuid === sourceFileUUID);
                const joinedColumns = selectedDataSource?.fileMetadata?.joinColumns;
                const overlappingColumns = sourceDatasource?.fileMetadata?.schema.map((schema: Schema) => {
                    if (joinedColumns.includes(schema.columnName.toLowerCase())) {
                        return schema.columnName;
                    }
                })
                return {
                    id: sourceFileUUID,
                    type: 'default',
                    data: {label: sourceDatasource?.name || 'Unknown Source'},
                    position: {
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    },
                    style: {
                        borderColor: '#60a5fa',
                    }
                }
            })
        ]
    }

    const getNodesForOriginalDataSource = () => {
        const potentialDatasourcesForJoin = findJoinableDataSources();
        return potentialDatasourcesForJoin.map((dataSource: DataSource) => {
            return {
                id: dataSource.uuid,
                type: 'default',
                data: {label: dataSource.name,},
                position: {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                },
                style: {
                    borderColor: '#60a5fa',
                }
            }
        });
    }

    const getNodesWrapper = () => {
        if (selectedDataSource?.fileMetadata?.source == FILE_SOURCE_TYPE.JOIN) {
            return getNodesForJoinedDataSource();
        } else {
            return getNodesForOriginalDataSource();
        }
    }

    const nodesInit = selectedDataSource ? getNodesWrapper() : [];
    const [nodes, setNodes, onNodesChange] = useNodesState(nodesInit);

    const getEdgesForJoinedDataSource = () => {
        return selectedDataSource?.fileMetadata?.sourceFileUUIDs.flatMap((sourceFileUUID: string) => {
            const datasource1 = dataSources.find((dataSource) => dataSource.uuid === sourceFileUUID);
            if (!datasource1?.fileMetadata?.schema) {
                return [];
            }

            return dataSources.filter(ds => ds.uuid !== datasource1.uuid).map((datasource2) => {
                if (!datasource2.fileMetadata?.schema) {
                    return null;
                }

                const schema1Columns = datasource1.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());
                const schema2Columns = datasource2.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());

                const overlappingColumns = schema1Columns.filter((columnName: string) => schema2Columns.includes(columnName));

                if (overlappingColumns.length === 0) {
                    return null; // Skip creating an edge if there are no overlapping columns
                }

                return {
                    type: 'smoothstep',
                    source: sourceFileUUID,
                    target: datasource2.uuid,
                    id: `${sourceFileUUID}-${datasource2.uuid}`,
                    label: overlappingColumns.join(', '),
                    animated: true,
                };
            }).filter(edge => edge !== null);
        }) ?? [];
    }

    const getEdgesForOriginalDataSource = () => {
        const potentialDatasourcesForJoin = findJoinableDataSources();
        return potentialDatasourcesForJoin.flatMap((dataSource1: DataSource) => {
            if (!dataSource1?.fileMetadata?.schema) {
                return [];
            }

            return dataSources.filter(dataSource2 => dataSource1.uuid !== dataSource2.uuid).map((dataSource2: DataSource) => {
                if (!dataSource2.fileMetadata?.schema) {
                    return null;
                }

                const schema1Columns = dataSource1.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());
                const schema2Columns = dataSource2.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());

                const overlappingColumns = schema1Columns.filter((columnName: string) => schema2Columns.includes(columnName));

                if (overlappingColumns.length === 0) {
                    return null;
                }

                return {
                    type: 'smoothstep',
                    source: dataSource1.uuid,
                    target: dataSource2.uuid,
                    id: `${dataSource1.uuid}-${dataSource2.uuid}`,
                    label: overlappingColumns.join(', '),
                    animated: true,
                };
            }).filter(edge => edge !== null);
        })
    }

    const getEdgesWrapper = () => {
        if (selectedDataSource?.fileMetadata?.source == FILE_SOURCE_TYPE.JOIN) {
            return getEdgesForJoinedDataSource();
        } else {
            return getEdgesForOriginalDataSource();
        }
    }

    const edgesInit = getEdgesWrapper();
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgesInit);


    const OriginalSourcesUI = () => {
        return (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Original Sources</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {
                        selectedDataSource?.fileMetadata?.sourceFileUUIDs.map((sourceFileUUID: string) => {
                            const dataSourceName = dataSources.find((dataSource) => dataSource.uuid === sourceFileUUID)?.name || 'Unknown Source';
                            return (
                                <span key={dataSourceName} className="mr-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    {dataSourceName}
                                </span>
                            )
                        })
                    }
                </dd>
            </div>
        )
    }

    const ColumnsConnectedUI = () => {
        return (
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">Columns Connected</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {
                        selectedDataSource?.fileMetadata?.joinColumns.map((column: string) => {
                            return (
                                <span key={column} className="mr-2 inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    {column}
                                </span>
                            )
                        })
                    }
                </dd>
            </div>
        )
    }

    const JoinedSourceView = () => {
        return (
            <>
                <OriginalSourcesUI />
                <ColumnsConnectedUI />
            </>
        )
    }

    const UIWrapper = () => {
        if (selectedDataSource?.fileMetadata?.source == FILE_SOURCE_TYPE.JOIN) {
            return <JoinedSourceView />;
        } else {
            return <></>;
        }
    }
    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
        [setEdges],
    );

    return (
        <div className='px-5 w-full'>
            <div className="border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                    <UIWrapper />
                    <div className="py-6 w-full flex sm:px-0">
                        <dd className="mt-1 text-sm leading-6 text-gray-700 w-full sm:mt-0">
                            <div
                                className='rounded-md h-[60vh]'
                            >
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    snapToGrid={true}
                                    defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
                                    attributionPosition="top-right"
                                    fitView
                                >
                                    <Controls />
                                </ReactFlow>
                            </div>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    )
}

export default Associations;


{/* <Script
                                strategy="beforeInteractive"
                                rel="stylesheet"
                                src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
                                async
                            /> */}