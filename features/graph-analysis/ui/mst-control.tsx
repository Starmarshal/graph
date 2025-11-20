import React from 'react';

interface MSTControlProps {
  onFindMST: () => void;
}

export const MSTControl: React.FC<MSTControlProps> = ({ onFindMST }) => {
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
        Минимальное остовное дерево (Краскал)
      </h4>

      <button
        onClick={onFindMST}
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
        Найти MST
      </button>

      <div style={{
        marginTop: '8px',
        padding: '8px 12px',
        backgroundColor: '#f0f9f0',
        borderRadius: '6px',
        border: '1px solid #c6f6d5',
        fontSize: '12px',
        color: '#276749',
        textAlign: 'center'
      }}>
        Алгоритм Краскала
      </div>
    </div>
  );
};