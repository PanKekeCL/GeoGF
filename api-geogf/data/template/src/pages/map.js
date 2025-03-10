import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Markers from "../components/markers";
import { useNavigate } from "react-router-dom";
import List from "./list";
import GameIcon from "../assets/icons/gameIcon";

const initialPosition = [LATITUD, LONGITUD];

const MapComponent = () => {
    const map = useMap();
  
    useEffect(() => {
      // Se revalida el tamaño del mapa luego de un breve retardo
      setTimeout(() => {
        map.invalidateSize();
      }, 400);
    }, [map]);
  
    return null;
  };
  
  const Map = () => {
    const navigate = useNavigate();
  
    return (
      <div className="relative w-full h-screen overflow-hidden">
        <MapContainer
          center={initialPosition}
          zoom={17}
          className="w-full h-full relative"
          attributionControl={false}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Markers />
          <MapComponent />
        </MapContainer>
  
        {/* Botón para ir a la lista de minijuegos */}
        <button
          onClick={() => navigate("/list")}
          className="z-[999] h-14 w-14 flex items-center justify-center absolute bottom-4 right-4 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none"
        >
          <GameIcon />
        </button>
      </div>
    );
  };
  
  export default Map;
