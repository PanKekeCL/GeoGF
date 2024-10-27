import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Designer = () => {
    const [activeTab, setActiveTab] = useState('Minijuegos');

    useEffect(() => {
        document.title = 'Diseñador - Game Factory';
    }, []);

    return (
        <div className="h-screen flex flex-col">

            <header className="flex justify-between items-center p-4 bg-white fixed top-0 w-full z-10 shadow-lg">
                <div className="space-x-4">
                    <Link to="/" className="text-2xl font-bold">Icono GeoGF</Link>
                    <button className="bg-blue-500 text-white font-bold rounded-md px-4 py-2">Guardar</button>
                </div>
                <div className="space-x-4">
                    <button className="border border-gray-300 rounded-md px-4 py-2">Iniciar sesión</button>
                    <button className="bg-green-500 text-white font-bold rounded-md px-4 py-2">Registrarme</button>
                </div>
            </header>

            <div className="mt-4 flex-grow pt-16">
                <div className="flex justify-center border-b-2 border-gray-200">
                    <button
                        className={`px-4 py-2 ${activeTab === 'Minijuegos' ? 'bg-white border-t-2 border-l-2 border-r-2 border-gray-200 rounded-t-md' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('Minijuegos')}
                    >
                        Minijuegos
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'Senderos' ? 'bg-white border-t-2 border-l-2 border-r-2 border-gray-200 rounded-t-md' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('Senderos')}
                    >
                        Senderos
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'General' ? 'bg-white border-t-2 border-l-2 border-r-2 border-gray-200 rounded-t-md' : 'bg-gray-200'}`}
                        onClick={() => setActiveTab('General')}
                    >
                        General
                    </button>
                </div>
                <div className="flex-grow p-4 bg-white border-l-2 border-r-2 border-b-2 border-gray-200 rounded-b-md">
                    {activeTab === 'Minijuegos' && (
                        <div className="flex h-full">
                            <div className="w-1/3 bg-gray-100 p-4">
                                <h2 className="font-bold text-center mb-2">Lista de Minijuegos</h2>
                                <ul>
                                    <li className="cursor-pointer">Archivo 1</li>
                                    <li className="cursor-pointer">Archivo 2</li>
                                    <li className="cursor-pointer">Archivo 3</li>
                                </ul>
                            </div>
                            <div className="w-1/3 p-4">
                                <h2 className="font-bold text-center mb-2">Configuración</h2>
                                <div className="mb-4">
                                    <label className="block mb-1">Nombre:</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded" />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Color:</label>
                                    <input type="color" className="w-full p-2 border border-gray-300 rounded" />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">Imagen:</label>
                                    <input type="file" className="w-full p-2 border border-gray-300 rounded" />
                                </div>
                            </div>
                            <div className="w-1/3 bg-gray-100 p-4">
                                <h2 className="font-bold text-center mb-2">Previsualización</h2>
                                <div className="w-full h-full bg-gray-200"></div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Senderos' && <div>Contenido de Senderos</div>}
                    {activeTab === 'General' && <div>Contenido de General</div>}
                </div>
            </div>
        </div>
    );
};

export default Designer;