import React from 'react';
import { GraphCanvas } from '@/entities/graph/ui/graph-canvas';
import { GraphData, ShortestPathResult, MSTResult } from '@/shared/types/grpah.interface';

interface GraphVisualizerWidgetProps {
  graphData: GraphData;
  selectedVertices: number[];
  shortestPath: ShortestPathResult | null;
  mst: MSTResult | null;
  onVertexSelect: (vertexId: number) => void;
  onVertexMove: (vertexId: number, x: number, y: number) => void;
  isMobile?: boolean;
}

export const GraphVisualizerWidget: React.FC<GraphVisualizerWidgetProps> = (props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      <GraphCanvas {...props} />
    </div>
  );
};