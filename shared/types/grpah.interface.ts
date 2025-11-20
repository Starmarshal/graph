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

export type GraphType = 'undirected' | 'directed';

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
  fromVertex: number;
  distances: Map<number, number>;
}

export interface ConnectivityResult {
  isConnected: boolean;
  components: number[][];
}