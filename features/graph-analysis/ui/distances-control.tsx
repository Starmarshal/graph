import React, { useState } from 'react';
import { Vertex } from '@/shared/types/graph.interface';

interface DistancesControlProps {
  vertices: Vertex[];
  onFindDistances: (start: number) => void;
}

export const DistancesControl: React.FC<DistancesControlProps> = ({
                                                                    vertices,
                                                                    onFindDistances
                                                                  }) => {
  const [distanceVertex, setDistanceVertex] = useState<string>('');

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

  const handleFindDistances = (): void => {
    if (!distanceVertex) {
      alert('Введите начальную вершину!');
      return;
    }

    const start = parseInt(distanceVertex);

    if (isNaN(start)) {
      alert('Вершина должна быть числом!');
      return;
    }

    onFindDistances(start);
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <h4 style={{
        marginBottom: '12px',
        color: '#333',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Расстояния до всех вершин
      </h4>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <input
          type="number"
          placeholder="Начальная вершина"
          value={distanceVertex}
          onChange={(e) => setDistanceVertex(e.target.value)}
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
      </div>

      <button
        onClick={handleFindDistances}
        style={{
          width: '100%',
          padding: '10px 16px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: '#007bff',
          color: 'white',
          fontWeight: '600',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        Найти расстояния
      </button>
    </div>
  );
};