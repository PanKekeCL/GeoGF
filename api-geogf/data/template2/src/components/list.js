import React from "react";

const minigames = MINIJUEGOS;

const List = ({ onClose }) => (
  <div className="absolute bottom-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
    <button
      className="absolute top-2 right-2 text-gray-600 hover:text-black"
      onClick={onClose}
    >
      ✕
    </button>
    <h3 className="text-lg font-bold mb-2">Minijuegos</h3>
    <ul className="list-disc list-inside text-sm">
      {minigames.map((game, index) => (
        <li key={index}>
          <span className="font-semibold">{game.nombre}</span>: {game.descripcion}
        </li>
      ))}
    </ul>
  </div>
);

export default List;
