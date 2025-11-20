import React from 'react';
import {
  ShortestPathResult,
  MSTResult,
  DistanceResult,
  ConnectivityResult,
  VerticesListResult,
  EdgesListResult
} from '@/shared/types/graph.interface';

interface AnalysisResultsWidgetProps {
  shortestPath: ShortestPathResult | null;
  mst: MSTResult | null;
  distances: DistanceResult | null;
  connectivity: ConnectivityResult | null;
  verticesList: VerticesListResult | null;
  edgesList: EdgesListResult | null;
  graphType: 'undirected' | 'directed';
}

export const AnalysisResultsWidget: React.FC<AnalysisResultsWidgetProps> = ({
                                                                              shortestPath,
                                                                              mst,
                                                                              distances,
                                                                              connectivity,
                                                                              verticesList,
                                                                              edgesList,
                                                                              graphType
                                                                            }) => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
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
                : graphType === 'undirected'
                  ? 'Граф не связный'
                  : 'Граф не слабо связный'
              }
            </div>
          </div>

          {connectivity.components.length > 0 && (
            <div>
              <h4 style={{margin: '0 0 12px 0', color: '#553c9a', fontSize: '16px', fontWeight: '600'}}>
                Компоненты {graphType === 'undirected' ? 'связности' : 'слабой связности'}:
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
  );
};