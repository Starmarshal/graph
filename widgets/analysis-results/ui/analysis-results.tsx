import React from 'react';
import {
  ShortestPathResult,
  MSTResult,
  DistanceResult,
  ConnectivityResult,
  VerticesListResult,
  EdgesListResult
} from '@/shared/types/grpah.interface';

interface AnalysisResultsWidgetProps {
  shortestPath: ShortestPathResult | null;
  mst: MSTResult | null;
  distances: DistanceResult | null;
  connectivity: ConnectivityResult | null;
  verticesList: VerticesListResult | null;
  edgesList: EdgesListResult | null;
  graphType: 'undirected' | 'directed';
  isMobile?: boolean;
}

export const AnalysisResultsWidget: React.FC<AnalysisResultsWidgetProps> = ({
                                                                              shortestPath,
                                                                              mst,
                                                                              distances,
                                                                              connectivity,
                                                                              verticesList,
                                                                              edgesList,
                                                                              graphType,
                                                                              isMobile = false
                                                                            }) => {
  return (
    <div className={`flex flex-col ${isMobile ? 'gap-3' : 'gap-4'}`}>
      {/* Компонент списка вершин */}
      {verticesList && (
        <div className={`
          bg-white border-2 border-blue-200 rounded-lg shadow-sm
          ${isMobile ? 'p-4 mb-3' : 'p-5 mb-4'}
        `}>
          <h3 className={`
            flex items-center gap-2 mb-3 font-semibold
            ${isMobile ? 'text-base text-blue-800' : 'text-lg text-blue-900'}
          `}>
            <div className={`rounded-full bg-blue-500 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}></div>
            Список вершин
          </h3>
          <div className={`flex flex-wrap ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
            {verticesList.vertices.map(vertexId => (
              <div
                key={vertexId}
                className={`
                  bg-blue-50 border border-blue-200 rounded text-center
                  ${isMobile ? 'px-2.5 py-1.5 min-w-[40px]' : 'px-3 py-2 min-w-[50px]'}
                `}
              >
                <div className={`
                  font-semibold text-blue-800
                  ${isMobile ? 'text-xs' : 'text-sm'}
                `}>
                  Вершина
                </div>
                <div className={`
                  font-bold text-blue-900
                  ${isMobile ? 'text-sm' : 'text-base'}
                `}>
                  {vertexId}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Компонент списка рёбер */}
      {edgesList && (
        <div className={`
          bg-white border-2 border-green-200 rounded-lg shadow-sm
          ${isMobile ? 'p-4 mb-3' : 'p-5 mb-4'}
        `}>
          <h3 className={`
            flex items-center gap-2 mb-3 font-semibold
            ${isMobile ? 'text-base text-green-800' : 'text-lg text-green-900'}
          `}>
            <div className={`rounded-full bg-green-500 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}></div>
            Список рёбер
          </h3>
          <div className={`flex flex-wrap ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
            {edgesList.edges.map((edge, index) => (
              <div
                key={index}
                className={`
                  bg-green-50 border border-green-300 rounded text-center
                  ${isMobile ? 'px-3 py-2' : 'px-3.5 py-2.5'}
                `}
              >
                <div className={`
                  font-semibold text-green-800
                  ${isMobile ? 'text-xs' : 'text-sm'}
                `}>
                  {edge.from} → {edge.to}
                </div>
                <div className={`
                  text-green-600 mt-0.5
                  ${isMobile ? 'text-xs' : 'text-sm'}
                `}>
                  вес: {edge.weight}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {shortestPath && shortestPath.path.length > 0 && (
        <div className={`
          bg-white border-2 border-red-200 rounded-lg shadow-sm
          ${isMobile ? 'p-4 mb-3' : 'p-5 mb-4'}
        `}>
          <h3 className={`
            flex items-center gap-2 mb-3 font-semibold
            ${isMobile ? 'text-base text-red-800' : 'text-lg text-red-900'}
          `}>
            <div className={`rounded-full bg-red-500 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}></div>
            Кратчайший путь
          </h3>
          <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-[auto_1fr] gap-3 items-center'}`}>
            {!isMobile && <strong className="text-gray-700">Путь:</strong>}
            <div className={`
              bg-red-50 rounded font-mono font-medium text-red-800
              ${isMobile ? 'px-2.5 py-1.5 text-sm' : 'px-3 py-2'}
            `}>
              {isMobile ? 'Путь: ' : ''}{shortestPath.path.join(' → ')}
            </div>

            {!isMobile && <strong className="text-gray-700">Длина:</strong>}
            <div className={`
              bg-red-50 rounded font-mono font-semibold text-red-800
              ${isMobile ? 'px-2.5 py-1.5 text-sm col-span-1' : 'px-3 py-2 text-base col-span-1'}
            `}>
              {isMobile ? 'Длина: ' : ''}{shortestPath.distance}
            </div>
          </div>
        </div>
      )}

      {shortestPath && shortestPath.path.length === 0 && shortestPath.distance === Infinity && (
        <div className={`
          bg-white border-2 border-red-200 rounded-lg shadow-sm
          ${isMobile ? 'p-4 mb-3' : 'p-5 mb-4'}
        `}>
          <h3 className={`
            mb-2 font-semibold text-red-800
            ${isMobile ? 'text-base' : 'text-lg'}
          `}>
            Кратчайший путь не найден
          </h3>
          <p className={`text-gray-600 m-0 ${isMobile ? 'text-sm' : ''}`}>
            Между выбранными вершинами нет пути
          </p>
        </div>
      )}

      {mst && mst.edges.length > 0 && (
        <div className={`
          bg-white border-2 border-green-200 rounded-lg shadow-sm
          ${isMobile ? 'p-4 mb-3' : 'p-5 mb-4'}
        `}>
          <h3 className={`
            flex items-center gap-2 mb-3 font-semibold
            ${isMobile ? 'text-base text-green-800' : 'text-lg text-green-900'}
          `}>
            <div className={`rounded-full bg-green-500 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}></div>
            Минимальное остовное дерево
          </h3>
          <div className={`${isMobile ? 'space-y-2' : 'grid grid-cols-[auto_1fr] gap-3 items-start'}`}>
            {!isMobile && <strong className="text-gray-700">Общий вес:</strong>}
            <div className={`
              bg-green-50 rounded font-mono font-semibold text-green-800
              ${isMobile ? 'px-2.5 py-1.5 text-sm col-span-1' : 'px-3 py-2 text-base col-span-1'}
            `}>
              {isMobile ? 'Общий вес: ' : ''}{mst.totalWeight}
            </div>

            {!isMobile && <strong className="text-gray-700 self-start">Рёбра:</strong>}
            <div className={`flex flex-wrap ${isMobile ? 'gap-1 col-span-1' : 'gap-1.5 col-span-1'}`}>
              {mst.edges.map((edge, index) => (
                <span
                  key={index}
                  className={`
                    bg-green-50 border border-green-300 rounded-full font-medium text-green-800
                    ${isMobile ? 'px-2 py-1 text-xs' : 'px-2.5 py-1.5 text-sm'}
                  `}
                >
                  {edge.from}—{edge.to}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {distances && (
        <div className={`
          bg-white border-2 border-orange-200 rounded-lg shadow-sm
          ${isMobile ? 'p-4 mb-3' : 'p-5 mb-4'}
        `}>
          <h3 className={`
            flex items-center gap-2 mb-3 font-semibold
            ${isMobile ? 'text-base text-orange-800' : 'text-lg text-orange-900'}
          `}>
            <div className={`rounded-full bg-orange-500 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}></div>
            Расстояния от вершины {distances.fromVertex}
          </h3>
          <div className={`
            grid gap-3
            ${isMobile ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}
          `}>
            {Array.from(distances.distances.entries()).map(([vertex, distance]) => (
              <div
                key={vertex}
                className={`
                  bg-orange-50 border border-orange-200 rounded text-center
                  ${isMobile ? 'p-2' : 'p-3'}
                `}
              >
                <div className={`
                  font-semibold mb-1 text-orange-800
                  ${isMobile ? 'text-xs' : 'text-sm'}
                `}>
                  Вершина {vertex}
                </div>
                <div className={`
                  font-bold ${distance === Infinity ? 'text-red-500' : 'text-orange-600'}
                  ${isMobile ? 'text-base' : 'text-lg'}
                `}>
                  {distance === Infinity ? '∞' : distance}
                </div>
                {distance === Infinity && (
                  <div className={`
                    text-gray-500 mt-0.5
                    ${isMobile ? 'text-xs' : 'text-sm'}
                  `}>
                    недостижима
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {connectivity && (
        <div className={`
          bg-white border-2 border-purple-200 rounded-lg shadow-sm
          ${isMobile ? 'p-4 mb-3' : 'p-5 mb-4'}
        `}>
          <h3 className={`
            flex items-center gap-2 mb-3 font-semibold
            ${isMobile ? 'text-base text-purple-800' : 'text-lg text-purple-900'}
          `}>
            <div className={`rounded-full bg-purple-500 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`}></div>
            Связность графа
          </h3>

          <div className={`
            rounded-lg mb-4 border-2
            ${connectivity.isConnected
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
          }
            ${isMobile ? 'p-3' : 'p-4'}
          `}>
            <div className={`
              font-semibold flex items-center gap-1.5
              ${connectivity.isConnected ? 'text-green-800' : 'text-red-800'}
              ${isMobile ? 'text-sm' : 'text-base'}
            `}>
              {connectivity.isConnected ? (
                <svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg width={isMobile ? '16' : '20'} height={isMobile ? '16' : '20'} viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              )}
              {connectivity.isConnected
                ? 'Граф связный'
                : graphType === 'undirected'
                  ? 'Граф не связный'
                  : 'Граф не слабо связный'
              }
            </div>
          </div>

          {connectivity.components.length > 0 && (
            <div>
              <h4 className={`
                mb-2 font-semibold text-purple-800
                ${isMobile ? 'text-sm' : 'text-base'}
              `}>
                Компоненты {graphType === 'undirected' ? 'связности' : 'слабой связности'}:
              </h4>
              <div className={`
                flex flex-wrap gap-2 overflow-y-auto
                ${isMobile ? 'max-h-32' : ''}
              `}>
                {connectivity.components.map((component, index) => (
                  <div
                    key={index}
                    className={`
                      bg-purple-50 border border-purple-300 rounded-lg
                      ${isMobile ? 'px-3 py-2 min-w-[100px] flex-1 basis-[calc(50%-4px)]' : 'px-4 py-3 min-w-[120px]'}
                    `}
                  >
                    <div className={`
                      text-purple-600 mb-1 font-medium
                      ${isMobile ? 'text-xs' : 'text-sm'}
                    `}>
                      Компонента {index + 1}
                    </div>
                    <div className={`
                      font-semibold text-purple-800 break-words
                      ${isMobile ? 'text-xs' : 'text-sm'}
                    `}>
                      {component.join(', ')}
                    </div>
                    <div className={`
                      text-gray-500 mt-1
                      ${isMobile ? 'text-xs' : 'text-sm'}
                    `}>
                      {component.length} вершин
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};