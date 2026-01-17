

import { useMemo, useState } from 'react';
import CampusMap from '../components/map/floor1';
import floorData from '../data/floor_1.json';         // Import your JSON

const NavigationPage = () => {
  // --- STATE: Track User Choices ---
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // --- DATA PREP: Convert JSON Object to Array for Dropdowns ---
  // We use useMemo so we don't recalculate this on every render
  const roomOptions = useMemo(() => {
    return Object.entries(floorData.destinations)
      .map(([id, data]) => ({
        id: id,            // e.g., "mac_lab"
        name: data.name    // e.g., "MAC Lab"
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // Sort A-Z
  }, []);

  return (
    <div className="relative w-full h-screen">
      
      {/* --- UI PART: The Selection Menu --- */}
      {/* You can place this div anywhere in your existing layout */}
      <div className="absolute top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-xl w-80 border border-gray-200">
        <h2 className="font-bold text-lg mb-4 text-gray-800">Select Route</h2>
        
        {/* Origin Select */}
        <div className="mb-3">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Start Point</label>
          <select 
            value={origin} 
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Choose Origin...</option>
            {roomOptions.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>

        {/* Destination Select */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Destination</label>
          <select 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 outline-none bg-white"
          >
            <option value="">Choose Destination...</option>
            {roomOptions.map((room) => (
              <option key={room.id} value={room.id}>{room.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- MAP INTEGRATION --- */}
      {origin && destination && (
        <CampusMap>
           {/* Optional: Visual Feedback on Map */}
           {/* This highlights the selected rooms on the map automatically */}
           {Object.entries(floorData.destinations).map(([id, data]) => {
              const isOrigin = id === origin;
              const isDest = id === destination;
              
              // Only render label/highlight if it is selected (optional logic)
              if (!isOrigin && !isDest) return null; 

              return (
                 <g key={id}>
                   <circle 
                     cx={data.x} 
                     cy={data.y} 
                     r={10} 
                     fill={isOrigin ? "#22c55e" : "#ef4444"} // Green vs Red
                     stroke="#fff" 
                     strokeWidth={2} 
                   />
                   <text 
                     x={data.x} 
                     y={data.y - 15} 
                     textAnchor="middle" 
                     fontWeight="bold"
                     style={{ textShadow: "0 1px 2px white" }}
                   >
                     {data.name}
                   </text>
                 </g>
              );
           })}
        </CampusMap>
      )}

      {/* Show message when selections are incomplete */}
      {(!origin || !destination) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Your Route</h3>
            <p className="text-gray-500">Please choose both origin and destination to view the map.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default NavigationPage;