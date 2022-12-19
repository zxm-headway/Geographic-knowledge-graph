import { EdgeConfig, NodeConfig } from "@antv/g6";

export interface Cluster {
  id: string;
  nodes: NodeConfig[];
  sumTot?: number;
}
export interface ClusterData {
  clusters: Cluster[];
  clusterEdges: EdgeConfig[];
}
