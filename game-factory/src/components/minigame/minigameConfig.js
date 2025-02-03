import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackIcon from '../../assets/icons/backIcon';
import SaveIcon from '../../assets/icons/saveIcon';

const MinigameConfig = ({ data = {}, handleConfigChange, handleSubmit, moveMapTo }) => {
    const [config, setConfig] = useState({
        nombre: '',
        descripcion: '',
        tipo: '',
        mezclarPaginas: false,
        paleta: '',
    });

    useEffect(() => {
        if (data) {
            setConfig((prevConfig) => ({
                ...prevConfig,
                nombre: data.nombre || '',
                descripcion: data.descripcion || '',
                tipo: data.tipo || '',
                mezclarPaginas: data.mezclarPaginas || false,
                paleta: data.paleta || '',
            }));
        }
    }, [data]);

    // Manejar cambios en cualquier campo del formulario
    const handleInputChange = (e, field) => {
        const { type, value, checked } = e.target;
        const updatedConfig = {
            ...config,
            [field]: type === 'checkbox' ? checked : value,
        };
        setConfig(updatedConfig);
        handleConfigChange(updatedConfig); // Usar el objeto actualizado
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleSubmit(config);
    };

    return (
        <div className="h-full bg-white p-5 flex flex-col">
            {/* Botón para volver */}
            <div className="grid grid-cols-[auto_1fr] items-center mb-4 gap-4">
                <Link to="/menu">
                    <button className="h-12 w-12 bg-blue-500 rounded-md hover:bg-blue-600 flex items-center justify-center">
                        <BackIcon color="#FFFFFF" size={30} />
                    </button>
                </Link>
                <h1 className="text-center text-xl font-semibold">Configuración del Minijuego</h1>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-gray-800 font-medium">
                        Título:
                    </label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={config.nombre}
                        onChange={(e) => handleInputChange(e, 'nombre')}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Añade un título a tu minijuego"
                    />
                </div>

                <div>
                    <label htmlFor="descripcion" className="text-gray-800 font-medium">
                        Descripción:
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={config.descripcion}
                        onChange={(e) => handleInputChange(e, 'descripcion')}
                        rows="5"
                        className="w-full p-2 border border-gray-300 rounded-md resize-none overflow-y-auto"
                        placeholder="Añade una descripción a tu minijuego"
                    />
                </div>

                <div>
                    <label htmlFor="tipo" className="block text-gray-800 font-medium">
                        Tipo de minijuego:
                    </label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={config.tipo}
                        onChange={(e) => handleInputChange(e, 'tipo')}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Selecciona un tipo de minijuego</option>
                        <option value="Trivia">Trivia</option>
                        <option value="Emparejar">Emparejar</option>
                        <option value="Ordenar">Ordenar</option>
                    </select>
                </div>

                <div className="flex items-start space-x-2">
                    <label htmlFor="mezclar" className="text-gray-800 font-medium">
                        ¿Mezclar orden de las páginas?
                    </label>
                    <input
                        type="checkbox"
                        id="mezclar"
                        name="mezclarPaginas"
                        checked={config.mezclarPaginas}
                        onChange={(e) => handleInputChange(e, 'mezclarPaginas')}
                        className="form-checkbox h-6 w-6 mt-0.5"
                    />
                </div>

                <div>
                    <label htmlFor="paleta" className="text-gray-800 font-medium">
                        Paleta de colores:
                    </label>
                    <select
                        id="paleta"
                        name="paleta"
                        value={config.paleta}
                        onChange={(e) => handleInputChange(e, 'paleta')}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccione una paleta de colores</option>
                        <option value="Verano">Verano</option>
                        <option value="Otoño">Otoño</option>
                        <option value="Invierno">Invierno</option>
                        <option value="Primavera">Primavera</option>
                    </select>
                </div>

                {/* Botón para aplicar cambios */}
                <button
                    type="submit"
                    className="mt-6 w-full bg-[#97F218] font-bold py-3 rounded-md hover:bg-[#87d916] flex items-center justify-center space-x-2"
                >
                    <SaveIcon color="#222222" size={30} />
                    <span>Guardar cambios a Minijuego</span>
                </button>
            </form>
        </div>
    );
};

export default MinigameConfig;
