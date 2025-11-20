import React from 'react';

interface ConnectivityControlProps {
  graphType: 'undirected' | 'directed';
  onCheckConnectivity: () => void;
}

export const ConnectivityControl: React.FC<ConnectivityControlProps> = ({
                                                                          graphType,
                                                                          onCheckConnectivity
                                                                        }) => {
  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#0056b3';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#007bff';
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
        Проверка связности
      </h4>

      <button
        onClick={onCheckConnectivity}
        style={{
          width: '100%',
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
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        Проверить связность
      </button>

      <div style={{
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: '#f8f5ff',
        borderRadius: '6px',
        border: '1px solid #e9d8fd',
        fontSize: '12px',
        color: '#553c9a',
        textAlign: 'center'
      }}>
        {graphType === 'undirected'
          ? 'Проверка связности графа'
          : 'Проверка слабой связности'
        }
      </div>
    </div>
  );
};