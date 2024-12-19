import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Jardín Botánico UACh</h1>
      <button
        onClick={() => navigate('/map')}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded"
      >
        Ver Mapa
      </button>
    </div>
  );
}

export default Home;
