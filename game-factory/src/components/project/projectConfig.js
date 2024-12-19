import React, { useState, useEffect } from "react"; 
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import BackIcon from "../../assets/icons/backIcon";

const ProjectConfig = ({ data, handleConfigChange, handleSubmit }) => {
    const [config, setConfig] = useState({
        nombre: "",
        descripcion: "",
        latitud: -39.814, // Coordenadas iniciales para Valdivia
        longitud: -73.247,
    });

    useEffect(() => {
        if (data) {
            setConfig((prevConfig) => ({
                ...prevConfig,
                nombre: data.nombre || "",
                descripcion: data.descripcion || "",
                latitud: data.latitud || -39.814,
                longitud: data.longitud || -73.247,
            }));
        }
    }, [data]);

    // Función para calcular el promedio de las coordenadas, solo con coordenadas válidas
    const calculateAverageCoordinates = (minigames) => {
        const validMinigames = minigames.filter((minigame) => {
            // Verificamos si `geometry` y `coordinates` existen y son válidos
            return (
                minigame.geometry &&
                minigame.geometry.coordinates &&
                Array.isArray(minigame.geometry.coordinates) &&
                !isNaN(minigame.geometry.coordinates[0]) &&
                !isNaN(minigame.geometry.coordinates[1])
            );
        });

        if (validMinigames.length === 0) return { lat: -39.814, lng: -73.247 }; // Coordenadas por defecto si no hay minijuegos válidos

        const totalLat = validMinigames.reduce((acc, minigame) => acc + minigame.geometry.coordinates[1], 0);
        const totalLng = validMinigames.reduce((acc, minigame) => acc + minigame.geometry.coordinates[0], 0);

        return {
            lat: totalLat / validMinigames.length,
            lng: totalLng / validMinigames.length
        };
    };

    const [minigamesLocation, setMinigamesLocation] = useState({ lat: -39.814, lng: -73.247 });

    useEffect(() => {
        if (data && data.minijuegos && data.minijuegos.length > 0) {
            const averageCoords = calculateAverageCoordinates(data.minijuegos);
            setMinigamesLocation(averageCoords);
        }
    }, [data]);

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        const updatedConfig = {
            ...config,
            [field]: value,
        };
        setConfig(updatedConfig);
        handleConfigChange(updatedConfig);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleSubmit(config);
    };

    return (
        <div className="h-full bg-white p-5 flex flex-col">
            <div className="grid grid-cols-[auto_1fr] items-center mb-4 gap-4">
                <Link to="/menu">
                    <button className="h-12 w-12 bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center">
                        <BackIcon color="#FFFFFF" size={30} />
                    </button>
                </Link>
                <h1 className="text-center text-xl font-semibold mb-4">Configuración del Proyecto</h1>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-gray-800 font-medium">
                        Nombre del Proyecto:
                    </label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={config.nombre}
                        onChange={(e) => handleInputChange(e, "nombre")}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Nombre del proyecto"
                    />
                </div>

                <div>
                    <label htmlFor="descripcion" className="block text-gray-800 font-medium">
                        Descripción:
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={config.descripcion}
                        onChange={(e) => handleInputChange(e, "descripcion")}
                        rows="2"
                        className="w-full p-2 border border-gray-300 rounded-md resize-none overflow-y-auto"
                        placeholder="Descripción del proyecto"
                    />
                </div>

                <div className="mb-4" style={{ height: "38vh", minHeight: "128px" }}>
                    <MapContainer
                        center={[minigamesLocation.lat, minigamesLocation.lng]}
                        zoom={14}
                        style={{ height: "100%", width: "100%" }}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        {data?.minijuegos?.map((minigame, index) => {
                            // Verificamos si `geometry` y `coordinates` existen y son válidos antes de crear el marcador
                            const lat = minigame.geometry?.coordinates ? minigame.geometry.coordinates[1] : null;
                            const lng = minigame.geometry?.coordinates ? minigame.geometry.coordinates[0] : null;
                            
                            if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
                                return <Marker key={index} position={[lat, lng]} />;
                            }
                            return null; // No crear marcador si las coordenadas no son válidas o están vacías
                        })}
                    </MapContainer>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-blue-500 text-white font-bold py-3 rounded-md hover:bg-blue-600"
                >
                    Guardar Configuración
                </button>
            </form>
        </div>
    );
};

export default ProjectConfig;
