import { edgeMarkerName } from "./edgeMarkerName";
import { edgeClassName } from "./edgeClassName";
import { calculateSourcePosition } from "./calculateSourcePosition";
import { calculateTargetPosition } from "./calculateTargetPosition";
import { Edge, Node } from "reactflow";
import { DatabaseConfig, EdgeConfig } from "../types";
import { v4 } from "uuid";

interface CalculateEdgesOptions {
  nodes: Node[];
  currentDatabase: DatabaseConfig;
}

export const calculateEdges = ({ nodes, currentDatabase }: CalculateEdgesOptions) => {
  const initialEdges: Edge[] = [];

  currentDatabase.edgeConfigs.forEach((edgeConfig: EdgeConfig) => {
    const sourceNode = nodes.find((node: Node) => node.id === edgeConfig.source);
    const targetNode = nodes.find((node: Node) => node.id === edgeConfig.target);
    if(sourceNode && targetNode) {
      const sourcePosition = edgeConfig.sourcePosition || calculateSourcePosition(sourceNode.width as number, sourceNode!.position.x, targetNode.width as number, targetNode!.position.x);
      const targetPosition = edgeConfig.targetPosition || calculateTargetPosition(sourceNode.width as number, sourceNode!.position.x, targetNode.width as number, targetNode!.position.x);

      const sourceHandle = `${edgeConfig.sourceKey}-${sourcePosition}`;
      const targetHandle = `${edgeConfig.targetKey}-${targetPosition}`;

      initialEdges.push({
        id: `${edgeConfig.source}-${edgeConfig.target}-${v4()}`,
        source: edgeConfig.source,
        target: edgeConfig.target,
        sourceHandle,
        targetHandle,
        type: "smoothstep",
        markerEnd: edgeMarkerName(edgeConfig, targetPosition),
        className: edgeClassName(edgeConfig, targetPosition)
      });
    }
  });

  return initialEdges;
};
