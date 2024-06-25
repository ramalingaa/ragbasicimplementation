import React from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import { GraphData } from 'force-graph';
import data from './blocks.json'; // Adjust the path to where your JSON is located

const GraphComponent2: React.FC = () => {
  return (
    <ForceGraph3D
      graphData={data as GraphData}
      nodeLabel={(node: any) => `${node.user}: ${node.description}`}
      nodeAutoColorBy="user"
      linkDirectionalParticles={1}
    />
  );
};

export default GraphComponent2;
