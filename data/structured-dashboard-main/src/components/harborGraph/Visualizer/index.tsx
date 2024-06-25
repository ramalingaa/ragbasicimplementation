import { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Node, useNodesState, useEdgesState,
  Controls, useStoreApi, ReactFlowProvider,
  getConnectedEdges, OnSelectionChangeParams, NodeChange, getIncomers,
  getOutgoers, ReactFlowInstance, useReactFlow
} from "reactflow";

import { nodeTypes } from "../config/nodeTypes";

import {
  InfoPopup,
  Markers
} from "./components";

import {
  edgeClassName,
  edgeMarkerName,
  calculateTargetPosition,
  calculateSourcePosition,
  initializeNodes,
  moveSVGInFront,
  setHighlightEdgeClassName,
  logTablePositions,
  setEdgeClassName,
  loadDatabases,
  calculateEdges
} from "./helpers";

import {
  EdgeConfig,
  DatabaseConfig
} from "./types";

// this is important! You need to import the styles from the lib to make it work
import "reactflow/dist/style.css";
import "./Style";
import { useHarborStore } from "zustand/harbor/harborStore";

interface FlowProps {
  currentDatabase: DatabaseConfig;
}

interface VisualizerProps {
  database?: string;
}

import dagre from 'dagre';
import { DataSource } from "interfaces/DataTypes";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 140;
const nodeHeight = 40;

