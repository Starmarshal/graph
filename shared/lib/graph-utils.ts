import {GraphData, Vertex, Edge, GraphType} from '@/shared/types/grpah.interface';

export const createEmptyGraph = (type: GraphType = 'undirected'): GraphData => ({
  vertices: [],
  edges: [],
  type
});

export const generateRandomGraph = (
  vertexCount: number,
  edgeProbability: number = 0.3,
  type: GraphType = 'undirected'
): GraphData => {
  const vertices: Vertex[] = [];
  const edges: Edge[] = [];

  // Создаем вершины
  for (let i = 1; i <= vertexCount; i++) {
    vertices.push({
      id: i,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100
    });
  }

  // Создаем рёбра
  for (let i = 1; i <= vertexCount; i++) {
    for (let j = i + 1; j <= vertexCount; j++) {
      if (Math.random() < edgeProbability) {
        const weight = Math.floor(Math.random() * 10) + 1;
        edges.push({from: i, to: j, weight});

        // Для неориентированного графа добавляем обратное ребро
        if (type === 'undirected') {
          edges.push({from: j, to: i, weight});
        }
      }
    }
  }

  return {vertices, edges, type};
};

export const validateGraph = (graphData: GraphData): string[] => {
  const errors: string[] = [];

  // Проверка уникальности ID вершин
  const vertexIds = graphData.vertices.map(v => v.id);
  const uniqueVertexIds = new Set(vertexIds);
  if (vertexIds.length !== uniqueVertexIds.size) {
    errors.push('Найдены вершины с одинаковыми ID');
  }

  // Проверка координат вершин
  graphData.vertices.forEach(vertex => {
    if (vertex.x < 0 || vertex.y < 0) {
      errors.push(`Вершина ${vertex.id} имеет отрицательные координаты`);
    }
  });

  // Проверка существования вершин для рёбер
  graphData.edges.forEach(edge => {
    if (!graphData.vertices.find(v => v.id === edge.from)) {
      errors.push(`Ребро ссылается на несуществующую вершину ${edge.from}`);
    }
    if (!graphData.vertices.find(v => v.id === edge.to)) {
      errors.push(`Ребро ссылается на несуществующую вершину ${edge.to}`);
    }
  });

  // Проверка весов рёбер
  graphData.edges.forEach(edge => {
    if (edge.weight <= 0) {
      errors.push(`Ребро ${edge.from}-${edge.to} имеет неположительный вес`);
    }
  });

  return errors;
};

export const calculateGraphStatistics = (graphData: GraphData) => {
  const vertexCount = graphData.vertices.length;
  const edgeCount = graphData.edges.length;

  // Для неориентированного графа считаем уникальные рёбра
  const uniqueEdges = graphData.type === 'undirected'
    ? new Set(
      graphData.edges.map(edge =>
        [Math.min(edge.from, edge.to), Math.max(edge.from, edge.to)].join('-')
      )
    ).size
    : edgeCount;

  const totalWeight = graphData.edges.reduce((sum, edge) => sum + edge.weight, 0);
  const averageWeight = edgeCount > 0 ? totalWeight / edgeCount : 0;

  return {
    vertexCount,
    edgeCount,
    uniqueEdges,
    totalWeight,
    averageWeight,
    density: vertexCount > 1
      ? (uniqueEdges * 2) / (vertexCount * (vertexCount - 1))
      : 0
  };
};