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
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      <GraphCanvas {...props} />
    </div>
  );
};