import {
  GraphType,
  Vertex,
  Edge,
  ShortestPathResult,
  MSTResult,
  DistanceResult,
  ConnectivityResult
} from '@/shared/types/graph.interface';

export class Graph {
  private adjList: Map<number, Map<number, number>>;
  private vertices: Set<number>;
  private graphType: GraphType;

  constructor(graphType: GraphType = 'undirected') {
    this.adjList = new Map();
    this.vertices = new Set();
    this.graphType = graphType;
  }

  initializeFromData(vertices: Vertex[], edges: Edge[], graphType: GraphType): void {
    this.vertices = new Set(vertices.map(v => v.id));
    this.adjList = new Map();
    this.graphType = graphType;

    vertices.forEach(vertex => {
      this.adjList.set(vertex.id, new Map());
    });

    edges.forEach(edge => {
      if (this.graphType === 'undirected') {
        this.addEdge(edge.from, edge.to, edge.weight);
        this.addEdge(edge.to, edge.from, edge.weight);
      } else {
        this.addEdge(edge.from, edge.to, edge.weight);
      }
    });
  }

  size(): number {
    return this.vertices.size;
  }

  weight(v1: number, v2: number): number {
    const neighbors = this.adjList.get(v1);
    if (neighbors && neighbors.has(v2)) {
      return neighbors.get(v2)!;
    }
    return Infinity;
  }

  isEdge(v1: number, v2: number): boolean {
    const neighbors = this.adjList.get(v1);
    return !!(neighbors && neighbors.has(v2));
  }

  addVertex(v: number): void {
    if (!this.vertices.has(v)) {
      this.vertices.add(v);
      if (!this.adjList.has(v)) {
        this.adjList.set(v, new Map());
      }
    }
  }

  addEdge(v1: number, v2: number, weight: number): void {
    if (!this.vertices.has(v1)) this.addVertex(v1);
    if (!this.vertices.has(v2)) this.addVertex(v2);
    this.adjList.get(v1)!.set(v2, weight);
  }

  removeVertex(v: number): void {
    if (this.vertices.has(v)) {
      this.vertices.delete(v);
      this.adjList.delete(v);
      for (const [, neighbors] of this.adjList) {
        neighbors.delete(v);
      }
    }
  }

  removeEdge(v1: number, v2: number): void {
    this.adjList.get(v1)?.delete(v2);
    if (this.graphType === 'undirected') {
      this.adjList.get(v2)?.delete(v1);
    }
  }

  listOfEdges(vertex?: number): Edge[] {
    if (vertex !== undefined) {
      const neighbors = this.adjList.get(vertex);
      if (!neighbors) return [];
      return Array.from(neighbors.entries()).map(([to, weight]) => ({
        from: vertex,
        to,
        weight
      }));
    } else {
      const edges: Edge[] = [];
      if (this.graphType === 'undirected') {
        const edgesSet = new Set<string>();
        for (const [from, neighbors] of this.adjList) {
          for (const [to, weight] of neighbors) {
            const key = [Math.min(from, to), Math.max(from, to)].join('-');
            if (!edgesSet.has(key)) {
              edgesSet.add(key);
              edges.push({from, to, weight});
            }
          }
        }
      } else {
        for (const [from, neighbors] of this.adjList) {
          for (const [to, weight] of neighbors) {
            edges.push({from, to, weight});
          }
        }
      }
      return edges;
    }
  }

  getVertices(): number[] {
    return Array.from(this.vertices).sort((a, b) => a - b);
  }

  isConnected(): ConnectivityResult {
    if (this.vertices.size === 0) {
      return {isConnected: true, components: []};
    }

    const visited = new Set<number>();
    const components: number[][] = [];

    for (const vertex of this.vertices) {
      if (!visited.has(vertex)) {
        const component: number[] = [];
        const stack: number[] = [vertex];

        while (stack.length > 0) {
          const current = stack.pop()!;
          if (!visited.has(current)) {
            visited.add(current);
            component.push(current);
            const neighbors = this.adjList.get(current);
            if (neighbors) {
              for (const neighbor of neighbors.keys()) {
                if (!visited.has(neighbor)) {
                  stack.push(neighbor);
                }
              }
            }
          }
        }
        components.push(component.sort((a, b) => a - b));
      }
    }

    return {
      isConnected: components.length === 1,
      components
    };
  }

