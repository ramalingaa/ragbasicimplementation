declare module 'react-vis-network-graph' {
  export interface GraphProps {
    graph: {
      nodes: Array<{
        id: any;
        label?: string;
        title?: string;
        color?: any;
        font?: any;
      }>;
      edges: Array<{ from: any; to: any; color?: string }>;
    };
    options?: any;
    events?: any;
    getNetwork?: (network: any) => void;
  }
  const Graph: React.ComponentType<GraphProps>;
  export default Graph;
}
