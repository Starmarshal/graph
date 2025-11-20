import React, { useState } from 'react';
import { Vertex } from '@/shared/types/graph.interface';

interface VertexControlsProps {
  vertices: Vertex[];
  onAddVertex: (id: number) => void;
  onRemoveVertex: (vertexId: number) => void;
}

export const VertexControls: React.FC<VertexControlsProps> = ({
                                                                vertices,
                                                                onAddVertex,
                                                                onRemoveVertex
                                                              }) => {
  const [newVertexId, setNewVertexId] = useState<string>('');

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.style.borderColor = '#007bff';
    e.target.style.boxShadow = '0 0 0 3px rgba(0, 123, 255, 0.1)';
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    e.target.style.borderColor = '#e1e5e9';
    e.target.style.boxShadow = 'none';
  };

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#0056b3';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#007bff';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  const handleAddVertex = (): void => {
    if (!newVertexId) return;

    const id = parseInt(newVertexId);
    if (isNaN(id)) {
      alert('ID вершины должен быть числом!');
      return;
    }

    if (vertices.find((v: Vertex) => v.id === id)) {
      alert('Вершина с таким ID уже существует!');
      return;
    }

    onAddVertex(id);
    setNewVertexId('');
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{
        marginBottom: '12px',
        color: '#333',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Управление вершинами
      </h4>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
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
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <button
          onClick={handleAddVertex}
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
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          Добавить
        </button>
      </div>

      <div>
        <h5 style={{
          marginBottom: '8px',
          color: '#666',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          Существующие вершины ({vertices.length})
        </h5>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          maxHeight: '120px',
          overflowY: 'auto',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          {vertices.map((vertex: Vertex) => (
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
                onClick={() => onRemoveVertex(vertex.id)}
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
          {vertices.length === 0 && (
            <div style={{
              color: '#6c757d',
              fontSize: '13px',
              textAlign: 'center',
              width: '100%',
              padding: '8px'
            }}>
              Нет вершин
            </div>
          )}
        </div>
      </div>
    </div>
  );
};