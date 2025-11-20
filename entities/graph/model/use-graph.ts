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
import {Graph} from './graph';

const initialGraphData: GraphData = {
  vertices: [
    {id: 1, x: 200, y: 200},
    {id: 2, x: 400, y: 200},
    {id: 3, x: 300, y: 350},
    {id: 4, x: 200, y: 350},
    {id: 5, x: 400, y: 350}
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

export const useGraph = () => {
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
    clearResults,
    toggleGraphType,
    createEmptyGraph,
    exportGraph
  };
};