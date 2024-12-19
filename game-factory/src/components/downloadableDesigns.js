import React, { useState } from 'react';
import minijuegosData from '../assets/data/testData';
import SearchIcon from '../assets/icons/searchIcon';

const DownloadableDesigns = ({ proyectos, onSelectItem }) => {
  const [activeTab, setActiveTab] = useState('minijuegos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');

  // Filtrar y ordenar los items
  // Filtrar y ordenar los items
  const filteredItems = (activeTab === 'minijuegos' ? minijuegosData : proyectos)
    .filter((item) => item.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'nombre') {
        return sortOrder === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre);
      } else if (sortBy === 'fecha') {
        const dateA = new Date(a.fecha); // Asegúrate de que 'a.fecha' sea una cadena de fecha o un objeto Date.
        const dateB = new Date(b.fecha);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });


  const handleSelectItem = (item) => {
    item.isSelected = !item.isSelected;
    onSelectItem(item); // Compatibilidad
  };

  return (
    <div className="flex flex-col h-full bg-white">

      {/* Pestañas */}
      <div className="flex border-b h-[10%]">
        <button
          onClick={() => setActiveTab('minijuegos')}
          className={`flex-1 p-3 font-semibold ${activeTab === 'minijuegos' ? 'border-b-4 border-[#97F218]' : 'text-gray-400'}`}
        >
          Tus minijuegos
        </button>
        <button
          disabled
          // onClick={() => setActiveTab('proyectos')}
          className={`flex-1 p-3 cursor-not-allowed font-semibold ${activeTab === 'proyectos' ? 'border-b-4 border-[#97F218]' : 'text-gray-400'}`}
        >
          Tus proyectos
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex px-5 space-x-4 items-center my-4">

        {/* Buscador */}
        <div className="flex items-center bg-white border border-gray-200 rounded-full p-3 flex-grow gap-2">

          {/* Icono */}
          <SearchIcon color="#9ca3af" size={20} />

          {/* Icono */}
          <input type="text" className="flex-grow focus:outline-none text-gray-800" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        
        </div>

        {/* Ordenar por tipo */}
        <div className="relative">
          <select
            className="p-2 border border-gray-300 rounded-md bg-white text-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nombre">Alfabéticamente</option>
            <option value="fecha">Más recientes</option>
          </select>
        </div>

        {/* Orden de ordenación */}
        <div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border rounded-md bg-gray-100 text-gray-700"
          >
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {/* Lista de Minijuegos con Overflow */}
      <div className="w-full max-h-[68%] overflow-y-auto px-5" style={{ maxHeight: '78%' }}>
        <ul className="space-y-5"> {/* Usamos space-y-5 para el espacio entre los <li> */}
          {filteredItems.map((item, index) => (
            <li key={index} className="p-4 w-full bg-white rounded-md shadow flex flex-row items-center space-x-4">

              <div className="flex flex-row w-full h-full justify-between">

                {/* Eventualmente habrá una imagen */}
                <div className="h-16 w-24 bg-[#C8FACC] rounded-lg">
                </div>

                {/* Título, tipo y descripción */}
                <div className="flex flex-col space-y-1 w-[50%]">
                  <h3 className="font-semibold text-lg">{item.nombre}</h3>
                  <span className="text-gray-500 text-sm">{item.tipo}</span>
                  <p className="text-gray-600 text-xs">Descripción: {item.descripcion || "No disponible"}</p>
                </div>

                {/* Cantidad de páginas y última modificación */}
                <div className="text-xs text-gray-600 mt-3">
                  <p>Páginas: {item.paginas ? item.paginas.length : 0}</p>
                  <p>Última modificación: {item.ultimaModificacion}</p>
                </div>

                {/* Boton de descarga */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleSelectItem(item)}
                    className={`w-12 h-12 py-2 ${item.isSelected ? 'bg-[#2EA9E6]' : 'border border- gray-200 bg-white'} text-white rounded-md`}>
                    {/* Contenido del botón */}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default DownloadableDesigns;
