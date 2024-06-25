import { DataSource } from '../../interfaces/DataTypes';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Schema } from './DataViewModal';
import EmptyState from 'components/emptyState/EmptyState';
import ReactFlow, {
    Controls, useNodesState,
    useEdgesState,
    addEdge,
    Node,
    useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';
import { BiNetworkChart } from "react-icons/bi";
import dagre from 'dagre';
import { MdLabelImportantOutline } from "react-icons/md";
import { MdLabelOff } from "react-icons/md";

interface ContainerSize {
    width: number;
    height: number;
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 140;
const nodeHeight = 20;

const getLayoutedElements = (nodes: Node[], edges: any[], direction = 'TB') => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({
        rankdir: direction,
        align: 'UL',
        ranksep: 100,
        edgesep: 20,
        nodesep: 50,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: any) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? 'left' : 'top';
        node.sourcePosition = isHorizontal ? 'right' : 'bottom';

        // Adjusting positions to match React Flow anchor points
        node.position = {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
        };
    });

    return { nodes, edges };
};

export default function TypesNodesGraph() {
    const { entityTypes } = useHarborStore();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [showEdgeLabels, setShowEdgeLabels] = useState(true);

    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const { fitView } = useReactFlow();
    useEffect(() => {
        if (containerSize.height === 0 || containerSize.width === 0 || !entityTypes.length) {
            console.log('Container size not set yet')
            return;
        }
        const nodesLocal: Node[] = entityTypes.map((dataSource) => ({
            id: dataSource.uuid,
            type: 'default',
            data: { label: dataSource.name },
            position: {
                x: 0,
                y: 0,
            },
            style: {
                borderColor: '#60a5fa',
            }
        }));

        const edgesLocal = (() => {
            const createdEdges = new Set(); // To track created edges between pairs

            return entityTypes.flatMap((dataSource1: DataSource) => {
                // Skip if the first data source has no schema
                if (!dataSource1?.fileMetadata?.schema) {
                    return [];
                }

                return entityTypes.filter(dataSource2 => {
                    // Ensure different data sources and check if an edge already exists
                    return dataSource1.uuid !== dataSource2.uuid && !createdEdges.has(`${dataSource2.uuid}-${dataSource1.uuid}`);
                }).map((dataSource2: DataSource) => {
                    // Skip if the second data source has no schema
                    if (!dataSource2?.fileMetadata?.schema) {
                        return null;
                    }

                    // Lowercase column names for comparison
                    const schema1Columns = dataSource1.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());
                    const schema2Columns = dataSource2.fileMetadata.schema.map((schema: Schema) => schema.columnName.toLowerCase());

                    // Find overlapping column names
                    const overlappingColumns = schema1Columns.filter((columnName: string) => schema2Columns.includes(columnName));

                    // If no overlaps, skip creating an edge
                    if (overlappingColumns.length === 0) {
                        return null;
                    }

                    // Create a unique identifier for the edge to prevent duplicate in reverse direction
                    const edgeIdentifier = `${dataSource1.uuid}-${dataSource2.uuid}`;
                    createdEdges.add(edgeIdentifier);

                    return {
                        type: 'smoothstep',
                        source: dataSource1.uuid,
                        target: dataSource2.uuid,
                        id: `${dataSource1.uuid}-${dataSource2.uuid}`,
                        label: overlappingColumns.join(', '),
                        animated: false,
                    };
                }).filter(edge => edge !== null); // Filter out non-existent edges
            });
        })();
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodesLocal, edgesLocal);

        // Please check this useEffect only with entityTypes, it re-renders infintely and crashes the app
        // check if nodes obj and nodesLocal obj are different after sorting
        const sortedNodes = nodes.map(n => n.id).sort();
        const sortedLayoutedNodes = layoutedNodes.map(n => n.id).sort();
        if (JSON.stringify(sortedNodes) !== JSON.stringify(sortedLayoutedNodes)) {
            fitView({ padding: 0.2 });
            setNodes(layoutedNodes);
        }

        // check if edges obj and edgesLocal obj are different after sorting
        const sortedEdges = edges.map(e => e.id).sort();
        const sortedLayoutedEdges = layoutedEdges.map(e => e.id).sort();
        if (JSON.stringify(sortedEdges) !== JSON.stringify(sortedLayoutedEdges)) {
            console.log('Setting edges')
            setEdges(layoutedEdges);
        }
    }, [entityTypes, nodes, containerSize.height, fitView]);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: false }, eds)),
        [setEdges],
    );

    const containerRef = useRef(null);
    useEffect(() => {
        const updateContainerSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        // Call the function to update the container size
        updateContainerSize();
    }, [containerRef.current]);

    const { selectedDataSources, setSelectedDataSources } = useHarborStore();
    const handleNodeClick = (event: any, node: any) => {
        if (selectedDataSources.map(ds => ds.uuid).includes(node.id)) {
            setSelectedDataSources(selectedDataSources.filter(ds => ds.uuid !== node.id));
        } else {
            setSelectedDataSources([...selectedDataSources, entityTypes.find(ds => ds.uuid === node.id)]);
        }
    };

    const { sourcesTableAndGraphViewSideBySide } = useHarborStore();

    return (
        <div className='flex flex-col w-full h-full'>
            {false ? (
                <div className="mt-4 py-4 flex justify-center items-center h-full">
                    <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-gray-600"
                        role="status">
                        <span
                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span>
                    </div>
                </div>
            ) : (
                entityTypes.length === 0 ? (
                    <EmptyState
                        title='No Preview'
                        desciption='There are no entity types in this workspace.'
                        icon={<BiNetworkChart className="mx-auto h-12 w-12 text-gray-400" />}
                    />
                ) : (
                    <>
                        <div
                            className={`rounded-md ${sourcesTableAndGraphViewSideBySide ? "h-full" : "h-full"} w-full`}
                            ref={containerRef}
                        >
                            <ReactFlow
                                nodes={nodes}
                                edges={edges.map(edge => ({
                                    ...edge,
                                    label: showEdgeLabels ? edge.label : '',
                                    style: { stroke: '#d3d3d3', strokeWidth: 1 },
                                }))}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                snapToGrid={true}
                                defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
                                attributionPosition="top-right"
                                fitView
                                fitViewOptions={{ padding: 1.2, includeHiddenNodes: true }}
                                onNodeClick={handleNodeClick}

                            >
                                <Controls className='flex flex-col'>
                                    <button className='react-flow__controls-button react-flow__controls-interactive' onClick={() => setShowEdgeLabels(!showEdgeLabels)}>
                                        {showEdgeLabels ? <MdLabelImportantOutline className='text-black' /> : <MdLabelOff className='text-black' />}
                                    </button>
                                </Controls>
                            </ReactFlow>
                        </div>
                    </>
                )
            )}
        </div>
    );
}
