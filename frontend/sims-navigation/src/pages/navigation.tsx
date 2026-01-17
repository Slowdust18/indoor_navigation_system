
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; 
import floorData from '../data/floor_1.json';  

const NavigationPage = () => {
  const navigate = useNavigate(); 
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const roomOptions = useMemo(() => {
    return Object.entries(floorData.destinations)
      .map(([id, data]) => ({ id, name: data.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // --- THE HANDLER ---
  const handleStartNavigation = () => {
    if (!origin || !destination) {
      alert("Please select both Start Point and Destination");
      return;
    }
    
 
    navigate(`/map-view?origin=${origin}&dest=${destination}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border">
        <h1 className="text-2xl font-bold mb-6 text-center">Plan Route</h1>

        {/* Origin Select */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Start Point</label>
          <select 
            value={origin} 
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Origin...</option>
            {roomOptions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        {/* Destination Select */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
          <select 
            value={destination} 
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Destination...</option>
            {roomOptions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>

        {/* Go Button */}
        <button 
          onClick={handleStartNavigation}
          disabled={!origin || !destination}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400"
        >
          Start Navigation
        </button>
      </div>
    </div>
  );
};

export default NavigationPage;