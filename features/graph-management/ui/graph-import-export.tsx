import React, {useCallback} from 'react';
import {GraphData, GraphType} from '@/shared/types/grpah.interface';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

interface GraphImportExportProps {
  graphData: GraphData;
  onImport: (data: GraphData) => void;
  onExport: () => void;
}

export const GraphImportExport: React.FC<GraphImportExportProps> = ({
                                                                      graphData,
                                                                      onImport,
                                                                      onExport
                                                                    }) => {
  const parseGraphFile = useCallback((content: string, graphType: GraphType): GraphData => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    const vertices: any[] = [];
    const edges: any[] = [];

    if (lines.length === 0) {
      return {vertices, edges, type: graphType};
    }

    if (lines[0].includes(':')) {
      parseAdjacencyList(lines, vertices, edges, graphType);
    } else if (lines[0].split(/\s+/).length <= 3) {
      parseEdgeList(lines, vertices, edges, graphType);
    } else {
      parseAdjacencyMatrix(lines, vertices, edges, graphType);
    }

    return {vertices, edges, type: graphType};
  }, []);

  const parseAdjacencyMatrix = (lines: string[], vertices: any[], edges: any[], graphType: GraphType): void => {
    const n = lines.length;

    for (let i = 1; i <= n; i++) {
      vertices.push({
        id: i,
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      });
    }

    for (let i = 0; i < n; i++) {
      const weights = lines[i].trim().split(/\s+/).map(Number);
      const fromVertex = i + 1;

      for (let j = 0; j < weights.length; j++) {
        const weight = weights[j];
        const toVertex = j + 1;

        if (weight !== 0 && fromVertex !== toVertex) {
          edges.push({from: fromVertex, to: toVertex, weight});
        }
      }
    }
  };

  const parseAdjacencyList = (lines: string[], vertices: any[], edges: any[], graphType: GraphType): void => {
    const vertexSet = new Set<number>();

    lines.forEach(line => {
      const parts = line.split(':');
      const fromVertex = parseInt(parts[0].trim());
      vertexSet.add(fromVertex);

      if (parts[1] && parts[1].trim()) {
        const neighbors = parts[1].trim().split(/\s+/);
        neighbors.forEach(neighborStr => {
          const neighborParts = neighborStr.split(':').map(Number);
          const toVertex = neighborParts[0];
          const weight = neighborParts[1] || 1;
          if (toVertex && !isNaN(toVertex)) {
            vertexSet.add(toVertex);
            edges.push({from: fromVertex, to: toVertex, weight: isNaN(weight) ? 1 : weight});
          }
        });
      }
    });

    Array.from(vertexSet).forEach(id => {
      vertices.push({
        id,
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      });
    });
  };

  const parseEdgeList = (lines: string[], vertices: any[], edges: any[], graphType: GraphType): void => {
    const vertexSet = new Set<number>();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3) {
        const fromVertex = parseInt(parts[0]);
        const toVertex = parseInt(parts[1]);
        const weight = parseFloat(parts[2]);

        if (!isNaN(fromVertex) && !isNaN(toVertex) && !isNaN(weight)) {
          vertexSet.add(fromVertex);
          vertexSet.add(toVertex);
          edges.push({from: fromVertex, to: toVertex, weight});
        }
      } else if (parts.length === 2) {
        const fromVertex = parseInt(parts[0]);
        const toVertex = parseInt(parts[1]);
        const weight = 1;

        if (!isNaN(fromVertex) && !isNaN(toVertex)) {
          vertexSet.add(fromVertex);
          vertexSet.add(toVertex);
          edges.push({from: fromVertex, to: toVertex, weight});
        }
      }
    });

    Array.from(vertexSet).forEach(id => {
      vertices.push({
        id,
        x: Math.random() * 600 + 100,
        y: Math.random() * 400 + 100
      });
    });
  };

  const loadGraphFromFile = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const newGraphData = parseGraphFile(content, graphData.type);
        onImport(newGraphData);
        alert(`Граф загружен! Вершин: ${newGraphData.vertices.length}, Рёбер: ${newGraphData.edges.length}`);
      } catch (error) {
        alert(`Ошибка при загрузке файла: ${error}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="mb-6">
      <h4 className="mb-3 text-gray-800 text-base font-semibold">
        Загрузить из файла
      </h4>

      <label
        className="
          flex items-center gap-3 p-4 border-2 border-dashed
          border-gray-200 rounded-lg bg-gray-50 cursor-pointer
          transition-all duration-200 ease-in-out mb-2
          hover:border-blue-500 hover:bg-blue-50 hover:shadow-sm
          focus-within:border-blue-500 focus-within:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-200
        "
      >
        <Input
          type="file"
          accept=".txt"
          onChange={loadGraphFromFile}
          className="hidden"
        />

        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="text-blue-600"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>

        <span className="text-gray-800 font-medium">
          Выберите файл
        </span>

        <span className="ml-auto text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
          .txt
        </span>
      </label>

      <small className="text-center block text-sm text-gray-500">
        Поддерживаются форматы: матрица смежности, списки смежности, список рёбер
      </small>

      <Button
        onClick={onExport}
        className="w-full bg-green-600 hover:bg-green-700 gap-[6px] text-[14px] font-medium mt-[12px] !rounded-[10px] hover:!translate-y-0"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Экспорт графа
      </Button>
    </div>
  );
};