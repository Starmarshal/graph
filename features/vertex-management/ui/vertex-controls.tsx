import React, {useState} from 'react';
import {Vertex} from '@/shared/types/grpah.interface';

interface VertexControlsProps {
  vertices: Vertex[];
  onAddVertex: (id: number) => void;
  onRemoveVertex: (vertexId: number) => void;
  isMobile?: boolean;
}

export const VertexControls: React.FC<VertexControlsProps> = ({
                                                                vertices,
                                                                onAddVertex,
                                                                onRemoveVertex,
                                                                isMobile = false
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
    <div style={{marginBottom: isMobile ? '16px' : '24px'}}>
      <h4 style={{
        marginBottom: isMobile ? '8px' : '12px',
        color: '#333',
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: '600'
      }}>
        Управление вершинами
      </h4>

      <div style={{
        display: 'flex',
        gap: isMobile ? '6px' : '10px',
        alignItems: 'center',
        marginBottom: isMobile ? '12px' : '16px',
        flexDirection: 'column',
        width: '100%'
      }}>
        <input
          type="number"
          placeholder="ID вершины"
          value={newVertexId}
          onChange={(e) => setNewVertexId(e.target.value)}
          style={{
            padding: isMobile ? '8px 12px' : '10px 12px',
            width: '100%',
            border: '1px solid #e1e5e9',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '14px',
            transition: 'all 0.2s ease'
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <button
          onClick={handleAddVertex}
          style={{
            padding: isMobile ? '8px 16px' : '10px 20px',
            width: '100%',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: '600',
            fontSize: isMobile ? '13px' : '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          Добавить вершину
        </button>
      </div>

      <div>
        <h5 style={{
          marginBottom: isMobile ? '6px' : '8px',
          color: '#666',
          fontSize: isMobile ? '13px' : '14px',
          fontWeight: '600'
        }}>
          Существующие вершины ({vertices.length})
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
          justifyContent: 'center', // Выравнивание по горизонтали по центру
          alignItems: 'center' // Выравнивание по вертикали по центру
        }}>
          {vertices.map((vertex: Vertex) => (
            <div key={vertex.id} style={{
              padding: isMobile ? '4px 8px' : '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '4px' : '6px',
              fontSize: isMobile ? '12px' : '13px',
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
          {vertices.length === 0 && (
            <div style={{
              color: '#6c757d',
              fontSize: isMobile ? '12px' : '13px',
              textAlign: 'center',
              width: '100%',
              padding: isMobile ? '4px' : '8px'
            }}>
              Нет вершин
            </div>
          )}
        </div>
      </div>
    </div>
  );
};