'use client';

import React from 'react';
import {GraphVisualizerWidget} from '@/widgets/graph-visualizer/ui/graph-visualizer';
import {GraphControlsWidget} from '@/widgets/graph-controls/ui/graph-controls';
import {AnalysisResultsWidget} from '@/widgets/analysis-results/ui/analysis-results';
import {useGraph} from '@/entities/graph/model/use-graph';

const Home: React.FC = () => {
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
    toggleGraphType,
    createEmptyGraph,
    exportGraph
  } = useGraph();

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.backgroundColor = '#f7fafc';
    target.style.borderColor = '#cbd5e0';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.backgroundColor = 'white';
    target.style.borderColor = '#e2e8f0';
  };

  const handleExportButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.backgroundColor = '#38a169';
  };

  const handleExportButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.backgroundColor = '#48bb78';
  };

  return (
    <div style={{
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Заголовок */}
      <header style={{
        marginBottom: '24px',
        padding: '24px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              color: '#1a202c',
              marginBottom: '8px',
              fontSize: '28px',
              fontWeight: '700'
            }}>
              Визуализатор графов
            </h1>
            <p style={{
              color: '#718096',
              marginBottom: '0',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              Создавайте и анализируйте графы с помощью алгоритмов Беллмана-Форда и Краскала
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
          </div>
        </div>

        <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
          <button
            onClick={toggleGraphType}
            style={{
              padding: '10px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#4a5568',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
            </svg>
            Переключить тип
          </button>

          <button
            onClick={createEmptyGraph}
            style={{
              padding: '10px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#4a5568',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Новый граф
          </button>

          <button
            onClick={exportGraph}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#48bb78',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={handleExportButtonMouseEnter}
            onMouseLeave={handleExportButtonMouseLeave}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Экспорт
          </button>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Основная область с визуализацией и результатами */}
        <div>
          <GraphVisualizerWidget
            graphData={graphData}
            selectedVertices={selectedVertices}
            shortestPath={shortestPath}
            mst={mst}
            onVertexSelect={handleVertexSelect}
            onVertexMove={handleVertexMove}
          />

          <AnalysisResultsWidget
            shortestPath={shortestPath}
            mst={mst}
            distances={distances}
            connectivity={connectivity}
            verticesList={verticesList}
            edgesList={edgesList}
            graphType={graphData.type}
          />
        </div>

        {/* Панель управления */}
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
        />
      </div>
    </div>
  );
};

export default Home;