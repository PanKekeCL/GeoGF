import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Markers from "../components/markers";
import List from "../components/list";

const Map = () => {


    // Estado para mostrar u ocultar la lista
    const [isListVisible, setIsListVisible] = useState(false);

    // Coordenadas iniciales del mapa
    const initialPosition = [51.505, -0.09]; // Cambiar según tu necesidad

    return (
        <div className="relative w-full h-screen">
            {/* Mapa que ocupa toda la pantalla */}
            <MapContainer
                center={initialPosition}
                zoom={13}
                className="w-full h-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Markers />
            </MapContainer>

            {/* Botón flotante */}
            <button
                onClick={() => setIsListVisible(!isListVisible)}
                className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
            >
                {isListVisible ? "Cerrar Lista" : "Abrir Lista"}
            </button>

            {/* Componente de lista */}
            {isListVisible && (
                <div className="absolute inset-0 bg-white bg-opacity-90 z-10 overflow-y-auto">
                    <List />
                </div>
            )}
        </div>
    );
};

export default Map;