const getLayoutedElements = (nodes: Node[], edges: any[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({
    rankdir: direction,
    align: 'UL',
    ranksep: isHorizontal ? 100 : 200,
    edgesep: isHorizontal ? 10 : 40,
    nodesep: isHorizontal ? 20 : 80,
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

const Flow: React.FC<FlowProps> = (props: FlowProps) => {
  const currentDatabase = props.currentDatabase;
  // const initialNodes = initializeNodes(props.currentDatabase);
  const calcNodes = initializeNodes(props.currentDatabase);
  const { typesTableAndGraphViewSideBySide } = useHarborStore();
  const initialEdges = calculateEdges({ nodes: calcNodes, currentDatabase });
  const { nodes: initialNodes, edges: layoutedEdges } = getLayoutedElements(calcNodes, initialEdges, !typesTableAndGraphViewSideBySide ? 'LR' : 'TB');

  const store = useStoreApi();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [fullscreenOn, setFullScreen] = useState(false);
  const [infoPopupOn, setInfoPopupOn] = useState(false);
  const [unknownDatasetOn, setUnknownDatasetOn] = useState(false);
  const [databaseMenuPopupOn, setDatabaseMenuPopupOn] = useState(false);
  const [nodeHoverActive, setNodeHoverActive] = useState(true);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const onInit = (instance: ReactFlowInstance) => {
    // const nodes = instance.getNodes();
    // const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, initialEdges, !typesTableAndGraphViewSideBySide ? 'LR' : 'TB');
    // setNodes(() => layoutedNodes);
    // setEdges(() => layoutedEdges);
    // console.log("layoutedEdges:", layoutedEdges, "layoutedNodes:", layoutedNodes)

    // setEdges(initialEdges);

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "p") {
        const nodes = instance.getNodes();

        logTablePositions(nodes);
      }
    }

    document.addEventListener("keydown", handleKeyboard)

    // https://javascriptf1.com/snippet/detect-fullscreen-mode-with-javascript
    window.addEventListener("resize", (event) => {
      setFullScreen(window.innerHeight === window.screen.height);
    });

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        setInfoPopupOn(false);
        setUnknownDatasetOn(false);
        setDatabaseMenuPopupOn(false);
      }
    });

    // https://stackoverflow.com/questions/42066421/property-value-does-not-exist-on-type-eventtarget
    document.addEventListener("click", (event: Event) => {
      const popup = document.querySelector(".info-popup");

      if (!popup) {
        return;
      }

      const target = (event.target as HTMLInputElement);

      if (target && target.closest(".into-popup-toggle")) {
        return;
      }

      if (target && !target.closest(".info-popup__inner")) {
        setInfoPopupOn(false);
        setUnknownDatasetOn(false);
        setDatabaseMenuPopupOn(false);
      }
    })

    document.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.code === "MetaLeft") {
        setNodeHoverActive(false);
      }
    }, false);

    document.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.code === "MetaLeft") {
        setNodeHoverActive(true);
      }
    }, false);
    setReactFlowInstance(instance);
  };

  useEffect(() => {
    if (reactFlowInstance && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 1.2, includeHiddenNodes: true });
      }, 50);
    }
  }, [reactFlowInstance, currentDatabase]);

  // https://github.com/wbkd/react-flow/issues/2580
  const onNodeMouseEnter = useCallback(
    (_: any, node: Node) => {
      if (!nodeHoverActive) {
        return;
      }

      const state = store.getState();
      state.resetSelectedElements();
      state.addSelectedNodes([node.id]);

      const connectedEdges = getConnectedEdges([node], edges);
      setEdges(eds => {
        return eds.map((ed) => {
          if (connectedEdges.find(e => e.id === ed.id)) {
            setHighlightEdgeClassName(ed);
          }

          return ed;
        });
      });
    },
    [edges, nodeHoverActive, setEdges, store]
  );

  const onNodeMouseLeave = useCallback(
    (_: any, node: Node) => {
      if (!nodeHoverActive) {
        return;
      }

      const state = store.getState();
      state.resetSelectedElements();

      setEdges(eds =>
        eds.map(ed => setEdgeClassName(ed))
      );

      // https://stackoverflow.com/questions/2520650/how-do-you-clear-the-focus-in-javascript
      (document.activeElement as HTMLElement).blur();
    },
    [nodeHoverActive, setEdges, store]
  );

  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const edges = params.edges;
      edges.forEach(ed => {
        const svg = document.querySelector(".react-flow__edges")?.querySelector(`[data-testid="rf__edge-${ed.id}"]`)
        moveSVGInFront(svg)
      })
    },
    []
  );

  const handleNodesChange = useCallback(
    (nodeChanges: NodeChange[]) => {
      nodeChanges.forEach(nodeChange => {
        if (nodeChange.type === "position" && nodeChange.positionAbsolute) { // nodeChange.positionAbsolute contains new position
          const node = nodes.find(node => node.id === nodeChange.id);

          if (!node) {
            return;
          }

          const incomingNodes = getIncomers(node, nodes, edges);
          incomingNodes.forEach(incomingNode => {
            const edge = edges.find(edge => {
              return edge.id === `${incomingNode.id}-${node.id}`;
            });

            const edgeConfig = currentDatabase.edgeConfigs.find((edgeConfig: EdgeConfig) => {
              return edgeConfig.source === incomingNode.id && edgeConfig.target === node.id;
            });

            if (nodeChange.positionAbsolute?.x) {
              setEdges(eds =>
                eds.map(ed => {
                  if (edge && ed.id === edge.id) {
                    const sourcePosition = edgeConfig!.sourcePosition || calculateSourcePosition((incomingNode.width as number), incomingNode.position.x, (node.width as number), nodeChange.positionAbsolute!.x);
                    const targetPosition = edgeConfig!.targetPosition || calculateTargetPosition((incomingNode.width as number), incomingNode.position.x, (node.width as number), nodeChange.positionAbsolute!.x);

                    const sourceHandle = `${edgeConfig!.sourceKey}-${sourcePosition}`;
                    const targetHandle = `${edgeConfig!.targetKey}-${targetPosition}`;

                    ed.sourceHandle = sourceHandle;
                    ed.targetHandle = targetHandle;
                    ed.className = edgeClassName(edgeConfig, targetPosition);
                    ed.markerEnd = edgeMarkerName(edgeConfig, targetPosition);
                  }

                  return ed;
                })
              )
            }
          });

          const outgoingNodes = getOutgoers(node, nodes, edges);
          outgoingNodes.forEach(targetNode => {
            const edge = edges.find(edge => {
              return edge.id === `${node.id}-${targetNode.id}`;
            });

            const edgeConfig = currentDatabase.edgeConfigs.find((edgeConfig: EdgeConfig) => {
              return edgeConfig.source === nodeChange.id && edgeConfig.target === targetNode.id;
            });

            if (nodeChange.positionAbsolute?.x) {
              setEdges(eds =>
                eds.map(ed => {
                  if (edge && ed.id === edge.id) {
                    const sourcePosition = edgeConfig!.sourcePosition || calculateSourcePosition((node.width as number), nodeChange.positionAbsolute!.x, (targetNode.width as number), targetNode.position.x);
                    const targetPosition = edgeConfig!.targetPosition || calculateTargetPosition((node.width as number), nodeChange.positionAbsolute!.x, (targetNode.width as number), targetNode.position.x);

                    const sourceHandle = `${edgeConfig!.sourceKey}-${sourcePosition}`;
                    const targetHandle = `${edgeConfig!.targetKey}-${targetPosition}`;

                    ed.sourceHandle = sourceHandle;
                    ed.targetHandle = targetHandle;
                    ed.className = edgeClassName(edgeConfig, targetPosition);
                    ed.markerEnd = edgeMarkerName(edgeConfig, targetPosition);
                  }

                  return ed;
                })
              )
            }
          });
        }
      });

      onNodesChange(nodeChanges);
    },
    [onNodesChange, setEdges, nodes, edges, currentDatabase]
  )

  // https://stackoverflow.com/questions/16664584/changing-an-svg-markers-color-css
  return (
    <div className="Flow">
      <Markers />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={onInit}
        snapToGrid={true}
        fitView
        fitViewOptions={{ padding: 1.2, includeHiddenNodes: true }}
        snapGrid={[16, 16]}
        nodeTypes={nodeTypes}
        // onNodeMouseEnter={onNodeMouseEnter}
        // onNodeMouseLeave={onNodeMouseLeave}
        onSelectionChange={onSelectionChange}
      >
        <Controls showInteractive={false}>
        </Controls>
        {/* <Background color="#aaa" gap={16} /> */}
      </ReactFlow>
      {infoPopupOn && <InfoPopup onClose={() => { setInfoPopupOn(false) }} />}
    </div>
  );
}

