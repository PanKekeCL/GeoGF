import React, { useState, useEffect } from "react";
import SearchIcon from "../../assets/icons/searchIcon.js";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../context/useAuth";
import AddIcon from "../../assets/icons/addIcon.js";
import CheckIcon from "../../assets/icons/checkIcon.js";

const MinigameSelector = ({ selectedMinigames = [], handleMinigamesChange }) => {
    const { user } = useAuth();
    const { getMinigamesByAdminID } = useApi();
    const [allMinigames, setAllMinigames] = useState([]);
    const [hasFetched, setHasFetched] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("nombre");
    const [sortOrder, setSortOrder] = useState("asc");

    // Al iniciar el componente, busca todos los minijuegos creados por el usuario.
    useEffect(() => {
        if (!hasFetched) {
            const fetchMinijuegos = async () => {
                try {
                    const minijuegos = await getMinigamesByAdminID(user._id);
                    setAllMinigames(minijuegos || []);
                } catch (error) {
                    console.error("Error al obtener los minijuegos:", error);
                }
            };
            fetchMinijuegos();
            setHasFetched(true);
        }
    }, [hasFetched, getMinigamesByAdminID, user._id]);

    const filteredMinigames = allMinigames
        .filter((minigame) =>
            minigame.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "nombre") {
                return sortOrder === "asc"
                    ? a.nombre.localeCompare(b.nombre)
                    : b.nombre.localeCompare(a.nombre);
            } else if (sortBy === "fechaModificacion") {
                const fechaA = new Date(a.ultimaModificacion || 0);
                const fechaB = new Date(b.ultimaModificacion || 0);
                return sortOrder === "asc" ? fechaA - fechaB : fechaB - fechaA;
            }
            return 0;
        });

    const handleMinigameToggle = (minigame) => {
        const isAlreadySelected = selectedMinigames.some(
            (item) => item._id === minigame._id
        );

        let updatedMinigames;

        if (isAlreadySelected) {
            // Deseleccionar minijuego
            updatedMinigames = selectedMinigames.filter(
                (item) => item._id !== minigame._id
            );
        } else {
            // Copia y añade la información del minijuego al proyecto.
            const newMinigame = {
                _id: minigame._id,
                nombre: minigame.nombre,
                descripcion: minigame.descripcion,
                tipo: minigame.tipo,
                geometry: minigame.geometry || {},
                paginas: minigame.paginas || [],
                mezclarPaginas: minigame.mezclarPaginas || false,
                paleta: minigame.paleta
            };
            updatedMinigames = [...selectedMinigames, newMinigame];
        }
        handleMinigamesChange(updatedMinigames);
    };

    return (
        <div>
            <div className="flex px-5 space-x-4 items-center" style={{ height: "5%" }}>
                <div className="flex items-center bg-white border border-gray-200 rounded-full p-3 flex-grow gap-2">
                    <SearchIcon color="#9ca3af" size={20} />
                    <input
                        type="text"
                        className="flex-grow focus:outline-none text-gray-800"
                        placeholder="Buscar minijuegos"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <select
                        className="p-2 border border-gray-300 rounded-md"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="nombre">Alfabéticamente</option>
                        <option value="fechaModificacion">Recientemente</option>
                    </select>
                    <select
                        className="p-2 border border-gray-300 rounded-md"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="asc">ASC</option>
                        <option value="desc">DESC</option>
                    </select>
                </div>
            </div>

            <ul className="mt-4">
                {filteredMinigames.map((minigame) => (
                    <li
                        key={minigame._id}
                        className="rounded flex items-center justify-between border p-4 m-4"
                    >
                        {/* Imagen */}
                        <div className="w-[15%]">
                            <div className="w-24 h-16 bg-[#C8FACC] rounded-lg"></div>
                        </div>

                        {/* Texto principal */}
                        <div className="w-[45%] flex flex-col space-y-1">
                            <h3
                                className={`font-semibold text-lg ${!minigame.nombre ? "text-gray-400" : "text-gray-800"}`}
                            >
                                {minigame.nombre || "Sin título"}
                            </h3>
                            <p
                                className={`text-sm ${!minigame.tipo ? "text-gray-400" : "text-gray-600"}`}
                            >
                                {minigame.tipo || "Tipo no seleccionado"}
                            </p>
                            <p
                                className={`text-xs ${!minigame.descripcion ? "text-gray-400" : "text-gray-600"}`}
                            >
                                {minigame.descripcion && minigame.descripcion.length > 150
                                    ? `${minigame.descripcion.slice(0, 150)}...`
                                    : minigame.descripcion || "Sin descripción"}
                            </p>
                        </div>

                        {/* Texto secundario */}
                        <div className="w-[25%] text-xs text-gray-600 mt-3"></div>

                        {/* Botones */}
                        <div className="ml-auto flex gap-2">
                            <button
                                onClick={() => handleMinigameToggle(minigame)}
                                className={`h-12 w-12 flex items-center justify-center rounded ${selectedMinigames.some((item) => item._id === minigame._id)
                                    ? "bg-blue-500 text-white"
                                    : "bg-white border border-blue-500 text-blue-500"}`}
                            >
                                {selectedMinigames.some((item) => item._id === minigame._id)
                                    ? <CheckIcon />
                                    : <AddIcon />}
                            </button>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default MinigameSelector;
