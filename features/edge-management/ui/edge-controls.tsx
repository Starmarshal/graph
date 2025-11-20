import React, {useState} from 'react';
import {Edge, Vertex} from '@/shared/types/grpah.interface';

interface EdgeControlsProps {
  edges: Edge[];
  vertices: Vertex[];
  onAddEdge: (from: number, to: number, weight: number) => void;
  onRemoveEdge: (from: number, to: number) => void;
  isMobile?: boolean;
}

export const EdgeControls: React.FC<EdgeControlsProps> = ({
                                                            edges,
                                                            vertices,
                                                            onAddEdge,
                                                            onRemoveEdge,
                                                            isMobile = false
                                                          }) => {
  const [edgeFrom, setEdgeFrom] = useState<string>('');
  const [edgeTo, setEdgeTo] = useState<string>('');
  const [edgeWeight, setEdgeWeight] = useState<string>('1');

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.style.borderColor = '#007bff';
    e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.style.borderColor = '#e1e5e9';
    e.target.style.boxShadow = 'none';
  };

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!isMobile) {
      e.currentTarget.style.backgroundColor = '#0056b3';
      e.currentTarget.style.transform = 'translateY(-1px)';
    }
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!isMobile) {
      e.currentTarget.style.backgroundColor = '#007bff';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  const handleAddEdge = (): void => {
    if (!edgeFrom || !edgeTo || !edgeWeight) return;

    const from = parseInt(edgeFrom);
    const to = parseInt(edgeTo);
    const weight = parseFloat(edgeWeight);

    if (isNaN(from) || isNaN(to) || isNaN(weight)) {
      alert('Все поля должны содержать числа!');
      return;
    }

    const fromVertex = vertices.find((v: Vertex) => v.id === from);
    const toVertex = vertices.find((v: Vertex) => v.id === to);

    if (!fromVertex || !toVertex) {
      alert('Одна или обе вершины не существуют!');
      return;
    }

    onAddEdge(from, to, weight);
    setEdgeFrom('');
    setEdgeTo('');
    setEdgeWeight('1');
  };

  return (
    <div style={{marginBottom: isMobile ? '16px' : '24px'}}>
      <h4 style={{
        marginBottom: isMobile ? '8px' : '12px',
        color: '#333',
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: '600'
      }}>
        Управление рёбрами
      </h4>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: isMobile ? '4px' : '8px',
        marginBottom: isMobile ? '8px' : '8px',
        width: '100%'
      }}>
        <input
          type="number"
          placeholder="Из вершины"
          value={edgeFrom}
          onChange={(e) => setEdgeFrom(e.target.value)}
          style={{
            padding: isMobile ? '8px 10px' : '10px 12px',
            width: '100%',
            border: '1px solid #e1e5e9',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '14px',
            transition: 'all 0.2s ease',
            gridColumn: '1 / 2',
            gridRow: '1 / 2'
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <input
          type="number"
          placeholder="В вершину"
          value={edgeTo}
          onChange={(e) => setEdgeTo(e.target.value)}
          style={{
            padding: isMobile ? '8px 10px' : '10px 12px',
            width: '100%',
            border: '1px solid #e1e5e9',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '14px',
            transition: 'all 0.2s ease',
            gridColumn: '2 / 3',
            gridRow: '1 / 2'
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <input
          type="number"
          placeholder="Вес"
          value={edgeWeight}
          onChange={(e) => setEdgeWeight(e.target.value)}
          style={{
            padding: isMobile ? '8px 10px' : '10px 12px',
            width: '100%',
            border: '1px solid #e1e5e9',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '14px',
            transition: 'all 0.2s ease',
            gridColumn: '1 / 2',
            gridRow: '2 / 3'
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <button
          onClick={handleAddEdge}
          style={{
            padding: isMobile ? '8px 12px' : '10px 16px',
            width: '100%',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: '600',
            fontSize: isMobile ? '13px' : '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            gridColumn: '2 / 3',
            gridRow: '2 / 3'
          }}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          Добавить ребро
        </button>
      </div>

      <div>
        <h5 style={{
          marginBottom: isMobile ? '6px' : '8px',
          color: '#666',
          fontSize: isMobile ? '13px' : '14px',
          fontWeight: '600'
        }}>
          Существующие рёбра ({edges.length})
        </h5>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: isMobile ? '6px' : '8px',
          maxHeight: isMobile ? '80px' : '120px',
          overflowY: 'auto',
          padding: isMobile ? '8px' : '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
          justifyContent: 'center', // Выравнивание по центру
          alignItems: 'center' // Выравнивание по вертикали по центру
        }}>
          {edges.map((edge: Edge, index: number) => (
            <div key={index} style={{
              padding: isMobile ? '4px 8px' : '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '4px' : '6px',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '500'
            }}>
              <span>{edge.from} → {edge.to} (вес: {edge.weight})</span>
              <button
                onClick={() => onRemoveEdge(edge.from, edge.to)}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: isMobile ? '16px' : '18px',
                  height: isMobile ? '16px' : '18px',
                  cursor: 'pointer',
                  fontSize: isMobile ? '10px' : '12px',
                  lineHeight: '1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }}
              >
                ×
              </button>
            </div>
          ))}
          {edges.length === 0 && (
            <div style={{
              color: '#6c757d',
              fontSize: isMobile ? '12px' : '13px',
              textAlign: 'center',
              width: '100%',
              padding: isMobile ? '4px' : '8px'
            }}>
              Нет рёбер
            </div>
          )}
        </div>
      </div>

    </div>
  );
};