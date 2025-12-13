import React, {useRef, useEffect, useState} from 'react';
import {
  GraphData,
  Edge,
  Vertex,
  ShortestPathResult,
  MSTResult
} from '@/shared/types/grpah.interface';

interface GraphCanvasProps {
  graphData: GraphData;
  selectedVertices: number[];
  shortestPath: ShortestPathResult | null;
  mst: MSTResult | null;
  onVertexSelect: (vertexId: number) => void;
  onVertexMove: (vertexId: number, x: number, y: number) => void;
  isMobile?: boolean;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
                                                          graphData,
                                                          selectedVertices,
                                                          shortestPath,
                                                          mst,
                                                          onVertexSelect,
                                                          onVertexMove,
                                                          isMobile = false
                                                        }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({width: 800, height: 600});
  const [touchStart, setTouchStart] = useState<{
    x: number;
    y: number
  } | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [isDark, setIsDark] = useState<boolean>(false);

  // Слежение за системной/приложенческой темой для канваса
  useEffect(() => {
    const getTheme = () =>
      typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'dark';

    // начальное состояние
    setIsDark(getTheme());

    // подписка на prefers-color-scheme и на возможные изменения атрибута
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMqlChange = () => setIsDark(getTheme() || mql.matches);

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleMqlChange);
    } else if (typeof mql.addListener === 'function') {
      mql.addListener(handleMqlChange as any);
    }

    const observer = new MutationObserver(() => setIsDark(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', handleMqlChange);
      } else if (typeof mql.removeListener === 'function') {
        mql.removeListener(handleMqlChange as any);
      }
      observer.disconnect();
    };
  }, []);

  // Размеры рабочей области
  const getWorkspaceSize = () => {
    if (isMobile) {
      return {width: 600, height: 400};
    } else {
      return {width: canvasSize.width, height: canvasSize.height};
    }
  };

  const updateCanvasSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;

      if (isMobile) {
        const newWidth = containerWidth - 16;
        const newHeight = Math.min(newWidth * 0.8, 400);
        setCanvasSize({width: newWidth, height: newHeight});

        const workspace = getWorkspaceSize();
        const scaleX = newWidth / workspace.width;
        const scaleY = newHeight / workspace.height;
        const calculatedScale = Math.min(scaleX, scaleY) * 0.95;

        setScale(calculatedScale);
        setOffset({
          x: (newWidth / calculatedScale - workspace.width) / 2,
          y: (newHeight / calculatedScale - workspace.height) / 2
        });
      } else {
        const newWidth = containerWidth - 40;
        const newHeight = Math.round(newWidth * 0.75);
        setCanvasSize({width: newWidth, height: newHeight});

        setScale(1);
        setOffset({x: 0, y: 0});
      }
    }
  };

  useEffect(() => {
    updateCanvasSize();

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [isMobile]);

  const applyTransform = (ctx: CanvasRenderingContext2D) => {
    if (isMobile) {
      ctx.scale(scale, scale);
      ctx.translate(offset.x, offset.y);
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Палитра для светлой/тёмной темы
    const gridBg = isDark ? '#0f172a' : '#fafbfc'; // slate-900 vs light bg
    const gridLine = isDark ? '#334155' : '#e9ecef'; // slate-700 vs light grid

    ctx.fillStyle = gridBg;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = gridLine;
    ctx.lineWidth = 0.5;

    const baseGridSize = 20;
    const gridSize = isMobile ? baseGridSize : baseGridSize;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string) => {
    const headLength = 15;
    const headAngle = Math.PI / 6;

    const dx = toX - fromX;
    const dy = toY - fromY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const radius = 25;
    const adjustedToX = toX - (dx / distance) * radius;
    const adjustedToY = toY - (dy / distance) * radius;
    const adjustedFromX = fromX + (dx / distance) * radius;
    const adjustedFromY = fromY + (dy / distance) * radius;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(adjustedFromX, adjustedFromY);
    ctx.lineTo(adjustedToX, adjustedToY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(adjustedToX, adjustedToY);
    ctx.lineTo(
      adjustedToX - headLength * Math.cos(angle - headAngle),
      adjustedToY - headLength * Math.sin(angle - headAngle)
    );
    ctx.lineTo(
      adjustedToX - headLength * Math.cos(angle + headAngle),
      adjustedToY - headLength * Math.sin(angle + headAngle)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawEdge = (ctx: CanvasRenderingContext2D, from: Vertex, to: Vertex, edge: Edge, graphType: string) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 25;

    const startX = from.x + (dx / distance) * radius;
    const startY = from.y + (dy / distance) * radius;
    const endX = to.x - (dx / distance) * radius;
    const endY = to.y - (dy / distance) * radius;

    const isInShortestPath = shortestPath && isEdgeInPath(edge, shortestPath.path);
    const isInMST = mst && mst.edges.some(e =>
      (e.from === edge.from && e.to === edge.to) ||
      (e.from === edge.to && e.to === edge.from)
    );

    let color = '#6c757d';
    let lineWidth = 2;

    if (isInShortestPath) {
      color = '#dc3545';
      lineWidth = 4;
    } else if (isInMST) {
      color = '#28a745';
      lineWidth = 4;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    if (graphType === 'directed') {
      drawArrow(ctx, startX, startY, endX, endY, color);
    }

    if (edge.weight !== undefined && edge.weight !== 1) {
      const textX = (startX + endX) / 2;
      const textY = (startY + endY) / 2;

      // Плашка веса ребра адаптируется к теме
      ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(textX, textY, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = `bold 12px system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.weight.toString(), textX, textY);
    }
  };

  const drawVertex = (ctx: CanvasRenderingContext2D, vertex: Vertex) => {
    const radius = 25;

    const isSelected = selectedVertices.includes(vertex.id);
    const isInShortestPath = shortestPath && shortestPath.path.includes(vertex.id);

    let baseColor = '#6c757d';
    if (isInShortestPath) baseColor = '#dc3545';
    else if (isSelected) baseColor = '#007bff';

    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 14px system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(vertex.id.toString(), vertex.x, vertex.y);
  };

  const isEdgeInPath = (edge: Edge, path: number[]): boolean => {
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === edge.from && path[i + 1] === edge.to) ||
        (path[i] === edge.to && path[i + 1] === edge.from)) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    applyTransform(ctx);

    const workspace = getWorkspaceSize();
    drawGrid(ctx, workspace.width, workspace.height);

    graphData.edges.forEach(edge => {
      const fromVertex = graphData.vertices.find(v => v.id === edge.from);
      const toVertex = graphData.vertices.find(v => v.id === edge.to);

      if (!fromVertex || !toVertex) return;
      drawEdge(ctx, fromVertex, toVertex, edge, graphData.type);
    });

    graphData.vertices.forEach(vertex => {
      drawVertex(ctx, vertex);
    });

    ctx.restore();

  }, [graphData, selectedVertices, shortestPath, mst, canvasSize, isMobile, scale, offset, isDark]);

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return {x: 0, y: 0};

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (isMobile) {
      return {
        x: x / scale - offset.x,
        y: y / scale - offset.y
      };
    }

    return {x, y};
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const {x, y} = getCanvasCoordinates(e.clientX, e.clientY);

    for (const vertex of graphData.vertices) {
      const distance = Math.sqrt((x - vertex.x) ** 2 + (y - vertex.y) ** 2);
      const radius = 25;
      if (distance <= radius) {
        onVertexSelect(vertex.id);
        setIsDragging(vertex.id);
        return;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const {x, y} = getCanvasCoordinates(e.clientX, e.clientY);
    const workspace = getWorkspaceSize();

    const boundedX = Math.max(25, Math.min(workspace.width - 25, x));
    const boundedY = Math.max(25, Math.min(workspace.height - 25, y));

    onVertexMove(isDragging, boundedX, boundedY);
  };

  const handlePointerUp = () => {
    setIsDragging(null);
  };

  // Простые обработчики для touch событий
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStart({x: touch.clientX, y: touch.clientY});
      handlePointerDown({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as React.PointerEvent<HTMLCanvasElement>);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      handlePointerMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
      } as React.PointerEvent<HTMLCanvasElement>);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    handlePointerUp();
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative p-5 bg-white rounded-xl shadow-sm border border-gray-200
        w-full max-w-full box-border overflow-hidden
        ${isMobile ? 'p-2 rounded-lg' : ''}
      `}
    >
      <div className="relative flex justify-center w-full">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          // Отключаем прокрутку только для канваса
          style={{
            touchAction: 'none' // Полностью отключает жесты браузера на элементе
          }}
          className={`
            border border-gray-200 bg-gray-50
            cursor-pointer block max-w-full h-auto
            shadow-inner
            ${isMobile ? 'rounded-md' : 'rounded-lg'}
            ${isDragging ? 'cursor-grabbing' : ''}
          `}
        />

        {!isMobile && (
          <div className="absolute top-4 left-4 bg-white/95 p-4 rounded-xl border border-gray-200 shadow-lg backdrop-blur-md min-w-[140px]">
            <div className="text-sm text-gray-800 mb-3 font-semibold border-b border-gray-100 pb-2">
              Статистика графа
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Вершины:</span>
                <span className="font-semibold text-blue-600">{graphData.vertices.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Рёбра:</span>
                <span className="font-semibold text-green-600">{graphData.edges.length}</span>
              </div>
            </div>
          </div>
        )}

        <div
          className={`
          absolute flex flex-col gap-2
          ${isMobile ? 'top-2 right-2' : 'top-4 right-4'}
        `}
        >
          <div
            className={`
            px-4 py-2 rounded-full font-semibold border shadow-sm
            flex items-center gap-1.5 backdrop-blur-sm
            ${graphData.type === 'undirected'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-orange-50 text-orange-800 border-orange-200'
            }
            ${isMobile ? 'text-xs px-3 py-1.5' : 'text-sm'}
          `}
          >
            {graphData.type === 'undirected' ? (
              <>
                <svg
                  width={isMobile ? '12' : '14'}
                  height={isMobile ? '12' : '14'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M8 12h8M12 16V8M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
                </svg>
                {!isMobile && 'Неориентированный'}
              </>
            ) : (
              <>
                <svg
                  width={isMobile ? '12' : '14'}
                  height={isMobile ? '12' : '14'}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2-8l4-4m0 4l-4-4" />
                </svg>
                {!isMobile && 'Ориентированный'}
              </>
            )}
          </div>

          {isDragging && (
            <div
              className={`
              px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-semibold 
              border border-blue-200 shadow-sm flex items-center gap-1.5 backdrop-blur-sm
              ${isMobile ? 'text-xs px-2 py-1' : 'text-sm'}
            `}
            >
              <svg
                width={isMobile ? '10' : '14'}
                height={isMobile ? '10' : '14'}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {!isMobile && 'Перетаскивание'}
            </div>
          )}
        </div>

        {isMobile && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 px-3 py-2 rounded-lg border border-gray-200 shadow-sm backdrop-blur-sm flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Вершин: {graphData.vertices.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Рёбер: {graphData.edges.length}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Легенда графа */}
      <div
        className={`
        mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200
        w-full box-border
        ${isMobile ? 'mt-3 p-3 rounded-md' : ''}
      `}
      >
        <h5
          className={`
          m-0 mb-2 text-gray-800 font-semibold text-center
          ${isMobile ? 'text-sm mb-1' : 'text-base'}
        `}
        >
          Легенда графа
        </h5>
        <div
          className={`
          flex gap-4 justify-center flex-wrap items-center min-h-10
          ${isMobile ? 'gap-3' : ''}
        `}
        >
          {[
            {color: '#6c757d', label: 'Обычная вершина', type: 'node'},
            ...(isMobile ? [] : [{
              color: '#007bff',
              label: 'Выбранная вершина',
              type: 'node'
            }]),
            {color: '#dc3545', label: 'Кратчайший путь', type: 'node'},
            {color: '#28a745', label: 'MST ребро', type: 'edge'},
            {color: '#6c757d', label: 'Обычное ребро', type: 'line'},
            ...(graphData.type === 'directed' ? [
              {color: '#6c757d', label: 'Ориентированное ребро', type: 'arrow'}
            ] : [])
          ].map((item, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 bg-white/70 rounded-full
                shadow-sm h-[30px]
                ${isMobile ? 'px-2 py-1 gap-1' : ''}
              `}
            >
              {item.type === 'node' && (
                <div
                  className={`
                    bg-${item.color.replace('#', '')} rounded-full border-2 border-white
                    shadow-sm flex-shrink-0
                    ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                  `}
                  style={{backgroundColor: item.color}}
                />
              )}
              {item.type === 'arrow' && (
                <svg
                  width={isMobile ? '20' : '24'}
                  height={isMobile ? '12' : '14'}
                  viewBox="0 0 20 12"
                >
                  <defs>
                    <marker
                      id={`arrowhead-${index}`}
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill={item.color}
                      />
                    </marker>
                  </defs>
                  <line
                    x1="2"
                    y1="6"
                    x2="16"
                    y2="6"
                    stroke={item.color}
                    strokeWidth="2"
                    markerEnd={`url(#arrowhead-${index})`}
                  />
                </svg>
              )}
              {item.type === 'line' && (
                <div
                  className={`flex-shrink-0 rounded-sm ${isMobile ? 'w-4 h-0.5' : 'w-5 h-1'}`}
                  style={{backgroundColor: item.color}}
                />
              )}
              {item.type === 'edge' && (
                <div
                  className={`flex-shrink-0 rounded-sm ${isMobile ? 'w-4 h-1' : 'w-5 h-1.5'}`}
                  style={{backgroundColor: item.color}}
                />
              )}
              <span
                className={`
                text-gray-700 font-medium whitespace-nowrap
                ${isMobile ? 'text-xs' : 'text-sm'}
              `}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};