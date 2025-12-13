import React, {useState} from 'react';
import {Vertex} from '@/shared/types/grpah.interface';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

interface DistancesControlProps {
  vertices: Vertex[];
  onFindDistances: (start: number) => void;
}

export const DistancesControl: React.FC<DistancesControlProps> = ({
                                                                    vertices,
                                                                    onFindDistances
                                                                  }) => {
  const [distanceVertex, setDistanceVertex] = useState<string>('');

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
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Расстояния до всех вершин
      </h4>

      <div className="flex gap-2 mb-2 flex-wrap">
        <Input
          type="number"
          placeholder="Начальная вершина"
          value={distanceVertex}
          onChange={(e) => setDistanceVertex(e.target.value)}
          className="w-full"
        />
      </div>

      <Button
        onClick={handleFindDistances}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Найти расстояния
      </Button>
    </div>
  );
};