  weakConnectedComponents(): ConnectivityResult {
    const undirectedAdjList = new Map<number, Set<number>>();

    for (const vertex of this.vertices) {
      undirectedAdjList.set(vertex, new Set());
    }

    for (const [from, neighbors] of this.adjList) {
      for (const to of neighbors.keys()) {
        undirectedAdjList.get(from)!.add(to);
        undirectedAdjList.get(to)!.add(from);
      }
    }

    const visited = new Set<number>();
    const components: number[][] = [];

    for (const vertex of this.vertices) {
      if (!visited.has(vertex)) {
        const component: number[] = [];
        const stack: number[] = [vertex];

        while (stack.length > 0) {
          const current = stack.pop()!;
          if (!visited.has(current)) {
            visited.add(current);
            component.push(current);
            const neighbors = undirectedAdjList.get(current);
            if (neighbors) {
              for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                  stack.push(neighbor);
                }
              }
            }
          }
        }
        components.push(component.sort((a, b) => a - b));
      }
    }

    return {
      isConnected: components.length === 1,
      components
    };
  }

  bellmanFord(start: number): { distances: Map<number, number>, predecessors: Map<number, number | null> } {
    const distances = new Map<number, number>();
    const predecessors = new Map<number, number | null>();

    for (const vertex of this.vertices) {
      distances.set(vertex, Infinity);
      predecessors.set(vertex, null);
    }
    distances.set(start, 0);

    for (let i = 0; i < this.vertices.size - 1; i++) {
      let updated = false;

      for (const [u, neighbors] of this.adjList) {
        for (const [v, weight] of neighbors) {
          const distU = distances.get(u)!;
          const distV = distances.get(v)!;

          if (distU !== Infinity && distU + weight < distV) {
            distances.set(v, distU + weight);
            predecessors.set(v, u);
            updated = true;
          }
        }
      }

      if (!updated) break;
    }

    for (const [u, neighbors] of this.adjList) {
      for (const [v, weight] of neighbors) {
        const distU = distances.get(u)!;
        const distV = distances.get(v)!;
        if (distU !== Infinity && distU + weight < distV) {
          throw new Error('Граф содержит отрицательный цикл');
        }
      }
    }

    return {distances, predecessors};
  }

  shortestPath(start: number, end: number): ShortestPathResult {
    if (!this.vertices.has(start) || !this.vertices.has(end)) {
      return {path: [], distance: Infinity};
    }

    try {
      const {distances, predecessors} = this.bellmanFord(start);

      if (distances.get(end) === Infinity) {
        return {path: [], distance: Infinity};
      }

      const path: number[] = [];
      let current: number | null = end;

      while (current !== null) {
        path.unshift(current);
        current = predecessors.get(current)!;
      }

      return {path, distance: distances.get(end)!};
    } catch (error) {
      console.error(`Ошибка при поиске пути: ${error}`);
      return {path: [], distance: Infinity};
    }
  }

  distancesFromVertex(start: number): DistanceResult {
    if (!this.vertices.has(start)) {
      const emptyDistances = new Map<number, number>();
      for (const vertex of this.vertices) {
        emptyDistances.set(vertex, Infinity);
      }
      return {distances: emptyDistances, fromVertex: start};
    }

    try {
      const {distances} = this.bellmanFord(start);
      return {distances, fromVertex: start};
    } catch (error) {
      console.error(`Ошибка при вычислении расстояний: ${error}`);
      const emptyDistances = new Map<number, number>();
      for (const vertex of this.vertices) {
        emptyDistances.set(vertex, Infinity);
      }
      return {distances: emptyDistances, fromVertex: start};
    }
  }

  kruskalMST(): MSTResult {
    if (this.vertices.size === 0) {
      return {edges: [], totalWeight: 0};
    }

    const edges: [number, number, number][] = [];
    const edgeSet = new Set<string>();

    for (const [u, neighbors] of this.adjList) {
      for (const [v, weight] of neighbors) {
        const key = this.graphType === 'undirected'
          ? [Math.min(u, v), Math.max(u, v)].join('-')
          : `${u}-${v}`;

        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push([u, v, weight]);

          if (this.graphType === 'directed') {
            const reverseKey = `${v}-${u}`;
            if (!edgeSet.has(reverseKey)) {
              edgeSet.add(reverseKey);
              edges.push([v, u, weight]);
            }
          }
        }
      }
    }

    edges.sort((a, b) => a[2] - b[2]);

    const parent = new Map<number, number>();
    const rank = new Map<number, number>();

    const find = (v: number): number => {
      if (!parent.has(v)) {
        parent.set(v, v);
        rank.set(v, 0);
        return v;
      }

      if (parent.get(v) !== v) {
        parent.set(v, find(parent.get(v)!));
      }
      return parent.get(v)!;
    };

    const union = (v1: number, v2: number): boolean => {
      const root1 = find(v1);
      const root2 = find(v2);

      if (root1 !== root2) {
        const rank1 = rank.get(root1)!;
        const rank2 = rank.get(root2)!;

        if (rank1 > rank2) {
          parent.set(root2, root1);
        } else {
          parent.set(root1, root2);
          if (rank1 === rank2) {
            rank.set(root2, rank2 + 1);
          }
        }
        return true;
      }
      return false;
    };

    const mstEdges: Edge[] = [];
    let totalWeight = 0;

    for (const [u, v, weight] of edges) {
      if (union(u, v)) {
        mstEdges.push({from: u, to: v, weight});
        totalWeight += weight;
        if (mstEdges.length === this.vertices.size - 1) {
          break;
        }
      }
    }

    return {edges: mstEdges, totalWeight};
  }

  exportToFile(format: 'matrix' | 'list' = 'matrix'): string {
    const vertices = this.getVertices();
    let content = '';

    if (format === 'matrix') {
      for (const v1 of vertices) {
        const row: number[] = [];
        for (const v2 of vertices) {
          row.push(this.isEdge(v1, v2) ? this.weight(v1, v2) : 0);
        }
        content += row.join(' ') + '\n';
      }
    } else {
      for (const vertex of vertices) {
        const neighbors = this.adjList.get(vertex);
        if (neighbors && neighbors.size > 0) {
          const neighborList = Array.from(neighbors.entries())
            .map(([neighbor, weight]) => `${neighbor}:${weight}`)
            .join(' ');
          content += `${vertex}: ${neighborList}\n`;
        } else {
          content += `${vertex}:\n`;
        }
      }
    }

    return content;
  }

  printGraph(): void {
    console.log('Graph type:', this.graphType);
    console.log('Vertices:', this.getVertices());
    console.log('Edges:');
    for (const [from, neighbors] of this.adjList) {
      for (const [to, weight] of neighbors) {
        console.log(`  ${from} -> ${to} (${weight})`);
      }
    }
  }
}