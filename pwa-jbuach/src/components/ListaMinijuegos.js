import React from 'react';
import { useNavigate } from 'react-router-dom';

// Datos inventados para los minijuegos
const data = [
  {
    id: 'minijuego-1',
    imagen: 'https://example.com/imagenes/jardin-botanico.jpg',
    titulo: 'Trivia de Plantas Nativas',
    descripcion: 'Pon a prueba tus conocimientos sobre las plantas nativas del jardín botánico de la Universidad Austral de Chile.',
  },
  {
    id: 'minijuego-2',
    imagen: 'https://example.com/imagenes/peumo.jpg',
    titulo: 'Empareja las Especies',
    descripcion: 'Empareja las especies de plantas con sus características más destacadas en este juego interactivo.',
  },
  {
    id: 'minijuego-3',
    imagen: 'https://example.com/imagenes/rauli.jpg',
    titulo: 'Ordena el Bosque',
    descripcion: 'Organiza los árboles según su tamaño y ubicación en el jardín botánico para completar este desafío.',
  },
];

function ListaMinijuegos({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleGameClick = (id) => {
    navigate(`/minigame?id=${id}`); // Redirigir a la página del minijuego con el id
  };

  return (
    <div
      className={`z-[999] fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-lg transition-transform duration-300 ${isOpen ? 'transform-none' : 'transform translate-y-full'}`}
      style={{ height: '80%' }}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Lista de Minijuegos</h2>
        <button
          onClick={onClose}
          className="text-red-500 font-bold text-sm"
        >
          Cerrar
        </button>
      </div>
      <div className="p-4 overflow-y-auto">
        {/* Mapeo de los minijuegos desde el array `data` */}
        {data.map((minijuego) => (
          <div key={minijuego.id} className="flex items-center p-2 border-b">
            {/* Imagen del minijuego */}
            <img
              src={minijuego.imagen}
              alt={minijuego.titulo}
              className="w-16 h-16 mr-4 rounded-md"
            />
            <div className="flex-1">
              {/* Título y descripción del minijuego */}
              <h3 className="font-bold">{minijuego.titulo}</h3>
              <p className="text-sm text-gray-600">{minijuego.descripcion}</p>
            </div>
            {/* Botón Jugar */}
            <button
              onClick={() => handleGameClick(minijuego.id)}
              className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 transition"
            >
              Jugar
            </button>
          </div>
        ))}
      </div>
      <div
        onClick={onClose}
        className="absolute top-0 left-0 w-full h-4 cursor-pointer"
      />
    </div>
  );
}

export default ListaMinijuegos;
