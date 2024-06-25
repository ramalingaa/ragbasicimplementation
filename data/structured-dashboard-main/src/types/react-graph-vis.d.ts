// react-graph-vis.d.ts
declare module 'react-graph-vis' {
  import { Component } from 'react';

  interface GraphProps {
    graph: {
      nodes: Array<{
        id: string | number;
        label?: string;
        color?: string;
        x?: number;
        y?: number;
      }>;
      edges: Array<{
        from: string | number;
        to: string | number;
        color?: string;
      }>;
    };
    options?: object;
    events?: object;
    style?: React.CSSProperties;
    getNetwork?: (network: any) => void;
  }

  export default class Graph extends Component<GraphProps> {}
}
