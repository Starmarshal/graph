import React, {useState} from 'react';
import {Vertex} from '@/shared/types/grpah.interface';
import Input from '@/shared/ui/Input';
import Button from '@/shared/ui/Button';

interface VertexControlsProps {
  vertices: Vertex[];
  onAddVertex: (id: number) => void;
  onRemoveVertex: (vertexId: number) => void;
  isMobile?: boolean;
}

export const VertexControls: React.FC<VertexControlsProps> = ({
                                                                vertices,
                                                                onAddVertex,
                                                                onRemoveVertex,
                                                                isMobile = false
                                                              }) => {
  const [newVertexId, setNewVertexId] = useState<string>('');

  const handleAddVertex = (): void => {
    if (!newVertexId) return;

    const id = parseInt(newVertexId);
    if (isNaN(id)) {
      alert('ID вершины должен быть числом!');
      return;
    }

    if (vertices.find((v: Vertex) => v.id === id)) {
      alert('Вершина с таким ID уже существует!');
      return;
    }

    onAddVertex(id);
    setNewVertexId('');
  };

  return (
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Управление вершинами
      </h4>

      <div className="flex flex-col gap-2.5 items-center w-full mb-4">
        <Input
          type="number"
          placeholder="ID вершины"
          value={newVertexId}
          onChange={(e) => setNewVertexId(e.target.value)}
          className="w-full"
        />
        <Button
          onClick={handleAddVertex}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Добавить вершину
        </Button>
      </div>

      <div>
        <h5 className="mb-2 text-gray-500 text-sm font-semibold">
          Существующие вершины ({vertices.length})
        </h5>
        <div
          className="
          flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-3
          bg-gray-50 rounded-md border border-gray-200
          justify-center items-center
          "
        >
          {vertices.map((vertex: Vertex) => (
            <div
              key={vertex.id}
              className="
              px-3 py-1.5 bg-blue-600 text-white
              rounded-full flex items-center gap-1.5 text-sm font-medium
              "
            >
              <span>Вершина {vertex.id}</span>
              <Button
                onClick={() => onRemoveVertex(vertex.id)}
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
          {vertices.length === 0 && (
            <div className="text-gray-500 text-sm text-center w-full p-2">
              Нет вершин
            </div>
          )}
        </div>
      </div>
    </div>
  );
};