// https://codesandbox.io/s/elastic-elion-dbqwty?file=/src/App.js
// eslint-disable-next-line import/no-anonymous-default-export
const Visualizer: React.FC<VisualizerProps> = (props: VisualizerProps) => {
  const [currentDatabase, setCurrentDatabase] = useState<DatabaseConfig | null>(null);
  const { entityTypes, dataSources, typesTableAndGraphViewSideBySide, setTypesTableAndGraphViewSideBySide } = useHarborStore();

  const databaseConfig = useMemo(() => {
    if (!props.database) return null;
    if (props.database === "entity") {
      return loadDatabases(entityTypes, props.database);
    }
    return loadDatabases(dataSources.filter((ds: DataSource) => ds.fileMetadata.source !== 'join'), props.database);
  }, [entityTypes, dataSources, props.database]);

  useEffect(() => {
    if (!databaseConfig) return;
    const config = databaseConfig[props.database as string] as DatabaseConfig;
    console.log("databaseConfig:", config);
    setCurrentDatabase(config);
  }, [databaseConfig, props.database]);

  // Generate a unique key based on the databaseConfig to force re-render
  const flowKey = useMemo(() => {
    return Date.now(); // or a more specific property of databaseConfig if it's defined
  }, [currentDatabase]);

  return (
    <ReactFlowProvider>
      {currentDatabase && <Flow key={flowKey} currentDatabase={currentDatabase} />}
    </ReactFlowProvider>
  );
};

export default Visualizer;
