import React, { useState } from 'react';
import { Vertex } from '@/shared/types/grpah.interface';

interface ShortestPathControlProps {
  vertices: Vertex[];
  onFindShortestPath: (start: number, end: number) => void;
  isMobile?: boolean;
}

export const ShortestPathControl: React.FC<ShortestPathControlProps> = ({
                                                                          vertices,
                                                                          onFindShortestPath,
                                                                          isMobile = false
                                                                        }) => {
  const [startVertex, setStartVertex] = useState<string>('');
  const [endVertex, setEndVertex] = useState<string>('');

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

  const handleFindShortestPath = (): void => {
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

    onFindShortestPath(start, end);
  };

  return (
    <div style={{ marginBottom: isMobile ? '16px' : '24px' }}>
      <h4 style={{
        marginBottom: isMobile ? '8px' : '12px',
        color: '#333',
        fontSize: isMobile ? '14px' : '16px',
        fontWeight: '600'
      }}>
        Кратчайший путь (Беллман-Форд)
      </h4>

      <div style={{
        display: 'flex',
        gap: isMobile ? '6px' : '8px',
        marginBottom: isMobile ? '8px' : '8px',
        flexWrap: 'wrap',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        <input
          type="number"
          placeholder="Начальная вершина"
          value={startVertex}
          onChange={(e) => setStartVertex(e.target.value)}
          style={{
            padding: isMobile ? '8px 12px' : '10px 12px',
            flex: 1,
            border: '1px solid #e1e5e9',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '14px',
            transition: 'all 0.2s ease'
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        <input
          type="number"
          placeholder="Конечная вершина"
          value={endVertex}
          onChange={(e) => setEndVertex(e.target.value)}
          style={{
            padding: isMobile ? '8px 12px' : '10px 12px',
            flex: 1,
            border: '1px solid #e1e5e9',
            borderRadius: '6px',
            fontSize: isMobile ? '14px' : '14px',
            transition: 'all 0.2s ease'
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      <button
        onClick={handleFindShortestPath}
        style={{
          width: '100%',
          padding: isMobile ? '8px 16px' : '10px 16px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#007bff',
          color: 'white',
          fontWeight: '600',
          fontSize: isMobile ? '13px' : '14px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        Найти кратчайший путь
      </button>

      {!isMobile && (
        <div style={{
          marginTop: '8px',
          padding: '8px 12px',
          backgroundColor: '#e8f4fd',
          borderRadius: '6px',
          border: '1px solid #b6d7f7',
          fontSize: '12px',
          color: '#1e4e7a',
          textAlign: 'center'
        }}>
          Алгоритм Беллмана-Форда
        </div>
      )}
    </div>
  );
};