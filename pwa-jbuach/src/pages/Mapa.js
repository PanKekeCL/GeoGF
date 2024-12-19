// src/pages/Mapa.js

import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Marcadores from '../components/Marcadores';
import ListaMinijuegos from '../components/ListaMinijuegos';

function Mapa() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const centro = [-39.8043, -73.2503];
  const rango = 100;
  const limites = [
    [centro[0] - rango, centro[1] - rango], // Sur-Oeste
    [centro[0] + rango, centro[1] + rango], // Norte-Este
  ];

  const json = [
    { id: 1, title: 'Marcador 1', lat: -39.805662478747834, lng: -73.25185035424292 },
    { id: 2, title: 'Marcador 2', lat: -39.810, lng: -73.245 },
    { id: 3, title: 'Marcador 3', lat: -39.8105, lng: -73.240 },
  ];

  return (
    <div className="h-screen relative">
      <MapContainer
        attributionControl={false}
        zoomControl={false}
        center={centro}
        zoom={18}
        className="w-full h-full"
        maxBounds={limites} // Limita los movimientos del mapa
        maxBoundsViscosity={1.0} // Pegajoso en los límites
        minZoom={18} // Zoom mínimo
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marcadores />

        {/* Mostrar otros marcadores */}
        <Marcadores data={json} />
      </MapContainer>

      {/* Botón para abrir el menú */}
      <button
        onClick={() => setMenuOpen(true)}
        className="z-[999] absolute bottom-5 right-5 border-gray-800 bg-white text-black p-4 rounded-full shadow-lg"
      >
        🎮
      </button>

      {/* Lista de Minijuegos */}
      <ListaMinijuegos isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}

export default Mapa;
