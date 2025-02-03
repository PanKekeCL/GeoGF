import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import BackIcon from "../../assets/icons/backIcon";
import PinIcon from "../../assets/icons/pinIcon";
import SaveIcon from "../../assets/icons/saveIcon";
import PlaceOnMap from "./placeOnMap";

const ProjectConfig = ({ data, handleConfigChange, handleSubmit }) => {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [config, setConfig] = useState({
        nombre: "",
        descripcion: "",
        geometry: {
            type: "Point",
            coordinates: [-73.247, -39.814]
        }
    });

    useEffect(() => {
        if (data) {
            setConfig((prevConfig) => ({
                ...prevConfig,
                nombre: data.nombre || "",
                descripcion: data.descripcion || "",
                geometry: {
                    ...prevConfig.geometry,
                    coordinates: [
                        data.geometry?.coordinates[0] || -73.247,
                        data.geometry?.coordinates[1] || -39.814
                    ]
                }
            }));
        }
    }, [data]);

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        let updatedConfig;

        if (field === "latitude" || field === "longitude") {
            const index = field === "latitude" ? 1 : 0;
            const newCoordinates = [...config.geometry.coordinates];
            newCoordinates[index] = parseFloat(value) || 0;

            updatedConfig = {
                ...config,
                geometry: {
                    ...config.geometry,
                    coordinates: newCoordinates
                }
            };
        } else {
            updatedConfig = {
                ...config,
                [field]: value,
            };
        }

        setConfig(updatedConfig);
        handleConfigChange(updatedConfig);
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleSubmit(config);
    };

    const handleConfirmLocation = (position) => {
        setConfig({
            ...config,
            geometry: {
                ...config.geometry,
                coordinates: [position.lng, position.lat]
            }
        });
        setIsMapOpen(false);
    };

    const handleCancelLocation = () => {
        setIsMapOpen(false);
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

            <form onSubmit={handleSubmitForm} className="space-y-2">
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

                <div>
                    <label htmlFor="ubicacion" className="block text-gray-800 font-medium">
                        Ubicación:
                    </label>
                    <div className="flex space-x-2">
                        <input
                            id="latitude"
                            name="latitude"
                            type="number"
                            step="any"
                            value={config.geometry.coordinates[1]}
                            onChange={(e) => handleInputChange(e, "latitude")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Latitud"
                        />
                        <input
                            id="longitude"
                            name="longitude"
                            type="number"
                            step="any"
                            value={config.geometry.coordinates[0]}
                            onChange={(e) => handleInputChange(e, "longitude")}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Longitud"
                        />
                        <button
                            type="button"
                            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                            onClick={() => setIsMapOpen(!isMapOpen)}
                        >
                            <PinIcon />
                        </button>
                    </div>
                </div>

                <div style={{ height: "30vh", minHeight: "100px" }}>
                    <MapContainer
                        center={[config.geometry.coordinates[1], config.geometry.coordinates[0]]}
                        zoom={14}
                        style={{ height: "100%", width: "100%" }}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                        />
                        <Marker position={[config.geometry.coordinates[1], config.geometry.coordinates[0]]} />
                        {data?.minijuegos?.map((minigame, index) => {
                            const lat = minigame.geometry?.coordinates ? minigame.geometry.coordinates[1] : null;
                            const lng = minigame.geometry?.coordinates ? minigame.geometry.coordinates[0] : null;

                            if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
                                return <Marker key={index} position={[lat, lng]} />;
                            }
                            return null;
                        })}
                    </MapContainer>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-[#97F218] font-bold py-3 rounded-md hover:bg-[#87d916] flex items-center justify-center space-x-2"
                >
                    <SaveIcon color="#222222" size={30} />
                    Guardar cambios a Proyecto
                </button>
            </form>
            {isMapOpen && (
                    <PlaceOnMap
                        initialLat={config.geometry.coordinates[1]}
                        initialLng={config.geometry.coordinates[0]}
                        onConfirm={handleConfirmLocation}
                        onCancel={handleCancelLocation}
                    />
                )}
        </div>
    );
};

export default ProjectConfig;
