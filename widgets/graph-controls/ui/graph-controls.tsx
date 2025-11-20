import React from 'react';
import {GraphData, Vertex, Edge} from '@/shared/types/graph.interface';
import {GraphImportExport} from '@/features/graph-management/ui/graph-import-export';
import {VertexControls} from '@/features/vertex-management/ui/vertex-controls';
import {EdgeControls} from '@/features/edge-management/ui/edge-controls';
import {ShortestPathControl} from '@/features/graph-analysis/ui/shortest-path-control';
import {DistancesControl} from '@/features/graph-analysis/ui/distances-control';
import {MSTControl} from '@/features/graph-analysis/ui/mst-control';
import {ConnectivityControl} from '@/features/graph-analysis/ui/connectivity-control';
import {GraphInfoControl} from '@/features/graph-analysis/ui/graph-info-control';

interface GraphControlsWidgetProps {
  graphData: GraphData;
  verticesList: any;
  edgesList: any;
  onGraphUpdate: (data: GraphData) => void;
  onShortestPath: (path: any) => void;
  onMST: (mst: any) => void;
  onDistances: (distances: any) => void;
  onConnectivity: (connectivity: any) => void;
  onVerticesList: (vertices: any) => void;
  onEdgesList: (edges: any) => void;
}

export const GraphControlsWidget: React.FC<GraphControlsWidgetProps> = ({
                                                                          graphData,
                                                                          verticesList,
                                                                          edgesList,
                                                                          onGraphUpdate,
                                                                          onShortestPath,
                                                                          onMST,
                                                                          onDistances,
                                                                          onConnectivity,
                                                                          onVerticesList,
                                                                          onEdgesList
                                                                        }) => {
  const {Graph} = require('@/entities/graph/model/graph');

  const handleAddVertex = (id: number): void => {
    const newVertex: Vertex = {
      id,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100
    };

    const newData: GraphData = {
      ...graphData,
      vertices: [...graphData.vertices, newVertex]
    };

    onGraphUpdate(newData);
  };

  const handleRemoveVertex = (vertexId: number): void => {
    const newData: GraphData = {
      ...graphData,
      vertices: graphData.vertices.filter((v: Vertex) => v.id !== vertexId),
      edges: graphData.edges.filter((e: Edge) => e.from !== vertexId && e.to !== vertexId)
    };

    onGraphUpdate(newData);
  };

  const handleAddEdge = (from: number, to: number, weight: number): void => {
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

    onGraphUpdate(newData);
  };

  const handleRemoveEdge = (from: number, to: number): void => {
    const newData: GraphData = {
      ...graphData,
      edges: graphData.edges.filter((e: Edge) => !(e.from === from && e.to === to))
    };

    onGraphUpdate(newData);
  };

  const handleFindShortestPath = (start: number, end: number): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);

    try {
      const result = graph.shortestPath(start, end);
      onShortestPath(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const handleFindDistances = (start: number): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);

    try {
      const result = graph.distancesFromVertex(start);
      onDistances(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const handleFindMST = (): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);

    try {
      const result = graph.kruskalMST();
      onMST(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const handleCheckConnectivity = (): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);

    try {
      const result = graphData.type === 'undirected'
        ? graph.isConnected()
        : graph.weakConnectedComponents();
      onConnectivity(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const handleListVertices = (): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);
    const vertices = graph.getVertices();
    onVerticesList({vertices});
  };

  const handleListEdges = (): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);
    const edges = graph.listOfEdges();
    onEdgesList({edges});
  };

  const handleToggleGraphType = (): void => {
    const newType = graphData.type === 'undirected' ? 'directed' : 'undirected';
    onGraphUpdate({
      ...graphData,
      type: newType
    });
  };

  const handleExportGraph = (): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);
    const content = graph.exportToFile();

    const blob = new Blob([content], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportGraph = (newData: GraphData): void => {
    onGraphUpdate(newData);
  };

  return (
    <div style={{
      position: 'sticky',
      top: '24px',
      padding: '24px',
      border: '1px solid #e1e5e9',
      borderRadius: '12px',
      maxHeight: '132vh',
      overflowY: 'auto',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h3 style={{
        marginTop: 0,
        marginBottom: '24px',
        color: '#1a1a1a',
        fontSize: '20px',
        fontWeight: '700',
        paddingBottom: '16px',
        borderBottom: '2px solid #f0f2f5'
      }}>
        Управление графом
      </h3>

      <GraphImportExport
        graphData={graphData}
        onImport={handleImportGraph}
        onExport={handleExportGraph}
      />

      <VertexControls
        vertices={graphData.vertices}
        onAddVertex={handleAddVertex}
        onRemoveVertex={handleRemoveVertex}
      />

      <EdgeControls
        edges={graphData.edges}
        vertices={graphData.vertices}
        onAddEdge={handleAddEdge}
        onRemoveEdge={handleRemoveEdge}
      />

      <GraphInfoControl
        onListVertices={handleListVertices}
        onListEdges={handleListEdges}
        verticesList={verticesList}
        edgesList={edgesList}
      />

      <ShortestPathControl
        vertices={graphData.vertices}
        onFindShortestPath={handleFindShortestPath}
      />

      <DistancesControl
        vertices={graphData.vertices}
        onFindDistances={handleFindDistances}
      />

      <MSTControl onFindMST={handleFindMST}/>

      <ConnectivityControl
        graphType={graphData.type}
        onCheckConnectivity={handleCheckConnectivity}
      />
    </div>
  );
};