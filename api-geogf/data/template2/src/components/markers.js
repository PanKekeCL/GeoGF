import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

const minigames = MINIJUEGOS;

const removeAccents = (str) => {
  const accentMap = {
    á: "a", é: "e", í: "i", ó: "o", ú: "u",
    Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U",
  };
  return str.replace(/[áéíóúÁÉÍÓÚ]/g, (match) => accentMap[match] || match);
};

const formatGameNameForUrl = (gameName) => {
  return removeAccents(gameName)
    .toLowerCase()
    .replace(/\s+/g, "_");
};

const Markers = () => {
  return (
    <>
      {minigames.map((minigame, index) => (
        <Marker key={index} position={[minigame.geometry.coordinates[1], minigame.geometry.coordinates[0]]}>
          <Popup>
            <h3 className="text-lg font-bold">{minigame.nombre}</h3>
            <p className="text-sm text-gray-600">{minigame.descripcion}</p>
            <Link
              to={`/${formatGameNameForUrl(minigame.nombre)}`}
              className="mt-2 inline-block bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
            >
              Jugar
            </Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Markers;
