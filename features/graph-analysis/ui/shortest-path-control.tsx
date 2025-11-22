import React, {useState} from 'react';
import {Vertex} from '@/shared/types/grpah.interface';
import StatusBanner from '@/shared/ui/StatusBanner';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

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
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Кратчайший путь (Беллман-Форд)
      </h4>

      <div className="flex gap-2 mb-2 flex-wrap">
        <Input
          type="number"
          placeholder="Начальная вершина"
          value={startVertex}
          onChange={(e) => setStartVertex(e.target.value)}
          className="w-full"
        />
        <Input
          type="number"
          placeholder="Конечная вершина"
          value={endVertex}
          onChange={(e) => setEndVertex(e.target.value)}
          className="w-full"
        />
      </div>

      <Button
        onClick={handleFindShortestPath}
        className="w-full bg-blue-500 hover:bg-blue-600"
      >
        Найти кратчайший путь
      </Button>

      <StatusBanner
        className="border-blue-200 bg-blue-50 text-blue-800"
      >
        Алгоритм Беллмана-Форда
      </StatusBanner>
    </div>
  );
};