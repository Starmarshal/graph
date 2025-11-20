'use client';

import GraphVisualizer from '@/components/GraphVisualizer';
import GraphControls from '@/components/GraphControls';
import {
  GraphData,
  ShortestPathResult,
  MSTResult,
  DistanceResult,
  ConnectivityResult
} from '@/shared/types/grpah.interface';
import {useState} from 'react';

interface VerticesListResult {
  vertices: number[];
}

interface EdgesListResult {
  edges: { from: number; to: number; weight: number }[];
}

const Home: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>({
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
  });

  const [selectedVertices, setSelectedVertices] = useState<number[]>([]);
  const [shortestPath, setShortestPath] = useState<ShortestPathResult | null>(null);
  const [mst, setMST] = useState<MSTResult | null>(null);
  const [distances, setDistances] = useState<DistanceResult | null>(null);
  const [connectivity, setConnectivity] = useState<ConnectivityResult | null>(null);
  const [verticesList, setVerticesList] = useState<VerticesListResult | null>(null);
  const [edgesList, setEdgesList] = useState<EdgesListResult | null>(null);

  const handleGraphUpdate = (newData: GraphData) => {
    setGraphData(newData);
    setSelectedVertices([]);
    clearResults();
  };

  const handleVertexSelect = (vertexId: number) => {
    setSelectedVertices(prev =>
      prev.includes(vertexId)
        ? prev.filter(id => id !== vertexId)
        : [...prev, vertexId]
    );
  };

  const handleVertexMove = (vertexId: number, x: number, y: number) => {
    setGraphData(prev => ({
      ...prev,
      vertices: prev.vertices.map(v =>
        v.id === vertexId ? {...v, x, y} : v
      )
    }));
  };

  const clearResults = () => {
    setShortestPath(null);
    setMST(null);
    setDistances(null);
    setConnectivity(null);
    setVerticesList(null);
    setEdgesList(null);
  };

  const toggleGraphType = () => {
    const newType = graphData.type === 'undirected' ? 'directed' : 'undirected';

    /* При смене типа нужно пересоздать граф с правильными рёбрами */
    const newGraphData: GraphData = {
      vertices: [...graphData.vertices],
      edges: [...graphData.edges],
      type: newType
    };

    setGraphData(newGraphData);
    clearResults();
  };

  const createEmptyGraph = () => {
    const newData: GraphData = {
      vertices: [],
      edges: [],
      type: graphData.type
    };
    setGraphData(newData);
    clearResults();
  };

  const exportGraph = () => {
    /* Создаем временный граф для экспорта */
    const {Graph} = require('@/features/graph');
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
  };

  // Исправленные обработчики событий
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
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginBottom: '24px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden'
          }}>
            <GraphVisualizer
              graphData={graphData}
              selectedVertices={selectedVertices}
              shortestPath={shortestPath}
              mst={mst}
              onVertexSelect={handleVertexSelect}
              onVertexMove={handleVertexMove}
            />
          </div>

          {/* Результаты анализа */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {/* Компонент списка вершин */}
            {verticesList && (
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #bee3f8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  color: '#2b6cb0',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#4299e1',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  Список вершин
                </h3>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {verticesList.vertices.map(vertexId => (
                    <div
                      key={vertexId}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#ebf8ff',
                        borderRadius: '8px',
                        border: '1px solid #bee3f8',
                        textAlign: 'center',
                        minWidth: '50px'
                      }}
                    >
                      <div style={{fontWeight: '600', color: '#2b6cb0', fontSize: '14px'}}>
                        Вершина
                      </div>
                      <div style={{fontSize: '16px', fontWeight: '700', color: '#2c5282'}}>
                        {vertexId}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Компонент списка рёбер */}
            {edgesList && (
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #c6f6d5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  color: '#276749',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#48bb78',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  Список рёбер
                </h3>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {edgesList.edges.map((edge, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '10px 14px',
                        backgroundColor: '#f0fff4',
                        borderRadius: '8px',
                        border: '1px solid #9ae6b4',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{fontWeight: '600', color: '#276749', fontSize: '14px'}}>
                        {edge.from} → {edge.to}
                      </div>
                      <div style={{fontSize: '12px', color: '#38a169', marginTop: '4px'}}>
                        вес: {edge.weight}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {shortestPath && shortestPath.path.length > 0 && (
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #fed7d7',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  color: '#c53030',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#f56565',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  Кратчайший путь
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center'}}>
                  <strong style={{color: '#4a5568'}}>Путь:</strong>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#fff5f5',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontWeight: '500',
                    color: '#c53030'
                  }}>
                    {shortestPath.path.join(' → ')}
                  </div>

                  <strong style={{color: '#4a5568'}}>Длина:</strong>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#fff5f5',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    color: '#c53030',
                    fontSize: '16px'
                  }}>
                    {shortestPath.distance}
                  </div>
                </div>
              </div>
            )}

            {shortestPath && shortestPath.path.length === 0 && shortestPath.distance === Infinity && (
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #fed7d7',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{margin: '0 0 12px 0', color: '#c53030', fontSize: '18px', fontWeight: '600'}}>
                  Кратчайший путь не найден
                </h3>
                <p style={{color: '#718096', margin: 0}}>Между выбранными вершинами нет пути</p>
              </div>
            )}

            {mst && mst.edges.length > 0 && (
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #c6f6d5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  color: '#276749',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#48bb78',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  Минимальное остовное дерево
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '12px', alignItems: 'center'}}>
                  <strong style={{color: '#4a5568'}}>Общий вес:</strong>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#f0fff4',
                    borderRadius: '6px',
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    color: '#276749',
                    fontSize: '16px'
                  }}>
                    {mst.totalWeight}
                  </div>

                  <strong style={{color: '#4a5568', alignSelf: 'start'}}>Рёбра:</strong>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px'}}>
                    {mst.edges.map((edge, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#f0fff4',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: '#276749',
                          border: '1px solid #9ae6b4'
                        }}
                      >
                        {edge.from}—{edge.to}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {distances && (
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #feebc8',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  color: '#744210',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#ed8936',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  Расстояния от вершины {distances.fromVertex}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '12px'
                }}>
                  {Array.from(distances.distances.entries()).map(([vertex, distance]) => (
                    <div
                      key={vertex}
                      style={{
                        padding: '12px',
                        backgroundColor: '#fffaf0',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '1px solid #fed7aa'
                      }}
                    >
                      <div style={{fontWeight: '600', fontSize: '14px', marginBottom: '6px', color: '#744210'}}>
                        Вершина {vertex}
                      </div>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: distance === Infinity ? '#e53e3e' : '#d69e2e'
                      }}>
                        {distance === Infinity ? '∞' : distance}
                      </div>
                      {distance === Infinity && (
                        <div style={{fontSize: '11px', color: '#a0aec0', marginTop: '4px'}}>
                          недостижима
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {connectivity && (
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #e9d8fd',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  color: '#553c9a',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#9f7aea',
                    borderRadius: '50%',
                    flexShrink: 0
                  }}></div>
                  Связность графа
                </h3>

                <div style={{
                  padding: '16px',
                  backgroundColor: connectivity.isConnected ? '#f0fff4' : '#fff5f5',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: `2px solid ${connectivity.isConnected ? '#9ae6b4' : '#fc8181'}`
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: connectivity.isConnected ? '#276749' : '#c53030',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {connectivity.isConnected ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    )}
                    {connectivity.isConnected
                      ? 'Граф связный'
                      : graphData.type === 'undirected'
                        ? 'Граф не связный'
                        : 'Граф не слабо связный'
                    }
                  </div>
                </div>

                {connectivity.components.length > 0 && (
                  <div>
                    <h4 style={{margin: '0 0 12px 0', color: '#553c9a', fontSize: '16px', fontWeight: '600'}}>
                      Компоненты {graphData.type === 'undirected' ? 'связности' : 'слабой связности'}:
                    </h4>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                      {connectivity.components.map((component, index) => (
                        <div
                          key={index}
                          style={{
                            padding: '12px 16px',
                            backgroundColor: '#faf5ff',
                            borderRadius: '12px',
                            border: '1px solid #d6bcfa',
                            minWidth: '120px'
                          }}
                        >
                          <div style={{
                            fontSize: '12px',
                            color: '#9f7aea',
                            marginBottom: '6px',
                            fontWeight: '500'
                          }}>
                            Компонента {index + 1}
                          </div>
                          <div style={{fontWeight: '600', color: '#553c9a', fontSize: '14px'}}>
                            {component.join(', ')}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#a0aec0',
                            marginTop: '4px'
                          }}>
                            {component.length} вершин
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Панель управления */}
        <div style={{
          position: 'sticky',
          top: '24px'
        }}>
          <GraphControls
            graphData={graphData}
            onGraphUpdate={handleGraphUpdate}
            onShortestPath={setShortestPath}
            onMST={setMST}
            onDistances={setDistances}
            onConnectivity={setConnectivity}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;