import React from 'react';
import {
  VerticesListResult,
  EdgesListResult
} from '@/shared/types/grpah.interface';
import Button from '@/shared/ui/Button';

interface GraphInfoControlProps {
  onListVertices: () => void;
  onListEdges: () => void;
  verticesList: VerticesListResult | null;
  edgesList: EdgesListResult | null;
}

export const GraphInfoControl: React.FC<GraphInfoControlProps> = ({
                                                                    onListVertices,
                                                                    onListEdges,
                                                                    verticesList,
                                                                    edgesList
                                                                  }) => {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Информация о графе
      </h4>

      <div className="flex gap-2 mb-2.5 flex-wrap">
        <Button
          className="focus:ring-cyan-500 bg-cyan-600 hover:bg-cyan-700 px-4 py-2"
          onClick={onListVertices}
        >
          Список вершин
        </Button>
        <Button
          className="focus:ring-cyan-500 bg-cyan-600 hover:bg-cyan-700 px-4 py-2"
          onClick={onListEdges}
        >
          Список рёбер
        </Button>
      </div>

      {verticesList && (
        <div className="p-3 bg-gray-50 rounded-lg mb-2 border border-gray-200">
          <h5 className="m-0 mb-2 text-gray-700 text-sm font-semibold flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
              />
              <path d="M12 8v8M8 12h8" />
            </svg>
            Список вершин ({verticesList.vertices.length})
          </h5>
          <div className="flex flex-wrap gap-1">
            {verticesList.vertices.map(vertexId => (
              <span
                key={vertexId}
                className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-medium"
              >
                {vertexId}
              </span>
            ))}
          </div>
        </div>
      )}

      {edgesList && (
        <div className="p-3 bg-gray-50 rounded-lg mb-2 border border-gray-200">
          <h5 className="m-0 mb-2 text-gray-700 text-sm font-semibold flex items-center gap-1.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
            </svg>
            Список рёбер ({edgesList.edges.length})
          </h5>
          <div className="flex flex-wrap gap-1">
            {edgesList.edges.map((edge, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-600 text-white rounded-full text-xs font-medium"
              >
                {edge.from}→{edge.to}({edge.weight})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};