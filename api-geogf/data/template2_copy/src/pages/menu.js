import React from 'react';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
  const navigate = useNavigate();

  const handlePlayButtonClick = () => {
    navigate('/map');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Título grande */}
      <h1 className="text-6xl font-bold uppercase mb-8 text-center">Proyecto 30</h1>

      {/* Botón para ir al mapa */}
      <button
        onClick={handlePlayButtonClick}
        className="px-6 py-3 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Jugar
      </button>
    </div>
  );
};

export default Menu;
