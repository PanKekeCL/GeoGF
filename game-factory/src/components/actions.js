import React from 'react';
import { Link } from 'react-router-dom';
import AddIcon from '../assets/icons/addIcon';

const Actions = ({ minijuegosCount, proyectosCount }) => {
    return (
        <div className="h-full bg-white p-5 flex flex-col justify-between">

            <div className="flex flex-col space-y-4 w-full">
                {/* Botón para crear un nuevo minijuego */}
                <Link to="/minigame" className="w-full">
                    <button className="h-12 w-full bg-[#97F218] hover:bg-[#87d916] font-bold py-3 rounded-md text-center flex items-center justify-center">
                        <AddIcon color="#000000" size={24} className="mr-2" /> Crear un minijuego
                    </button>

                </Link>

                {/* Resumen de minijuegos */}
                <div className="text-gray-700 text-lg font-medium flex-grow flex justify-left">
                    
                </div>
            </div>


            <div className="flex flex-col space-y-4">
                {/* Botón para crear un nuevo proyecto (Desactivado y gris) */}
                <Link to="/project">
                    <button className="h-12 w-full bg-[#97F218] hover:bg-[#87d916] font-bold py-3 rounded-md text-center flex items-center justify-center">
                    <AddIcon color="#000000" size={24} className="mr-2" /> Crear un proyecto
                    </button>
                </Link>

                {/* Resumen de proyectos */}
                <div className="text-gray-700 text-lg font-medium text-left flex-grow flex justify-left">
                    
                </div>
            </div>

            {/* Botón para descargar */}
            <Link to="/download">
                <button className="h-12 w-full bg-[#2EA9E6] font-bold py-3 rounded-md hover:bg-blue-500">
                    Construir y Desplegar
                </button>
            </Link>
        </div>
    );
};

export default Actions;
