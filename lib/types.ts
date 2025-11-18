export type GraphType = 'directed' | 'undirected';

export interface Vertex {
  id: number;
  x: number;
  y: number;
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface GraphData {
  vertices: Vertex[];
  edges: Edge[];
  type: GraphType;
}

export interface ShortestPathResult {
  path: number[];
  distance: number;
}

export interface MSTResult {
  edges: Edge[];
  totalWeight: number;
}

export interface DistanceResult {
  distances: Map<number, number>;
  fromVertex: number;
}

export interface ConnectivityResult {
  isConnected: boolean;
  components: number[][];
}