'use client';

import React, {useState, useEffect} from 'react';
import {GraphVisualizerWidget} from '@/widgets/graph-visualizer/ui/graph-visualizer';
import {GraphControlsWidget} from '@/widgets/graph-controls/ui/graph-controls';
import {AnalysisResultsWidget} from '@/widgets/analysis-results/ui/analysis-results';
import {useGraph} from '@/entities/graph/model/use-graph';
import Button from '@/shared/ui/Button';

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
  } = useGraph({isMobile});

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

  return (
    <div className={`
        ${isMobile ? 'p-3' : 'p-6'} 
        font-sans 
        min-h-screen 
        bg-slate-50
      `}
    >
      <header className={`
          ${isMobile ? 'mb-4 p-4 rounded-lg' : 'mb-6 p-6 rounded-xl'}
          bg-white
          shadow-sm
          border border-slate-200
        `}
      >
        <div
          className={`
            flex
            justify-between
            items-start
            flex-wrap
            ${isMobile ? 'flex-col mb-4 gap-3' : 'flex-row mb-5 gap-4'}
          `}
        >
          <div className="flex-1">
            <h1 className={`
                text-gray-900
                ${isMobile ? 'mb-1.5 text-xl' : 'mb-2 text-2xl'}
                font-bold
                leading-tight
              `}
            >
              Визуализатор графов
            </h1>
            <p className={`
                text-gray-600
                mb-0
                ${isMobile ? 'text-xs' : 'text-base'}
                leading-relaxed
              `}
            >
              Создавайте и анализируйте графы с помощью алгоритмов Беллмана-Форда и Краскала
            </p>
          </div>
        </div>

        <div
          className={`
            flex
            flex-wrap
            ${isMobile ? 'justify-center gap-2' : 'justify-start gap-3'}
          `}
        >
          <Button
            onClick={toggleGraphType}
            className={`
              hover:!translate-y-0
              ${isMobile ? '!px-4 !py-2' : '!px-5 !py-2.5'}
              !border !border-slate-200 !border-solid
              !rounded-md
              !bg-white
              !text-slate-600
              ${isMobile ? '!text-xs' : '!text-sm'}
              flex items-center
              gap-1.5
              ${isMobile ? '!flex-1' : '!flex-none'}
              ${isMobile ? '!min-w-auto' : '!min-w-[140px]'}
              focus:!outline-none focus:!ring-0 focus:!ring-opacity-0
              hover:!bg-slate-50
            `}
          >
            <svg width={isMobile ? '14' : '16'} height={isMobile ? '14' : '16'} viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
            </svg>
            {isMobile ? 'Тип' : 'Переключить тип'}
          </Button>

          <Button
            onClick={createEmptyGraph}
            className={`
              hover:!translate-y-0
              ${isMobile ? '!px-4 !py-2' : '!px-5 !py-2.5'}
              !border !border-slate-200 !border-solid
              !rounded-md
              !bg-white
              !text-slate-600
              ${isMobile ? '!text-xs' : '!text-sm'}
              flex items-center
              gap-1.5
              ${isMobile ? '!flex-1' : '!flex-none'}
              ${isMobile ? '!min-w-auto' : '!min-w-[120px]'}
              focus:!outline-none focus:!ring-0 focus:!ring-opacity-0
              hover:!bg-slate-50
            `}
          >
            <svg width={isMobile ? '14' : '16'} height={isMobile ? '14' : '16'} viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            {isMobile ? 'Новый' : 'Новый граф'}
          </Button>

          <Button
            onClick={exportGraph}
            className={`
              hover:!translate-y-0
              ${isMobile ? '!px-4 !py-2' : '!px-5 !py-2.5'}
              !border !border-slate-200 !border-solid
              !rounded-md
              bg-green-600 
              ${isMobile ? '!text-xs' : '!text-sm'}
              flex items-center
              gap-1.5
              ${isMobile ? '!flex-1' : '!flex-none'}
              ${isMobile ? '!min-w-auto' : '!min-w-[100px]'}
              focus:!outline-none focus:!ring-0 focus:!ring-opacity-0
              hover:bg-green-700
            `}
          >
            <svg width={isMobile ? '14' : '16'} height={isMobile ? '14' : '16'} viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            {isMobile ? 'Экспорт' : 'Экспорт'}
          </Button>
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