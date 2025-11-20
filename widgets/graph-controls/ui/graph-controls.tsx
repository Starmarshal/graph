import React, { useState, useEffect } from 'react';
import { GraphData, Vertex, Edge } from '@/shared/types/grpah.interface';
import { GraphImportExport } from '@/features/graph-management/ui/graph-import-export';
import { VertexControls } from '@/features/vertex-management/ui/vertex-controls';
import { EdgeControls } from '@/features/edge-management/ui/edge-controls';
import { ShortestPathControl } from '@/features/graph-analysis/ui/shortest-path-control';
import { DistancesControl } from '@/features/graph-analysis/ui/distances-control';
import { MSTControl } from '@/features/graph-analysis/ui/mst-control';
import { ConnectivityControl } from '@/features/graph-analysis/ui/connectivity-control';
import { GraphInfoControl } from '@/features/graph-analysis/ui/graph-info-control';

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
  onAddVertex: (id: number) => void;
  onRemoveVertex: (vertexId: number) => void;
  onAddEdge: (from: number, to: number, weight: number) => void;
  onRemoveEdge: (from: number, to: number) => void;
  isMobile?: boolean;
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
                                                                          onEdgesList,
                                                                          onAddVertex,
                                                                          onRemoveVertex,
                                                                          onAddEdge,
                                                                          onRemoveEdge,
                                                                          isMobile = false
                                                                        }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'analysis'>('basic');

  // На мобильных автоматически переключаем на анализ при наличии результатов
  useEffect(() => {
    if (isMobile && (verticesList || edgesList)) {
      setActiveTab('analysis');
    }
  }, [verticesList, edgesList, isMobile]);

  const { Graph } = require('@/entities/graph/model/graph');

  const handleFindShortestPath = (start: number, end: number): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);

    try {
      const result = graph.shortestPath(start, end);
      onShortestPath(result);
      if (isMobile) setActiveTab('analysis');
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
      if (isMobile) setActiveTab('analysis');
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
      if (isMobile) setActiveTab('analysis');
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
      if (isMobile) setActiveTab('analysis');
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const handleListVertices = (): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);
    const vertices = graph.getVertices();
    onVerticesList({ vertices });
    if (isMobile) setActiveTab('analysis');
  };

  const handleListEdges = (): void => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);
    const edges = graph.listOfEdges();
    onEdgesList({ edges });
    if (isMobile) setActiveTab('analysis');
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

    const blob = new Blob([content], { type: 'text/plain' });
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

  // Мобильный интерфейс с табами
  if (isMobile) {
    return (
      <div style={{
        position: 'sticky',
        top: '0',
        backgroundColor: '#ffffff',
        border: '1px solid #e1e5e9',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        marginBottom: '16px'
      }}>
        {/* Табы для мобильных - только 2 вкладки */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #f0f2f5'
        }}>
          {[
            { id: 'basic' as const, label: 'Управление' },
            { id: 'analysis' as const, label: 'Анализ' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 8px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#007bff' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Контент табов */}
        <div style={{
          padding: '16px',
          maxHeight: '50vh',
          overflowY: 'auto'
        }}>
          {activeTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <GraphImportExport
                graphData={graphData}
                onImport={handleImportGraph}
                onExport={handleExportGraph}
              />

              <VertexControls
                vertices={graphData.vertices}
                onAddVertex={onAddVertex}
                onRemoveVertex={onRemoveVertex}
              />

              <EdgeControls
                edges={graphData.edges}
                vertices={graphData.vertices}
                onAddEdge={onAddEdge}
                onRemoveEdge={onRemoveEdge}
              />

            </div>
          )}

          {activeTab === 'analysis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

              <MSTControl onFindMST={handleFindMST} />

              <ConnectivityControl
                graphType={graphData.type}
                onCheckConnectivity={handleCheckConnectivity}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Десктопный интерфейс
  return (
    <div style={{
      position: 'sticky',
      top: '24px',
      padding: '24px',
      border: '1px solid #e1e5e9',
      borderRadius: '12px',
      maxHeight: '80vh',
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
        onAddVertex={onAddVertex}
        onRemoveVertex={onRemoveVertex}
      />

      <EdgeControls
        edges={graphData.edges}
        vertices={graphData.vertices}
        onAddEdge={onAddEdge}
        onRemoveEdge={onRemoveEdge}
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

      <MSTControl onFindMST={handleFindMST} />

      <ConnectivityControl
        graphType={graphData.type}
        onCheckConnectivity={handleCheckConnectivity}
      />
    </div>
  );
};