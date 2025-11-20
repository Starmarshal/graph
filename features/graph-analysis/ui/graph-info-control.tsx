import React from 'react';
import { VerticesListResult, EdgesListResult } from '@/shared/types/graph.interface';

interface GraphInfoControlProps {
  onListVertices: () => void;
  onListEdges: () => void;
  verticesList: VerticesListResult | null;
  edgesList: EdgesListResult | null;
}

export const GraphInfoControl: React.FC<GraphInfoControlProps> = ({
                                                                    onListVertices,
                                                                    onListEdges,
                                                                    verticesList,
                                                                    edgesList
                                                                  }) => {
  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.opacity = '0.9';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.opacity = '1';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{
        marginBottom: '12px',
        color: '#333',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Информация о графе
      </h4>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={onListVertices}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#17a2b8',
            color: 'white',
            fontWeight: '500',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
          }}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          Список вершин
        </button>

        <button
          onClick={onListEdges}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#17a2b8',
            color: 'white',
            fontWeight: '500',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: 1
          }}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
        >
          Список рёбер
        </button>
      </div>

      {verticesList && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h5 style={{
            margin: '0 0 8px 0',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8 12h8"/>
            </svg>
            Список вершин ({verticesList.vertices.length})
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {verticesList.vertices.map(vertexId => (
              <span
                key={vertexId}
                style={{
                  padding: '4px 8px',
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
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h5 style={{
            margin: '0 0 8px 0',
            color: '#495057',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            Список рёбер ({edgesList.edges.length})
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {edgesList.edges.map((edge, index) => (
              <span
                key={index}
                style={{
                  padding: '4px 8px',
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
  );
};