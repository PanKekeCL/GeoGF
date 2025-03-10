import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MapIcon from "../assets/icons/mapIcon";
import PlayIcon from "../assets/icons/playIcon";
import SearchIcon from "../assets/icons/searchIcon";

const minigames = MINIJUEGOS;

const formatGameName = (name) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .toLowerCase();
};

const List = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMinigames = minigames.filter((game) =>
    game.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-100 p-2 flex flex-col">
      <button
        onClick={() => navigate("/map")}
        className="z-[999] absolute bottom-4 right-4 w-14 h-14 bg-lime-500 text-white rounded-lg flex items-center justify-center hover:bg-lime-600"
      >
        <MapIcon />
      </button>
      {/* Header: título */}
      <div className="relative flex-shrink-0">
        <h1 className="text-4xl font-bold text-center">Selecciona un minijuego</h1>
      </div>
      {/* Buscador */}
      <div className="relative mt-4 w-full flex items-center bg-white border border-gray-300 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-lime-500 px-4 py-2">
        <SearchIcon className="text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent border-none focus:outline-none px-2"
        />
      </div>

      {/* Lista de minijuegos con desplazamiento */}
      <div className="w-full mt-2 overflow-y-auto flex-1 p-2 bg-white shadow-md rounded-lg space-y-2">
        {filteredMinigames.length > 0 ? (
          filteredMinigames.map((minigame) => (
            <div key={minigame._id} className="p-4 shadow flex items-center justify-between rounded-md">
              <div>
                <h2 className="font-semibold">{minigame.nombre}</h2>
                <p className="text-sm text-gray-600">{minigame.descripcion}</p>
              </div>
              <button
                className="p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                onClick={() => navigate(`/minigames/${formatGameName(minigame.nombre)}`)}
              >
                <PlayIcon />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No se encontraron minijuegos.</p>
        )}
      </div>
    </div>
  );
};

export default List;