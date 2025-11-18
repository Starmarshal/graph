import React, { useState } from 'react';
import { GraphData, ShortestPathResult, MSTResult, DistanceResult, ConnectivityResult, Vertex, Edge, GraphType } from './types';
import { Graph } from '../lib/graph';

interface GraphControlsProps {
  graphData: GraphData;
  onGraphUpdate: (data: GraphData) => void;
  onShortestPath: (path: ShortestPathResult | null) => void;
  onMST: (mst: MSTResult | null) => void;
  onDistances: (distances: DistanceResult | null) => void;
  onConnectivity: (connectivity: ConnectivityResult | null) => void;
}

/* Интерфейсы для информации о графе */
interface VerticesListResult {
  vertices: number[];
}

interface EdgesListResult {
  edges: { from: number; to: number; weight: number }[];
}

const GraphControls: React.FC<GraphControlsProps> = ({
                                                       graphData,
                                                       onGraphUpdate,
                                                       onShortestPath,
                                                       onMST,
                                                       onDistances,
                                                       onConnectivity
                                                     }) => {
  const [newVertexId, setNewVertexId] = useState('');
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');
  const [startVertex, setStartVertex] = useState('');
  const [endVertex, setEndVertex] = useState('');
  const [distanceVertex, setDistanceVertex] = useState('');
  const [verticesList, setVerticesList] = useState<VerticesListResult | null>(null);
  const [edgesList, setEdgesList] = useState<EdgesListResult | null>(null);

  /* Парсеры файлов */
  const parseGraphFile = (content: string, graphType: GraphType): GraphData => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const vertices: Vertex[] = [];
    const edges: Edge[] = [];

    if (lines.length === 0) {
      return { vertices, edges, type: graphType };
    }

    /* Определяем формат файла */
    if (lines[0].includes(':')) {
      /* Формат: списки смежности */
      parseAdjacencyList(lines, vertices, edges, graphType);
    } else if (lines[0].split(/\s+/).length <= 3) {
      // Формат: список рёбер
      parseEdgeList(lines, vertices, edges, graphType);
    } else {
      // Формат: матрица смежности
      parseAdjacencyMatrix(lines, vertices, edges, graphType);
    }

    return { vertices, edges, type: graphType };
  };

  const parseAdjacencyMatrix = (lines: string[], vertices: Vertex[], edges: Edge[], graphType: GraphType) => {
    const n = lines.length;

    /* Создаём вершины */
    for (let i = 1; i <= n; i++) {
      vertices.push({
        id: i,
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      });
    }

    /* Парсим матрицу */
    for (let i = 0; i < n; i++) {
      const weights = lines[i].trim().split(/\s+/).map(Number);
      const fromVertex = i + 1;

      for (let j = 0; j < weights.length; j++) {
        const weight = weights[j];
        const toVertex = j + 1;

        if (weight !== 0 && fromVertex !== toVertex) {
          edges.push({ from: fromVertex, to: toVertex, weight });
        }
      }
    }
  };

  const parseAdjacencyList = (lines: string[], vertices: Vertex[], edges: Edge[], graphType: GraphType) => {
    const vertexSet = new Set<number>();

    /* Парсим списки смежности */
    lines.forEach(line => {
      const parts = line.split(':');
      const fromVertex = parseInt(parts[0].trim());
      vertexSet.add(fromVertex);

      if (parts[1] && parts[1].trim()) {
        const neighbors = parts[1].trim().split(/\s+/);
        neighbors.forEach(neighborStr => {
          const [toVertex, weight] = neighborStr.split(':').map(Number);
          if (toVertex && weight) {
            vertexSet.add(toVertex);
            edges.push({ from: fromVertex, to: toVertex, weight });
          }
        });
      }
    });

    /* Создаём вершины */
    Array.from(vertexSet).forEach(id => {
      vertices.push({
        id,
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      });
    });
  };

  const parseEdgeList = (lines: string[], vertices: Vertex[], edges: Edge[], graphType: GraphType) => {
    const vertexSet = new Set<number>();

    /* Парсим список рёбер */
    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3) {
        const fromVertex = parseInt(parts[0]);
        const toVertex = parseInt(parts[1]);
        const weight = parseFloat(parts[2]);

        vertexSet.add(fromVertex);
        vertexSet.add(toVertex);
        edges.push({ from: fromVertex, to: toVertex, weight });
      }
    });

    /* Создаём вершины */
    Array.from(vertexSet).forEach(id => {
      vertices.push({
        id,
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      });
    });
  };

  const createEmptyGraph = () => {
    const newData: GraphData = {
      vertices: [],
      edges: [],
      type: graphData.type
    };
    onGraphUpdate(newData);
    clearResults();
  };

  const loadGraphFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const newGraphData = parseGraphFile(content, graphData.type);
        onGraphUpdate(newGraphData);
        alert(`Граф загружен! Вершин: ${newGraphData.vertices.length}, Рёбер: ${newGraphData.edges.length}`);
      } catch (error) {
        alert(`Ошибка при загрузке файла: ${error}`);
      }
    };
    reader.readAsText(file);

    /* Сбрасываем значение input для возможности загрузки того же файла снова */
    event.target.value = '';
  };

  const addVertex = () => {
    if (!newVertexId) return;

    const id = parseInt(newVertexId);
    if (isNaN(id)) {
      alert('ID вершины должен быть числом!');
      return;
    }

    if (graphData.vertices.find(v => v.id === id)) {
      alert('Вершина с таким ID уже существует!');
      return;
    }

    const newVertex = {
      id,
      x: Math.random() * 600 + 100,
      y: Math.random() * 400 + 100
    };

    const newData: GraphData = {
      ...graphData,
      vertices: [...graphData.vertices, newVertex]
    };

    onGraphUpdate(newData);
    setNewVertexId('');
  };

  const addEdge = () => {
    if (!edgeFrom || !edgeTo || !edgeWeight) return;

    const from = parseInt(edgeFrom);
    const to = parseInt(edgeTo);
    const weight = parseFloat(edgeWeight);

    if (isNaN(from) || isNaN(to) || isNaN(weight)) {
      alert('Все поля должны содержать числа!');
      return;
    }

    const fromVertex = graphData.vertices.find(v => v.id === from);
    const toVertex = graphData.vertices.find(v => v.id === to);

    if (!fromVertex || !toVertex) {
      alert('Одна или обе вершины не существуют!');
      return;
    }

    const newEdge = { from, to, weight };
    const edgeExists = graphData.edges.some(e =>
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
    setEdgeFrom('');
    setEdgeTo('');
    setEdgeWeight('');
  };

  const removeVertex = (vertexId: number) => {
    const newData: GraphData = {
      ...graphData,
      vertices: graphData.vertices.filter(v => v.id !== vertexId),
      edges: graphData.edges.filter(e => e.from !== vertexId && e.to !== vertexId)
    };

    onGraphUpdate(newData);
    clearResults();
  };

  const removeEdge = (from: number, to: number) => {
    const newData: GraphData = {
      ...graphData,
      edges: graphData.edges.filter(e => !(e.from === from && e.to === to))
    };

    onGraphUpdate(newData);
    clearResults();
  };

  /* Функции для информации о графе */
  const listVertices = () => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges);
    const vertices = graph.getVertices();
    setVerticesList({ vertices });
  };

  const listEdges = () => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges);
    const edges = graph.listOfEdges();
    setEdgesList({ edges });
  };

  const findShortestPath = () => {
    if (!startVertex || !endVertex) {
      alert('Введите начальную и конечную вершины!');
      return;
    }

    const start = parseInt(startVertex);
    const end = parseInt(endVertex);

    if (isNaN(start) || isNaN(end)) {
      alert('Вершины должны быть числами!');
      return;
    }

    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges, graphData.type);

    try {
      const result = graph.shortestPath(start, end);
      onShortestPath(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const findDistances = () => {
    if (!distanceVertex) {
      alert('Введите начальную вершину!');
      return;
    }

    const start = parseInt(distanceVertex);

    if (isNaN(start)) {
      alert('Вершина должна быть числом!');
      return;
    }

    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges);

    try {
      const result = graph.distancesFromVertex(start);
      onDistances(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const findMST = () => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges);

    try {
      const result = graph.kruskalMST();
      onMST(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const checkConnectivity = () => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges);

    try {
      const result = graphData.type === 'undirected'
        ? graph.isConnected()
        : graph.weakConnectedComponents();
      onConnectivity(result);
    } catch (error) {
      alert(`Ошибка: ${error}`);
    }
  };

  const clearResults = () => {
    onShortestPath(null);
    onMST(null);
    onDistances(null);
    onConnectivity(null);
    setVerticesList(null);
    setEdgesList(null);
  };

  const toggleGraphType = () => {
    const newType = graphData.type === 'undirected' ? 'directed' : 'undirected';
    onGraphUpdate({
      ...graphData,
      type: newType
    });
    clearResults();
  };

  const exportGraph = () => {
    const graph = new Graph();
    graph.initializeFromData(graphData.vertices, graphData.edges);
    const content = graph.exportToFile();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="controls" style={{
      padding: '24px',
      border: '1px solid #e1e5e9',
      borderRadius: '12px',
      maxHeight: '80vh',
      overflowY: 'auto',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Заголовок */}
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

      {/* Загрузка из файла */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Загрузить из файла
        </h4>

        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          border: '2px dashed #e1e5e9',
          borderRadius: '8px',
          backgroundColor: '#fafbfc',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '8px'
        }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.borderColor = '#007bff';
                 e.currentTarget.style.backgroundColor = '#f0f8ff';
                 e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.borderColor = '#e1e5e9';
                 e.currentTarget.style.backgroundColor = '#fafbfc';
                 e.currentTarget.style.boxShadow = 'none';
               }}>
          <input
            type="file"
            accept=".txt"
            onChange={loadGraphFromFile}
            style={{ display: 'none' }}
          />

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            style={{ color: '#007bff' }}
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>

          <span style={{
            color: '#333',
            fontWeight: '500'
          }}>
            Выберите файл
          </span>

          <span style={{
            marginLeft: 'auto',
            color: '#666',
            fontSize: '14px',
            backgroundColor: '#f1f3f4',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            .txt
          </span>
        </label>

        <small style={{
          color: '#666',
          fontSize: '12px',
          display: 'block',
          textAlign: 'center'
        }}>
          Поддерживаются форматы: матрица смежности, списки смежности, список рёбер
        </small>
      </div>

      {/* Добавить вершину */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>Добавить вершину</h4>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="ID вершины"
            value={newVertexId}
            onChange={(e) => setNewVertexId(e.target.value)}
            style={{
              padding: '10px 12px',
              flex: 1,
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={addVertex}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Добавить ребро */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>Добавить ребро</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <input
            type="number"
            placeholder="Из вершины"
            value={edgeFrom}
            onChange={(e) => setEdgeFrom(e.target.value)}
            style={{
              padding: '10px 12px',
              width: '100px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="number"
            placeholder="В вершину"
            value={edgeTo}
            onChange={(e) => setEdgeTo(e.target.value)}
            style={{
              padding: '10px 12px',
              width: '100px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="number"
            placeholder="Вес"
            value={edgeWeight}
            onChange={(e) => setEdgeWeight(e.target.value)}
            style={{
              padding: '10px 12px',
              width: '80px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={addEdge}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Добавить ребро
          </button>
        </div>
      </div>

      {/* Информация о графе */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>Информация о графе</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {[
            { label: 'Список вершин', onClick: listVertices, color: '#17a2b8' },
            { label: 'Список рёбер', onClick: listEdges, color: '#17a2b8' },
            { label: 'Проверить связность', onClick: checkConnectivity, color: '#17a2b8' }
          ].map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: button.color,
                color: 'white',
                fontWeight: '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Компоненты для отображения информации о графе */}
        {verticesList && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid #e9ecef'
          }}>
            <h5 style={{
              margin: '0 0 12px 0',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v8M8 12h8"/>
              </svg>
              Список вершин ({verticesList.vertices.length})
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {verticesList.vertices.map(vertexId => (
                <span
                  key={vertexId}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {vertexId}
                </span>
              ))}
            </div>
          </div>
        )}

        {edgesList && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid #e9ecef'
          }}>
            <h5 style={{
              margin: '0 0 12px 0',
              color: '#495057',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
              </svg>
              Список рёбер ({edgesList.edges.length})
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {edgesList.edges.map((edge, index) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {edge.from}→{edge.to}({edge.weight})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Алгоритмы */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>Кратчайший путь (Беллман-Форд)</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <input
            type="number"
            placeholder="Начальная вершина"
            value={startVertex}
            onChange={(e) => setStartVertex(e.target.value)}
            style={{
              padding: '10px 12px',
              width: '140px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="number"
            placeholder="Конечная вершина"
            value={endVertex}
            onChange={(e) => setEndVertex(e.target.value)}
            style={{
              padding: '10px 12px',
              width: '140px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={findShortestPath}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Найти путь
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>Расстояния до всех вершин</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <input
            type="number"
            placeholder="Начальная вершина"
            value={distanceVertex}
            onChange={(e) => setDistanceVertex(e.target.value)}
            style={{
              padding: '10px 12px',
              width: '140px',
              border: '1px solid #e1e5e9',
              borderRadius: '6px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e1e5e9';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={findDistances}
            style={{
              padding: '10px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#007bff',
              color: 'white',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Найти расстояния
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>Минимальное остовное дерево (Краскал)</h4>
        <button
          onClick={findMST}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#0056b3';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#007bff';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Найти MST
        </button>
      </div>

      {/* Существующие вершины и рёбра */}
      <div>
        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Существующие вершины ({graphData.vertices.length})
        </h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
          maxHeight: '120px',
          overflowY: 'auto',
          padding: '8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          {graphData.vertices.map(vertex => (
            <div key={vertex.id} style={{
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              <span>Вершина {vertex.id}</span>
              <button
                onClick={() => removeVertex(vertex.id)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <h4 style={{
          marginBottom: '12px',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          Существующие рёбра ({graphData.edges.length})
        </h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          maxHeight: '120px',
          overflowY: 'auto',
          padding: '8px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          {graphData.edges.map((edge, index) => (
            <div key={index} style={{
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              <span>{edge.from} → {edge.to} (вес: {edge.weight})</span>
              <button
                onClick={() => removeEdge(edge.from, edge.to)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphControls;