import React from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { GraphData } from 'react-force-graph-3d';

// Define the TypeScript interface for the node
interface Node {
  id: number;
}

// Define the TypeScript interface for the link
interface Link {
  source: number;
  target: number;
}

// The function to generate random tree data
function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1)),
      })),
  };
}

const GraphComponent: React.FC = () => {
  return <ForceGraph3D graphData={genRandomTree()} />;
};

export default GraphComponent;
