import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Solución para el ícono por defecto de Leaflet
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const PlaceOnMap = ({ initialLat, initialLng, onConfirm, onCancel }) => {
  const [position, setPosition] = useState({
    lat: initialLat || -39.814,
    lng: initialLng || -73.247,
  });

  const handleMapClick = (e) => {
    setPosition(e.latlng);
  };

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          className="h-96 w-full"
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <MapEvents />
          <Marker
            draggable
            position={[position.lat, position.lng]}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const newPosition = marker.getLatLng();
                setPosition(newPosition);
              },
            }}
          ></Marker>
        </MapContainer>

        <div className="mt-4 flex justify-between">
          <button
            onClick={() => onConfirm(position)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirmar Ubicación
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOnMap;
