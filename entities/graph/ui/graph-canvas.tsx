import React, { useRef, useEffect, useState } from 'react';
import { GraphData, Edge, Vertex, ShortestPathResult, MSTResult } from '@/shared/types/graph.interface';

interface GraphCanvasProps {
  graphData: GraphData;
  selectedVertices: number[];
  shortestPath: ShortestPathResult | null;
  mst: MSTResult | null;
  onVertexSelect: (vertexId: number) => void;
  onVertexMove: (vertexId: number, x: number, y: number) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
                                                          graphData,
                                                          selectedVertices,
                                                          shortestPath,
                                                          mst,
                                                          onVertexSelect,
                                                          onVertexMove
                                                        }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const updateCanvasSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      let newWidth = Math.min(containerWidth - 40, 1200);
      newWidth = Math.max(newWidth, 400);
      const newHeight = Math.round(newWidth * 0.75);
      setCanvasSize({ width: newWidth, height: newHeight });
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
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#fafbfc';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 0.5;
    const gridSize = 20;

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

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(textX, textY, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = 'bold 12px system-ui';
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
    ctx.font = 'bold 14px system-ui';
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
    drawGrid(ctx, canvas.width, canvas.height);

    graphData.edges.forEach(edge => {
      const fromVertex = graphData.vertices.find(v => v.id === edge.from);
      const toVertex = graphData.vertices.find(v => v.id === edge.to);

      if (!fromVertex || !toVertex) return;
      drawEdge(ctx, fromVertex, toVertex, edge, graphData.type);
    });

    graphData.vertices.forEach(vertex => {
      drawVertex(ctx, vertex);
    });

  }, [graphData, selectedVertices, shortestPath, mst, canvasSize]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    for (const vertex of graphData.vertices) {
      const distance = Math.sqrt((x - vertex.x) ** 2 + (y - vertex.y) ** 2);
      if (distance <= 25) {
        onVertexSelect(vertex.id);
        setIsDragging(vertex.id);
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const boundedX = Math.max(25, Math.min(canvas.width - 25, x));
    const boundedY = Math.max(25, Math.min(canvas.height - 25, y));

    onVertexMove(isDragging, boundedX, boundedY);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e1e5e9',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        width: '100%'
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            cursor: isDragging ? 'grabbing' : 'default',
            backgroundColor: '#fafbfc',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
            display: 'block',
            maxWidth: '100%',
            height: 'auto'
          }}
        />

        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            padding: '8px 16px',
            backgroundColor: graphData.type === 'undirected' ? '#e8f5e8' : '#fff3e0',
            color: graphData.type === 'undirected' ? '#2e7d32' : '#e65100',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            border: graphData.type === 'undirected' ? '1px solid #c8e6c9' : '1px solid #ffcc80',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(4px)'
          }}>
            {graphData.type === 'undirected' ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12h8M12 16V8M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z"/>
                </svg>
                Неориентированный
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2-8l4-4m0 4l-4-4"/>
                </svg>
                Ориентированный
              </>
            )}
          </div>

          {isDragging && (
            <div style={{
              padding: '6px 12px',
              backgroundColor: '#e3f2fd',
              color: '#1565c0',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              border: '1px solid #bbdefb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(4px)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
              Перетаскивание
            </div>
          )}
        </div>

        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #e1e5e9',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(8px)',
          minWidth: '140px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#333',
            marginBottom: '12px',
            fontWeight: '600',
            borderBottom: '2px solid #f0f2f5',
            paddingBottom: '8px'
          }}>
            Статистика графа
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '13px'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: '#666'}}>Вершины:</span>
              <span style={{fontWeight: '600', color: '#007bff'}}>{graphData.vertices.length}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{color: '#666'}}>Рёбра:</span>
              <span style={{fontWeight: '600', color: '#28a745'}}>{graphData.edges.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: '16px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h5 style={{
          margin: '0 0 12px 0',
          color: '#333',
          fontSize: '14px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Легенда графа
        </h5>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {[
            {color: '#6c757d', label: 'Обычная вершина', type: 'node'},
            {color: '#007bff', label: 'Выбранная вершина', type: 'node'},
            {color: '#dc3545', label: 'Кратчайший путь', type: 'node'},
            {color: '#28a745', label: 'MST ребро', type: 'edge'},
            {color: '#6c757d', label: 'Обычное ребро', type: 'line'},
            {color: '#6c757d', label: 'Ориентированное ребро', type: 'arrow'}
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '20px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              {item.type === 'node' && (
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: item.color,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                  }}
                />
              )}
              {item.type === 'arrow' && (
                <svg width="20" height="12" viewBox="0 0 20 12">
                  <defs>
                    <marker id={`arrowhead-${index}`} markerWidth="10" markerHeight="7"
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill={item.color}/>
                    </marker>
                  </defs>
                  <line x1="2" y1="6" x2="16" y2="6"
                        stroke={item.color} strokeWidth="2"
                        markerEnd={`url(#arrowhead-${index})`}/>
                </svg>
              )}
              {item.type === 'line' && (
                <div style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: item.color,
                  borderRadius: '1px'
                }}/>
              )}
              {item.type === 'edge' && (
                <div style={{
                  width: '20px',
                  height: '3px',
                  backgroundColor: item.color,
                  borderRadius: '2px'
                }}/>
              )}
              <span style={{
                fontSize: '13px',
                color: '#495057',
                fontWeight: '500'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};