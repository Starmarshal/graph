import React from 'react';
import Button from '@/shared/ui/Button';
import StatusBanner from '@/shared/ui/StatusBanner';

interface ConnectivityControlProps {
  graphType: 'undirected' | 'directed';
  onCheckConnectivity: () => void;
}

export const ConnectivityControl: React.FC<ConnectivityControlProps> = ({
                                                                          graphType,
                                                                          onCheckConnectivity
                                                                        }) => {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Проверка связности
      </h4>

      <Button
        onClick={onCheckConnectivity}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Проверить связность
      </Button>

      <StatusBanner
        className="border-purple-200 bg-purple-50 text-purple-800"
      >
        {graphType === 'undirected'
          ? 'Проверка связности графа'
          : 'Проверка слабой связности'
        }
      </StatusBanner>
    </div>
  );
};