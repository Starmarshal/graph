import React from 'react';
import Button from '@/shared/ui/Button';
import StatusBanner from '@/shared/ui/StatusBanner';

interface MSTControlProps {
  onFindMST: () => void;
}

export const MSTControl: React.FC<MSTControlProps> = ({onFindMST}) => {
  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#0056b3';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.currentTarget.style.backgroundColor = '#007bff';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Минимальное остовное дерево (Краскал)
      </h4>

      <Button
        onClick={onFindMST}
        className="w-full bg-blue-500 hover:bg-blue-600"
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
      >
        Найти MST
      </Button>

      <StatusBanner
        className="border-green-200 bg-green-50 text-green-800"
      >
        Алгоритм Краскала
      </StatusBanner>
    </div>
  );
};