import React, {useState} from 'react';
import {Edge, Vertex} from '@/shared/types/grpah.interface';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

interface EdgeControlsProps {
  edges: Edge[];
  vertices: Vertex[];
  onAddEdge: (from: number, to: number, weight: number) => void;
  onRemoveEdge: (from: number, to: number) => void;
  isMobile?: boolean;
}

export const EdgeControls: React.FC<EdgeControlsProps> = ({
                                                            edges,
                                                            vertices,
                                                            onAddEdge,
                                                            onRemoveEdge,
                                                            isMobile = false
                                                          }) => {
  const [edgeFrom, setEdgeFrom] = useState<string>('');
  const [edgeTo, setEdgeTo] = useState<string>('');
  const [edgeWeight, setEdgeWeight] = useState<string>('1');

  const handleAddEdge = (): void => {
    if (!edgeFrom || !edgeTo || !edgeWeight) return;

    const from = parseInt(edgeFrom);
    const to = parseInt(edgeTo);
    const weight = parseFloat(edgeWeight);

    if (isNaN(from) || isNaN(to) || isNaN(weight)) {
      alert('Все поля должны содержать числа!');
      return;
    }

    const fromVertex = vertices.find((v: Vertex) => v.id === from);
    const toVertex = vertices.find((v: Vertex) => v.id === to);

    if (!fromVertex || !toVertex) {
      alert('Одна или обе вершины не существуют!');
      return;
    }

    onAddEdge(from, to, weight);
    setEdgeFrom('');
    setEdgeTo('');
    setEdgeWeight('1');
  };

  return (
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Управление рёбрами
      </h4>

      <div className="grid grid-cols-2 auto-rows-auto gap-2 mb-2 w-full">
        <Input
          type="number"
          placeholder="Из вершины"
          value={edgeFrom}
          onChange={(e) => setEdgeFrom(e.target.value)}
          className="w-full"
        />
        <Input
          type="number"
          placeholder="В вершину"
          value={edgeTo}
          onChange={(e) => setEdgeTo(e.target.value)}
          className="w-full"
        />
        <Input
          type="number"
          placeholder="Вес"
          value={edgeWeight}
          onChange={(e) => setEdgeWeight(e.target.value)}
          className="w-full"
        />
        <Button
          onClick={handleAddEdge}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Добавить ребро
        </Button>
      </div>

      <div>
        <h5 className="mb-2 text-gray-500 text-sm font-semibold">
          Существующие рёбра ({edges.length})
        </h5>
        <div
          className="
          flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-3
          bg-gray-50 rounded-md border border-gray-200
          justify-center items-center
          "
        >
          {edges.map((edge: Edge, index: number) => (
            <div
              key={index}
              className="
              px-3 py-1.5 bg-green-600 text-white
              rounded-full flex items-center gap-1.5 text-sm font-medium
              "
            >
              <span>{edge.from} → {edge.to} (вес: {edge.weight})</span>
              <Button
                onClick={() => onRemoveEdge(edge.from, edge.to)}
                className="
                  bg-white/30 hover:bg-white/50
                  !rounded-full w-[18px]
                  text-xs leading-none
                  !p-0 !h-[18px]
                  transition-all duration-200
                  hover:!translate-y-0
                  flex items-center justify-center
                "
              >
                ×
              </Button>
            </div>
          ))}
          {edges.length === 0 && (
            <div className="text-gray-500 text-sm text-center w-full p-2">
              Нет рёбер
            </div>
          )}
        </div>
      </div>

    </div>
  );
};