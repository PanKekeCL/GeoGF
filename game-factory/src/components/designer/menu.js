import React from 'react';
import { FaMobileAlt, FaMapMarkerAlt } from 'react-icons/fa';

function DiseñadorMenu({ openMinijuegoDesigner }) {
    const minijuegos = ['Minijuego 1', 'Minijuego 2', 'Minijuego 3']; // Puedes remplazar esto por datos dinámicos
    const proyectos = ['Proyecto 1', 'Proyecto 2', 'Proyecto 3'];

    return (
        <div className="flex justify-between space-x-4">
            {/* Lista de Minijuegos */}
            <div className="w-1/2 bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-bold mb-2">Minijuegos</h3>
                <ul className="space-y-2">
                    {minijuegos.map((minijuego, index) => (
                        <li key={index} className="p-2 border-b">{minijuego}</li>
                    ))}
                </ul>
                <button
                    className="mt-4 w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg"
                    onClick={openMinijuegoDesigner}
                >
                    <FaMobileAlt className="mr-2" />
                    Crear Minijuego
                </button>
            </div>

            {/* Lista de Proyectos */}
            <div className="w-1/2 bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-bold mb-2">Proyectos</h3>
                <ul className="space-y-2">
                    {proyectos.map((proyecto, index) => (
                        <li key={index} className="p-2 border-b">{proyecto}</li>
                    ))}
                </ul>
                <button
                    className="mt-4 w-full flex items-center justify-center bg-gray-500 text-white py-2 px-4 rounded-lg"
                    onClick={() => alert('Aún no disponible')}
                >
                    <FaMapMarkerAlt className="mr-2" />
                    Crear Proyecto
                </button>
            </div>
        </div>
    );
}

export default DiseñadorMenu;
