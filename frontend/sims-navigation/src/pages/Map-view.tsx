// pages/map-view.tsx
import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import CampusMap from '../components/map/floor1';
import floorData from '../data/floor_1.json';
import { findShortestPath } from '../utils/pathfinding'; // 1. IMPORT IT

const MapView = () => {
  const [searchParams] = useSearchParams();
  const originId = searchParams.get('origin');
  const destId = searchParams.get('dest');

  const originData = originId ? floorData.destinations[originId as keyof typeof floorData.destinations] : null;
  const destData = destId ? floorData.destinations[destId as keyof typeof floorData.destinations] : null;

  // 2. CALCULATE THE PATH
  // We connect: Origin Room -> Nearest Node -> [Graph Path] -> Nearest Node -> Dest Room
  const { path: graphPathString, distance } = useMemo(() => {
    if (!originData || !destData) return { path: '', distance: 0 };

    // A. Get the graph path
    const pathResult = findShortestPath(originData.nearest_node, destData.nearest_node);
    
    // B. Stitch the Room coordinates to the Graph path
    // "OriginX,OriginY" + " " + "GraphPoints..." + " " + "DestX,DestY"
    const fullPath = `${originData.x},${originData.y} ${pathResult.path} ${destData.x},${destData.y}`;
    
    return { path: fullPath, distance: pathResult.distance };
  }, [originData, destData]);

  if (!originData || !destData) return <div>Invalid Route</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header code same as before... */}
      <div className="bg-white p-4 shadow z-10">
        <h2 className="font-bold">Navigating: {originData.name} to {destData.name}</h2>
        <Link to="/navigation" className="text-blue-600 text-sm">Change Route</Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden border">
          
          <CampusMap>
            
            {/* 3. THE BLUE DOTTED ROUTE */}
            {graphPathString && (
              <polyline
                points={graphPathString}
                fill="none"
                stroke="#3B82F6"        // Blue color (Tailwind blue-500)
                strokeWidth="5"         // Thick line
                strokeDasharray="10,6"  // The "Dotted" effect (10px line, 6px gap)
                strokeLinecap="round"   // Smooth ends
                className="animate-pulse" // Optional: makes the path glow slightly
                style={{ filter: 'drop-shadow(0px 0px 4px rgba(59, 130, 246, 0.5))' }}
              />
            )}

            {/* Origin Pin */}
            <g>
              <circle cx={originData.x} cy={originData.y} r={8} fill="#22c55e" stroke="white" strokeWidth={2} />
              <text x={originData.x} y={originData.y - 12} textAnchor="middle" fontWeight="bold" fontSize="12" fill="#166534">Start</text>
            </g>

            {/* Destination Pin */}
            <g>
              <circle cx={destData.x} cy={destData.y} r={8} fill="#ef4444" stroke="white" strokeWidth={2} />
              <text x={destData.x} y={destData.y - 12} textAnchor="middle" fontWeight="bold" fontSize="12" fill="#991b1b">End</text>
            </g>

          </CampusMap>
        </div>
      </div>

      {/* Footer with Total Distance */}
      <div className="bg-white p-4 shadow z-10 text-center">
        <p className="text-lg font-semibold text-gray-700">
          Total Distance: {distance.toFixed(2)} meters
        </p>
      </div>
    </div>
  );
};

export default MapView;