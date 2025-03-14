import React, { useState } from "react";
import DeleteIcon from "../assets/icons/deleteIcon.js";
import EditIcon from "../assets/icons/editIcon.js";
import BoxIcon from "../assets/icons/boxIcon.js";
import CrossIcon from "../assets/icons/crossIcon.js";
import CheckIcon from "../assets/icons/checkIcon.js";

const MinigameList = ({ items = [], loading, onEditClick, onDeleteClick, onSelectClick, selectedMinigames = [] }) => {

    const calcularTiempoTranscurrido = (fechaModificacion) => {
        const fecha = new Date(fechaModificacion);
        const ahora = new Date();
        const diferencia = ahora - fecha;
        const segundos = Math.floor(diferencia / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const días = Math.floor(horas / 24);
        const meses = Math.floor(días / 30);
        const años = Math.floor(días / 365);
        if (años > 0) return `hace ${años} año${años > 1 ? 's' : ''}`;
        if (meses > 0) return `hace ${meses} mes${meses > 1 ? 'es' : ''}`;
        if (días > 0) return `hace ${días} día${días > 1 ? 's' : ''}`;
        if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
        if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        if (segundos > 0) return `hace ${segundos} segundo${segundos > 1 ? 's' : ''}`;
        return "ahora";
    };
    
    return (
        <div className="flex items-top justify-center w-full max-h-[75%] px-5 overflow-auto mt-10">
            {loading ? (
                <p className="text-center">Cargando minijuegos...</p>
            ) : items.length === 0 ? (
                <p className="text-center">No se encontraron minijuegos.</p>
            ) : (
                <ul className="space-y-5 w-full">
                    {items.map((item, index) => (
                        <li
                            key={index}
                            className="p-4 w-full bg-white rounded-md shadow flex flex-row items-center space-x-4"
                        >
                            <div className="flex flex-row w-full h-full justify-between">
                                <div className="w-[15%]">
                                    <div className="w-24 h-16 bg-[#C8FACC] rounded-lg"></div>
                                </div>
                                <div className="w-[45%] flex flex-col space-y-1">
                                    <h3
                                        className={`font-semibold text-lg ${!item.nombre ? "text-gray-400" : "text-gray-800"
                                            }`}
                                    >
                                        {item.nombre && item.nombre.length > 40 ? `${item.nombre.slice(0,40)}...` : item.nombre || "Sin título"}
                                    </h3>
                                    <p
                                        className={`text-sm ${!item.tipo ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        {item.tipo || "Tipo no seleccionado"}
                                    </p>
                                    <p
                                        className={`text-xs ${!item.descripcion ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        {item.descripcion && item.descripcion.length > 120
                                            ? `${item.descripcion.slice(0, 120)}...`
                                            : item.descripcion || "Sin descripción"}
                                    </p>
                                </div>
                                <div className="w-[25%] text-xs text-gray-600 mt-3">
                                    <p>Páginas: {item.paginas ? item.paginas.length : 0}</p>
                                    <p>
                                        Última modificación:{" "}
                                        {calcularTiempoTranscurrido(item.ultimaModificacion)}
                                    </p>
                                </div>
                                <div className="w-[20%] justify-right flex gap-2 mt-3 ml-auto">
                                    {onEditClick && (
                                        <button
                                            className="w-12 h-12 py-2 bg-[#F2E018] hover:bg-[#D9C816] text-white rounded-md flex items-center justify-center"
                                            onClick={() => onEditClick(item._id, "minigame")}
                                        >
                                            <EditIcon color="#FFFFFF" size={24} />
                                        </button>
                                    )}
                                    {onDeleteClick && (
                                        <button
                                            className="w-12 h-12 py-2 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                                            onClick={() => onDeleteClick(item._id)}
                                        >
                                            <DeleteIcon color="#FFFFFF" size={24} />
                                        </button>
                                    )}
                                    
                                    {onSelectClick && (
                                        <button
                                            className={`w-12 h-12 py-2 text-white rounded-md flex items-center justify-center border  ${selectedMinigames?.some((minigame) => minigame._id === item._id)
                                                ? "bg-blue-500 hover:bg-blue-700 border-blue-700"
                                                : "bg-[#FFFFFF] hover:bg-[#EEEEEE] border-gray-300"
                                                }`}
                                            onClick={() => onSelectClick(item._id)}
                                        >
                                            {selectedMinigames?.some((minigame) => minigame._id === item._id) ? (
                                                <CheckIcon color="#FFFFFF" size={25} />
                                            ) : (
                                                <CheckIcon color="#FFFFFF" size={25} />
                                                // <CrossIcon color="#BBBBBB" size={24} />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MinigameList;
