import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import PlayIcon from "../assets/icons/playIcon";

const minigames = MINIJUEGOS;

const removeAccents = (str) => {
  const accentMap = {
    á: "a", é: "e", í: "i", ó: "o", ú: "u",
    Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U",
  };
  return str.replace(/[áéíóúÁÉÍÓÚ]/g, (match) => accentMap[match] || match);
};

const formatGameName = (gameName) => {
  return removeAccents(gameName)
    .toLowerCase()
    .replace(/\s+/g, "_");
};

const customIcon = L.icon({
  iconUrl: require("../assets/icons/marker.png"), // Ruta a la imagen
  iconSize: [40, 55], // Tamaño del icono en el mapa
  iconAnchor: [20, 55], // Punto de anclaje desde esquina superior izquierda (centro inferior)
  popupAnchor: [0, -55], // Posicion del popup desde punto de anclaje (centro superior)
});

const Markers = () => {
  return (
    <>
      {minigames.map((minigame, index) => (
        <Marker key={index} position={[minigame.geometry.coordinates[1], minigame.geometry.coordinates[0]]} icon={customIcon}>
          <Popup >
            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left space-y-0">
                <h2 className="text-lg font-semibold">{minigame.nombre}</h2>
                <p className="text-sm text-gray-600">{minigame.descripcion}</p>
              </div>
              <div className="h-12 w-12 bg-lime-500 text-white p-2 rounded-md hover:bg-lime-600">
                <Link to={`/minigames/${formatGameName(minigame.nombre)}`}>
                  <PlayIcon color="#FFFFFF" />
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Markers;