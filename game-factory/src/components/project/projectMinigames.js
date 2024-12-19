import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MinigameSelector from "./minigameSelector"; // Importa el componente para la lista de selección
import MinigamePlacer from "./minigamePlacer"; // Importa el componente para la lista de ubicación

const ProjectMinigames = ({ selectedMinigames, handleMinigamesChange }) => {
    const [activeTab, setActiveTab] = useState("select");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="h-full space-y-6 bg-white">
            {/* Pestañas */}
            <div className="flex border-b w-full h-[10%]">
                <button
                    onClick={() => handleTabClick("select")}
                    className={`flex-1 p-5 mx-1 font-semibold ${activeTab === "select"
                            ? "border-b-4 border-[#97F218]"
                            : "text-gray-400"
                        }`}
                >
                    Seleccionar minijuegos
                </button>
                <button
                    onClick={() => handleTabClick("place")}
                    className={`flex-1 p-5 mx-1 font-semibold ${activeTab === "place"
                            ? "border-b-4 border-[#97F218]"
                            : "text-gray-400"
                        }`}
                >
                    Ubicar minijuegos
                </button>
            </div>

            {/* Lista de Minijuegos para seleccionar */}
            {activeTab === "select" && (
                <MinigameSelector
                    selectedMinigames={selectedMinigames}
                    handleMinigamesChange={handleMinigamesChange}
                />
            )}

            {/* Lista de Minijuegos seleccionados */}
            {activeTab === "place" && (
                <MinigamePlacer
                    selectedMinigames={selectedMinigames}
                    handleMinigamesChange={handleMinigamesChange}
                />
            )}
        </div>
    );
};

export default ProjectMinigames;
