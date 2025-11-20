import React from 'react';
import {
  ShortestPathResult,
  MSTResult,
  DistanceResult,
  ConnectivityResult,
  VerticesListResult,
  EdgesListResult
} from '@/shared/types/grpah.interface';

interface AnalysisResultsWidgetProps {
  shortestPath: ShortestPathResult | null;
  mst: MSTResult | null;
  distances: DistanceResult | null;
  connectivity: ConnectivityResult | null;
  verticesList: VerticesListResult | null;
  edgesList: EdgesListResult | null;
  graphType: 'undirected' | 'directed';
  isMobile?: boolean;
}

export const AnalysisResultsWidget: React.FC<AnalysisResultsWidgetProps> = ({
                                                                              shortestPath,
                                                                              mst,
                                                                              distances,
                                                                              connectivity,
                                                                              verticesList,
                                                                              edgesList,
                                                                              graphType,
                                                                              isMobile = false
                                                                            }) => {
  const resultStyle = {
    padding: isMobile ? '16px' : '20px',
    backgroundColor: 'white',
    borderRadius: isMobile ? '8px' : '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: isMobile ? '12px' : '16px'
  };

  const titleStyle = {
    margin: '0 0 12px 0',
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '600' as const,
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const iconStyle = {
    width: isMobile ? '16px' : '20px',
    height: isMobile ? '16px' : '20px',
    borderRadius: '50%',
    flexShrink: 0
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px'}}>
      {/* Компонент списка вершин */}
      {verticesList && (
        <div style={{
          ...resultStyle,
          border: '2px solid #bee3f8'
        }}>
          <h3 style={{
            ...titleStyle,
            color: '#2b6cb0'
          }}>
            <div style={{
              ...iconStyle,
              backgroundColor: '#4299e1'
            }}></div>
            Список вершин
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '6px' : '8px'
          }}>
            {verticesList.vertices.map(vertexId => (
              <div
                key={vertexId}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 12px',
                  backgroundColor: '#ebf8ff',
                  borderRadius: '6px',
                  border: '1px solid #bee3f8',
                  textAlign: 'center',
                  minWidth: isMobile ? '40px' : '50px'
                }}
              >
                <div style={{
                  fontWeight: '600',
                  color: '#2b6cb0',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  Вершина
                </div>
                <div style={{
                  fontSize: isMobile ? '14px' : '16px',
                  fontWeight: '700',
                  color: '#2c5282'
                }}>
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
          ...resultStyle,
          border: '2px solid #c6f6d5'
        }}>
          <h3 style={{
            ...titleStyle,
            color: '#276749'
          }}>
            <div style={{
              ...iconStyle,
              backgroundColor: '#48bb78'
            }}></div>
            Список рёбер
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '6px' : '8px'
          }}>
            {edgesList.edges.map((edge, index) => (
              <div
                key={index}
                style={{
                  padding: isMobile ? '8px 12px' : '10px 14px',
                  backgroundColor: '#f0fff4',
                  borderRadius: '6px',
                  border: '1px solid #9ae6b4',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontWeight: '600',
                  color: '#276749',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  {edge.from} → {edge.to}
                </div>
                <div style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: '#38a169',
                  marginTop: '2px'
                }}>
                  вес: {edge.weight}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {shortestPath && shortestPath.path.length > 0 && (
        <div style={{
          ...resultStyle,
          border: '2px solid #fed7d7'
        }}>
          <h3 style={{
            ...titleStyle,
            color: '#c53030'
          }}>
            <div style={{
              ...iconStyle,
              backgroundColor: '#f56565'
            }}></div>
            Кратчайший путь
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
            gap: isMobile ? '8px' : '12px',
            alignItems: 'center'
          }}>
            {!isMobile && <strong style={{color: '#4a5568'}}>Путь:</strong>}
            <div style={{
              padding: isMobile ? '6px 10px' : '8px 12px',
              backgroundColor: '#fff5f5',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontWeight: '500',
              color: '#c53030',
              fontSize: isMobile ? '13px' : 'inherit'
            }}>
              {isMobile ? 'Путь: ' : ''}{shortestPath.path.join(' → ')}
            </div>

            {!isMobile && <strong style={{color: '#4a5568'}}>Длина:</strong>}
            <div style={{
              padding: isMobile ? '6px 10px' : '8px 12px',
              backgroundColor: '#fff5f5',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontWeight: '600',
              color: '#c53030',
              fontSize: isMobile ? '14px' : '16px',
              gridColumn: isMobile ? '1' : '2'
            }}>
              {isMobile ? 'Длина: ' : ''}{shortestPath.distance}
            </div>
          </div>
        </div>
      )}

      {shortestPath && shortestPath.path.length === 0 && shortestPath.distance === Infinity && (
        <div style={{
          ...resultStyle,
          border: '2px solid #fed7d7'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            color: '#c53030',
            fontSize: isMobile ? '16px' : '18px',
            fontWeight: '600'
          }}>
            Кратчайший путь не найден
          </h3>
          <p style={{color: '#718096', margin: 0, fontSize: isMobile ? '13px' : 'inherit'}}>
            Между выбранными вершинами нет пути
          </p>
        </div>
      )}

      {mst && mst.edges.length > 0 && (
        <div style={{
          ...resultStyle,
          border: '2px solid #c6f6d5'
        }}>
          <h3 style={{
            ...titleStyle,
            color: '#276749'
          }}>
            <div style={{
              ...iconStyle,
              backgroundColor: '#48bb78'
            }}></div>
            Минимальное остовное дерево
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'auto 1fr',
            gap: isMobile ? '8px' : '12px',
            alignItems: 'center'
          }}>
            {!isMobile && <strong style={{color: '#4a5568'}}>Общий вес:</strong>}
            <div style={{
              padding: isMobile ? '6px 10px' : '8px 12px',
              backgroundColor: '#f0fff4',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontWeight: '600',
              color: '#276749',
              fontSize: isMobile ? '14px' : '16px',
              gridColumn: isMobile ? '1' : '2'
            }}>
              {isMobile ? 'Общий вес: ' : ''}{mst.totalWeight}
            </div>

            {!isMobile && <strong style={{color: '#4a5568', alignSelf: 'start'}}>Рёбра:</strong>}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: isMobile ? '4px' : '6px',
              gridColumn: isMobile ? '1' : '2'
            }}>
              {mst.edges.map((edge, index) => (
                <span
                  key={index}
                  style={{
                    padding: isMobile ? '4px 8px' : '6px 10px',
                    backgroundColor: '#f0fff4',
                    borderRadius: '12px',
                    fontSize: isMobile ? '12px' : '13px',
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
          ...resultStyle,
          border: '2px solid #feebc8'
        }}>
          <h3 style={{
            ...titleStyle,
            color: '#744210'
          }}>
            <div style={{
              ...iconStyle,
              backgroundColor: '#ed8936'
            }}></div>
            Расстояния от вершины {distances.fromVertex}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(100px, 1fr))' : 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: isMobile ? '8px' : '12px'
          }}>
            {Array.from(distances.distances.entries()).map(([vertex, distance]) => (
              <div
                key={vertex}
                style={{
                  padding: isMobile ? '8px' : '12px',
                  backgroundColor: '#fffaf0',
                  borderRadius: '6px',
                  textAlign: 'center',
                  border: '1px solid #fed7aa'
                }}
              >
                <div style={{
                  fontWeight: '600',
                  fontSize: isMobile ? '12px' : '14px',
                  marginBottom: '4px',
                  color: '#744210'
                }}>
                  Вершина {vertex}
                </div>
                <div style={{
                  fontSize: isMobile ? '16px' : '18px',
                  fontWeight: '700',
                  color: distance === Infinity ? '#e53e3e' : '#d69e2e'
                }}>
                  {distance === Infinity ? '∞' : distance}
                </div>
                {distance === Infinity && (
                  <div style={{
                    fontSize: isMobile ? '10px' : '11px',
                    color: '#a0aec0',
                    marginTop: '2px'
                  }}>
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
          ...resultStyle,
          border: '2px solid #e9d8fd'
        }}>
          <h3 style={{
            ...titleStyle,
            color: '#553c9a'
          }}>
            <div style={{
              ...iconStyle,
              backgroundColor: '#9f7aea'
            }}></div>
            Связность графа
          </h3>

          <div style={{
            padding: isMobile ? '12px' : '16px',
            backgroundColor: connectivity.isConnected ? '#f0fff4' : '#fff5f5',
            borderRadius: '6px',
            marginBottom: isMobile ? '12px' : '16px',
            border: `2px solid ${connectivity.isConnected ? '#9ae6b4' : '#fc8181'}`
          }}>
            <div style={{
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '600',
              color: connectivity.isConnected ? '#276749' : '#c53030',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              {connectivity.isConnected ? (
                <svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
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
              <h4 style={{
                margin: '0 0 8px 0',
                color: '#553c9a',
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600'
              }}>
                Компоненты {graphType === 'undirected' ? 'связности' : 'слабой связности'}:
              </h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: isMobile ? '6px' : '10px',
                maxHeight: isMobile ? '120px' : 'none',
                overflowY: 'auto'
              }}>
                {connectivity.components.map((component, index) => (
                  <div
                    key={index}
                    style={{
                      padding: isMobile ? '8px 12px' : '12px 16px',
                      backgroundColor: '#faf5ff',
                      borderRadius: '8px',
                      border: '1px solid #d6bcfa',
                      minWidth: isMobile ? '100px' : '120px',
                      flex: isMobile ? '1 1 calc(50% - 6px)' : 'none'
                    }}
                  >
                    <div style={{
                      fontSize: isMobile ? '11px' : '12px',
                      color: '#9f7aea',
                      marginBottom: '4px',
                      fontWeight: '500'
                    }}>
                      Компонента {index + 1}
                    </div>
                    <div style={{
                      fontWeight: '600',
                      color: '#553c9a',
                      fontSize: isMobile ? '12px' : '14px',
                      wordBreak: 'break-word'
                    }}>
                      {component.join(', ')}
                    </div>
                    <div style={{
                      fontSize: isMobile ? '10px' : '11px',
                      color: '#a0aec0',
                      marginTop: '2px'
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