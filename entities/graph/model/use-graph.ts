import {useState, useCallback} from 'react';
import {
  GraphData,
  Vertex,
  Edge,
  ShortestPathResult,
  MSTResult,
  DistanceResult,
  ConnectivityResult,
  VerticesListResult,
  EdgesListResult
} from '@/shared/types/grpah.interface';

const initialGraphData: GraphData = {
  vertices: [
    {id: 1, x: 200, y: 200},
    {id: 2, x: 400, y: 200},
    {id: 3, x: 300, y: 300},
    {id: 4, x: 200, y: 300},
    {id: 5, x: 400, y: 300}
  ],
  edges: [
    {from: 1, to: 2, weight: 2},
    {from: 1, to: 4, weight: 5},
    {from: 2, to: 3, weight: 3},
    {from: 3, to: 4, weight: 4},
    {from: 4, to: 5, weight: 5}
  ],
  type: 'undirected'
};

interface UseGraphProps {
  isMobile?: boolean;
}

export const useGraph = ({isMobile = false}: UseGraphProps = {}) => {
  const [graphData, setGraphData] = useState<GraphData>(initialGraphData);
  const [selectedVertices, setSelectedVertices] = useState<number[]>([]);
  const [shortestPath, setShortestPath] = useState<ShortestPathResult | null>(null);
  const [mst, setMST] = useState<MSTResult | null>(null);
  const [distances, setDistances] = useState<DistanceResult | null>(null);
  const [connectivity, setConnectivity] = useState<ConnectivityResult | null>(null);
  const [verticesList, setVerticesList] = useState<VerticesListResult | null>(null);
  const [edgesList, setEdgesList] = useState<EdgesListResult | null>(null);

  const handleGraphUpdate = useCallback((newData: GraphData) => {
    setGraphData(newData);
    setSelectedVertices([]);
    clearResults();
  }, []);

  const handleVertexSelect = useCallback((vertexId: number) => {
    setSelectedVertices(prev =>
      prev.includes(vertexId)
        ? prev.filter(id => id !== vertexId)
        : [...prev, vertexId]
    );
  }, []);

  const handleVertexMove = useCallback((vertexId: number, x: number, y: number) => {
    setGraphData(prev => ({
      ...prev,
      vertices: prev.vertices.map(v =>
        v.id === vertexId ? {...v, x, y} : v
      )
    }));
  }, []);

  const clearResults = useCallback(() => {
    setShortestPath(null);
    setMST(null);
    setDistances(null);
    setConnectivity(null);
    setVerticesList(null);
    setEdgesList(null);
  }, []);

  const toggleGraphType = useCallback(() => {
    const newType = graphData.type === 'undirected' ? 'directed' : 'undirected';
    const newGraphData: GraphData = {
      vertices: [...graphData.vertices],
      edges: [...graphData.edges],
      type: newType
    };
    setGraphData(newGraphData);
    clearResults();
  }, [graphData, clearResults]);

  const createEmptyGraph = useCallback(() => {
    const newData: GraphData = {
      vertices: [],
      edges: [],
      type: graphData.type
    };
    setGraphData(newData);
    clearResults();
  }, [graphData.type, clearResults]);

  const exportGraph = useCallback(() => {
    const {Graph} = require('./graph');
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);
    const content = graph.exportToFile();

    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `graph_${graphData.type}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [graphData]);

  const handleAddVertex = useCallback((id: number) => {
    // Для десктопа используем динамические координаты, для мобильных - фиксированные
    const isMobile = false; // Здесь нужно получить isMobile из пропсов или контекста

    let x: number, y: number;

    if (isMobile) {
      // На мобильных - фиксированная рабочая область 600x400
      x = Math.random() * 500 + 50; // 50-550
      y = Math.random() * 300 + 50; // 50-350
    } else {
      // На десктопе - используем текущий размер канваса
      // В реальном приложении нужно получить размер канваса из состояния
      const canvasWidth = 800; // Это должно быть динамическим
      const canvasHeight = 600; // Это должно быть динамическим
      x = Math.random() * (canvasWidth - 100) + 50;
      y = Math.random() * (canvasHeight - 100) + 50;
    }

    const newVertex: Vertex = {
      id,
      x,
      y
    };

    const newData: GraphData = {
      ...graphData,
      vertices: [...graphData.vertices, newVertex]
    };

    setGraphData(newData);
  }, [graphData]);

  const handleRemoveVertex = useCallback((vertexId: number) => {
    const newData: GraphData = {
      ...graphData,
      vertices: graphData.vertices.filter((v: Vertex) => v.id !== vertexId),
      edges: graphData.edges.filter((e: Edge) => e.from !== vertexId && e.to !== vertexId)
    };

    setGraphData(newData);
    clearResults();
  }, [graphData, clearResults]);

  const handleAddEdge = useCallback((from: number, to: number, weight: number) => {
    const newEdge: Edge = {from, to, weight};
    const edgeExists = graphData.edges.some((e: Edge) =>
      (e.from === from && e.to === to) || (graphData.type === 'undirected' && e.from === to && e.to === from)
    );

    if (edgeExists) {
      alert('Ребро уже существует!');
      return;
    }

    const newData: GraphData = {
      ...graphData,
      edges: [...graphData.edges, newEdge]
    };

    setGraphData(newData);
  }, [graphData]);

  const handleRemoveEdge = useCallback((from: number, to: number) => {
    const newData: GraphData = {
      ...graphData,
      edges: graphData.edges.filter((e: Edge) => !(e.from === from && e.to === to))
    };

    setGraphData(newData);
    clearResults();
  }, [graphData, clearResults]);

  return {
    graphData,
    selectedVertices,
    shortestPath,
    mst,
    distances,
    connectivity,
    verticesList,
    edgesList,
    setShortestPath,
    setMST,
    setDistances,
    setConnectivity,
    setVerticesList,
    setEdgesList,
    handleGraphUpdate,
    handleVertexSelect,
    handleVertexMove,
    handleAddVertex,
    handleRemoveVertex,
    handleAddEdge,
    handleRemoveEdge,
    clearResults,
    toggleGraphType,
    createEmptyGraph,
    exportGraph
  };
};