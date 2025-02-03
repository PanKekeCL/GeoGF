import React, { useState } from 'react';
import SearchIcon from '../assets/icons/searchIcon';
import MinigameList from './minigameList';
import ProjectList from './projectList';

const BuildableDesigns = ({ minigames, projects, selectedMinigames = [], selectedProject = null, onSelectMinigame, onSelectProject }) => {
  const [activeTab, setActiveTab] = useState('proyectos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Filtrar y ordenar los ítems según la pestaña activa
  const filteredItems = (activeTab === 'minijuegos' ? minigames : projects)
    .filter((item) => 
      removeAccents(item.nombre.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'nombre') {
        return sortOrder === 'asc' ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre);
      } else if (sortBy === 'fecha') {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

  return (
    <div className="h-full space-y-6 bg-white">
      {/* Pestañas */}
      <div className="flex border-b w-full h-[10%]">
        <button
          onClick={() => setActiveTab('minijuegos')}
          className={`flex-1 p-5 mx-1 font-semibold ${activeTab === 'minijuegos'
            ? 'border-b-4 border-[#97F218]'
            : 'text-gray-400'
          }`}
        >
          Tus minijuegos
        </button>
        <button
          onClick={() => setActiveTab('proyectos')}
          className={`flex-1 p-5 mx-1 font-semibold ${activeTab === 'proyectos'
            ? 'border-b-4 border-[#97F218]'
            : 'text-gray-400'
          }`}
        >
          Tus proyectos
        </button>
      </div>

      {/* Buscador y Filtros */}
      <div className="flex px-5 space-x-4 items-center" style={{ height: '5%' }}>
        <div className="flex items-center bg-white border border-gray-200 rounded-full p-3 flex-grow gap-2">
          <SearchIcon color="#9ca3af" size={20} />
          <input
            type="text"
            className="flex-grow focus:outline-none text-gray-800"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center w-1/3 gap-2">
          <span className="font-medium text-gray-700 mr-2">Ordenar:</span>
          <select
            className="p-2 border border-gray-300 rounded-md"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nombre">Alfabéticamente</option>
            <option value="fecha">Más recientes</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
          >
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        </div>
      </div>

      {/* Lista de Minijuegos */}
      {activeTab === "minijuegos" && (
        <MinigameList
          items={filteredItems}
          selectedMinigames={selectedMinigames}
          onSelectClick={onSelectMinigame}
        />
      )}

      {/* Lista de Proyectos */}
      {activeTab === "proyectos" && (
        <ProjectList
          items={filteredItems}
          selectedProject={selectedProject}
          onSelectClick={onSelectProject}
        />
      )}
    </div>
  );
};

export default BuildableDesigns;
