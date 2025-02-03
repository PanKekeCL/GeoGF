import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BackIcon from '../assets/icons/backIcon';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const DesignsToBuild = ({ selectedMinigames = [], selectedProject = null, onBuild }) => {
  const [info, setInfo] = useState(null);

  return (
    <div className="flex flex-col h-full bg-white relative">

      {/* Encabezado */}
      <div className="flex items-center justify-between py-2 px-4 shadow">
        <Link to="/menu">
          <button className="h-10 w-10 bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center">
            <BackIcon color="#FFFFFF" size={25} />
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-gray-800">Diseños a construir</h1>
        <div className="h-12 w-12"></div> {/* Div transparente para centrar el título */}
      </div>

      {/* Popup de información */}
      {info && (
        <div
          className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg rounded-md p-4 z-50"
          style={{ width: '90%' }}
        >
          <p className="text-gray-700">Información sobre {info}</p>
          <button
            className="mt-2 text-blue-500 hover:underline"
            onClick={() => setInfo(null)}
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">

        {/* Proyecto seleccionado */}
        <div className="p-4 bg-white border rounded-md shadow">

          <div className="flex items-center justify-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mr-2">Proyecto</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => alert('Un proyecto cuenta con un mapa centrado en una ubicacion, y minijuegos que se muestran ubicados sobre el mapa.')}
            >
              ?
            </button>
          </div>

          {selectedProject ? (
            <div className="mt-2">
              <p className="nombre text-gray-800 font-semibold">
                {selectedProject?.nombre || "Sin título"}
              </p>

              <p className="descripcion text-gray-600 mt-1">
                {selectedProject?.descripcion
                  ? selectedProject.descripcion.length > 100
                    ? `${selectedProject.descripcion.substring(0, 100)}...`
                    : selectedProject.descripcion
                  : "Sin descripción"}
              </p>

              {/* Cantidad de minijuegos */}
              <p className="text-gray-700 mt-2">
                {selectedProject.minijuegos && selectedProject.minijuegos.length > 0
                  ? `${selectedProject.minijuegos.length} minijuegos`
                  : "Sin minijuegos"}
              </p>

              {/* Mapa Leaflet */}
              <div className="h-40 w-full mt-3 bg-gray-200 border flex items-center justify-center">
                {selectedProject.geometry?.coordinates ? (
                  <MapContainer
                    center={[
                      selectedProject.geometry.coordinates[1], // latitud
                      selectedProject.geometry.coordinates[0], // longitud
                    ]}
                    zoom={13}
                    style={{ width: '100%', height: '100%' }}
                    dragging={false}
                    zoomControl={false}
                    doubleClickZoom={false}
                    scrollWheelZoom={false}
                    boxZoom={false}
                    keyboard={false}
                    attributionControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[
                      selectedProject.geometry.coordinates[1], // latitud
                      selectedProject.geometry.coordinates[0], // longitud
                    ]}>
                      <Popup>{selectedProject.nombre}</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <p className="text-white">Sin coordenadas</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No has seleccionado un proyecto.</p>
          )}
        </div>

        {/* Minijuegos seleccionados */}
        <div className="p-4 border rounded-md shadow">

          <div className="flex items-center justify-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700 mr-2">Minijuegos</h2>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => alert('Estos minijuegos no se encuentran ubicados sobre el mapa, pero pueden ser accedidos a traves de un listado.')}
            >
              ?
            </button>
          </div>

          {selectedMinigames.length > 0 ? (
            <ul className="space-y-2">
              {selectedMinigames.map((minigame, index) => (
                <li
                  key={index}
                  className="p-3 bg-white rounded-md border hover:bg-gray-100"
                >
                  <p className="text-gray-800 font-semibold">
                    {minigame.nombre || "Sin título"}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {minigame.tipo || "Tipo no seleccionado"}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {minigame.descripcion
                      ? minigame.descripcion.length > 100
                        ? `${minigame.descripcion.substring(0, 100)}...`
                        : minigame.descripcion
                      : "Sin descripción"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No has seleccionado ningún minijuego.</p>
          )}
        </div>

      </div>

      {/* Botón "Construir" */}
      <div className="p-4 bg-white shadow">
        <button
          className={`w-full h-12 rounded-md font-semibold ${selectedProject || selectedMinigames.length > 0
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          disabled={!selectedProject && selectedMinigames.length === 0}
          onClick={onBuild}
        >
          Construir
        </button>
      </div>
    </div>
  );
};

export default DesignsToBuild;
