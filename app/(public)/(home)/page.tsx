'use client';

import React, { useState, useEffect } from 'react';
import { GraphVisualizerWidget } from '@/widgets/graph-visualizer/ui/graph-visualizer';
import { GraphControlsWidget } from '@/widgets/graph-controls/ui/graph-controls';
import { AnalysisResultsWidget } from '@/widgets/analysis-results/ui/analysis-results';
import { useGraph } from '@/entities/graph/model/use-graph';

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const {
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
  } = useGraph({ isMobile });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobile) {
      const target = e.currentTarget as HTMLButtonElement;
      target.style.backgroundColor = '#f7fafc';
      target.style.borderColor = '#cbd5e0';
    }
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobile) {
      const target = e.currentTarget as HTMLButtonElement;
      target.style.backgroundColor = 'white';
      target.style.borderColor = '#e2e8f0';
    }
  };

  const handleExportButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobile) {
      const target = e.currentTarget as HTMLButtonElement;
      target.style.backgroundColor = '#38a169';
    }
  };

  const handleExportButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isMobile) {
      const target = e.currentTarget as HTMLButtonElement;
      target.style.backgroundColor = '#48bb78';
    }
  };

  return (
    <div style={{
      padding: isMobile ? '12px' : '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <header style={{
        marginBottom: isMobile ? '16px' : '24px',
        padding: isMobile ? '16px' : '24px',
        backgroundColor: 'white',
        borderRadius: isMobile ? '8px' : '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: isMobile ? '16px' : '20px',
          flexWrap: 'wrap',
          gap: isMobile ? '12px' : '16px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <div style={{ flex: 1 }}>
            <h1 style={{
              color: '#1a202c',
              marginBottom: isMobile ? '6px' : '8px',
              fontSize: isMobile ? '20px' : '28px',
              fontWeight: '700',
              lineHeight: 1.2
            }}>
              Визуализатор графов
            </h1>
            <p style={{
              color: '#718096',
              marginBottom: '0',
              fontSize: isMobile ? '13px' : '16px',
              lineHeight: '1.5'
            }}>
              Создавайте и анализируйте графы с помощью алгоритмов Беллмана-Форда и Краскала
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: isMobile ? '8px' : '12px',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          <button
            onClick={toggleGraphType}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#4a5568',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '12px' : '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flex: isMobile ? 1 : 'none',
              minWidth: isMobile ? 'auto' : '140px'
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
            </svg>
            {isMobile ? 'Тип' : 'Переключить тип'}
          </button>

          <button
            onClick={createEmptyGraph}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              backgroundColor: 'white',
              color: '#4a5568',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '12px' : '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flex: isMobile ? 1 : 'none',
              minWidth: isMobile ? 'auto' : '120px'
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {isMobile ? 'Новый' : 'Новый граф'}
          </button>

          <button
            onClick={exportGraph}
            style={{
              padding: isMobile ? '8px 16px' : '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#48bb78',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: isMobile ? '12px' : '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flex: isMobile ? 1 : 'none',
              minWidth: isMobile ? 'auto' : '100px'
            }}
            onMouseEnter={handleExportButtonMouseEnter}
            onMouseLeave={handleExportButtonMouseLeave}
          >
            <svg width={isMobile ? "14" : "16"} height={isMobile ? "14" : "16"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            {isMobile ? 'Экспорт' : 'Экспорт'}
          </button>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 400px',
        gap: isMobile ? '16px' : '24px',
        alignItems: 'start'
      }}>
        <div>
          <GraphVisualizerWidget
            graphData={graphData}
            selectedVertices={selectedVertices}
            shortestPath={shortestPath}
            mst={mst}
            onVertexSelect={handleVertexSelect}
            onVertexMove={handleVertexMove}
            isMobile={isMobile}
          />

          <AnalysisResultsWidget
            shortestPath={shortestPath}
            mst={mst}
            distances={distances}
            connectivity={connectivity}
            verticesList={verticesList}
            edgesList={edgesList}
            graphType={graphData.type}
            isMobile={isMobile}
          />
        </div>

        {!isMobile && (
          <GraphControlsWidget
            graphData={graphData}
            verticesList={verticesList}
            edgesList={edgesList}
            onGraphUpdate={handleGraphUpdate}
            onShortestPath={setShortestPath}
            onMST={setMST}
            onDistances={setDistances}
            onConnectivity={setConnectivity}
            onVerticesList={setVerticesList}
            onEdgesList={setEdgesList}
            onAddVertex={handleAddVertex}
            onRemoveVertex={handleRemoveVertex}
            onAddEdge={handleAddEdge}
            onRemoveEdge={handleRemoveEdge}
            isMobile={isMobile}
          />
        )}
      </div>

      {isMobile && (
        <GraphControlsWidget
          graphData={graphData}
          verticesList={verticesList}
          edgesList={edgesList}
          onGraphUpdate={handleGraphUpdate}
          onShortestPath={setShortestPath}
          onMST={setMST}
          onDistances={setDistances}
          onConnectivity={setConnectivity}
          onVerticesList={setVerticesList}
          onEdgesList={setEdgesList}
          onAddVertex={handleAddVertex}
          onRemoveVertex={handleRemoveVertex}
          onAddEdge={handleAddEdge}
          onRemoveEdge={handleRemoveEdge}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default Home;