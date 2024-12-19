import React from 'react';
import { Link } from 'react-router-dom';  // Importamos Link de react-router-dom
import BackIcon from '../assets/icons/backIcon';

const DesignsToDownload = ({ selectedItems }) => {
  return (
    <div className="flex flex-col justify-between h-full overflow-auto p-5 bg-white">

      {/* Botón Volver */}
      <Link to="/menu">
        <button className="h-12 w-12 bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center">
          <BackIcon color="#FFFFFF" size={30} />
        </button>
      </Link>

      <h2 className="font-semibold text-xl mb-4">Diseños seleccionados para descarga</h2>
      {/* Contenedor con lista de elementos seleccionados */}
      <div className="w-full max-h-[80%] overflow-y-auto px-5" style={{ maxHeight: '78%' }}>
        {selectedItems.length === 0 ? (
          <p>No has seleccionado ningún diseño para descargar.</p>
        ) : (
          <ul className="space-y-5"> {/* Usamos space-y-5 para el espacio entre los <li> */}
            {selectedItems.map((item, index) => (
              <li key={index} className="p-3 bg-white border rounded-md shadow mb-2">
                {item.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón de descarga */}
      <button
        className={`h-12 w-full rounded-md font-semibold ${selectedItems.length === 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-500 text-gray-800 hover:bg-blue-600'
          }`}
        disabled={selectedItems.length === 0}
      >
        Descargar
      </button>
    </div>
  );
};

export default DesignsToDownload;
