import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { useApi } from "../hooks/useApi";
import SearchIcon from "../assets/icons/searchIcon";
import DeleteIcon from "../assets/icons/deleteIcon.js";
import EditIcon from "../assets/icons/editIcon.js";
import MinigameList from "./minigameList.js";
import ProjectList from "./projectList.js";

const YourDesigns = () => {
  const [minijuegos, setMinijuegos] = useState([]);  // Lista vacía por defecto
  const [proyectos, setProyectos] = useState([]);    // Lista vacía por defecto
  const [filteredMinijuegos, setFilteredMinijuegos] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [activeTab, setActiveTab] = useState("minijuegos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("nombre");
  const [hasFetched, setHasFetched] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { getMinijuegosByAdminID, getProyectosByAdminID, deleteMinijuegoByID, deleteProyectoByID } = useApi();

  useEffect(() => {
    if (!hasFetched) {
      const fetchMinijuegos = async () => {
        try {
          const minijuegos = await getMinijuegosByAdminID(user._id);
          if (minijuegos && minijuegos.length > 0) {
            setMinijuegos(minijuegos);
          } else {
            console.error('Minijuegos no encontrados');
            setMinijuegos([]); // Asegurar que minijuegos sea una lista vacía
          }
        } catch (error) {
          console.error('Error al obtener los minijuegos:', error);
          setMinijuegos([]); // Asegurar que minijuegos sea una lista vacía
        }
      };

      const fetchProyectos = async () => {
        try {
          const proyectos = await getProyectosByAdminID(user._id);
          if (proyectos && proyectos.length > 0) {
            setProyectos(proyectos);
          } else {
            console.error('Proyectos no encontrados');
            setProyectos([]); // Asegurar que proyectos sea una lista vacía
          }
        } catch (error) {
          console.error('Error al obtener los proyectos:', error);
          setProyectos([]); // Asegurar que proyectos sea una lista vacía
        }
      };

      fetchMinijuegos();
      fetchProyectos();
      setHasFetched(true);
    }
  }, [hasFetched, getMinijuegosByAdminID, getProyectosByAdminID, user._id]);

  useEffect(() => {
    const normalizedSearchTerm = removeAccents(searchTerm.toLowerCase());
  
    const filterAndSort = (items) => {
      return items
        .filter((item) => {
          const normalizedItemName = removeAccents(item.nombre?.toLowerCase() || "");
          return normalizedItemName.includes(normalizedSearchTerm);
        })
        .sort((a, b) => {
          if (sortBy === "nombre") {
            const nameA = a.nombre?.toLowerCase() || "";
            const nameB = b.nombre?.toLowerCase() || "";
            return sortOrder === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          } else if (sortBy === "fechaModificacion") {
            const fechaA = new Date(a.ultimaModificacion || 0);
            const fechaB = new Date(b.ultimaModificacion || 0);
            return sortOrder === "asc" ? fechaB - fechaA : fechaA - fechaB;
          }
          return 0;
        });
    };
  
    const filteredMinijuegos = filterAndSort(minijuegos || []);
    const filteredProyectos = filterAndSort(proyectos || []);
  
    setFilteredMinijuegos(filteredMinijuegos);
    setFilteredProyectos(filteredProyectos);
  }, [minijuegos, proyectos, searchTerm, sortBy, sortOrder]);
  

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleEditClick = (id, tipo_diseño) => {
    navigate(`/${tipo_diseño}?id=${id}`);
  };

  const handleDeleteClick = async (id_minijuego) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este minijuego?")) {
      try {
        await deleteMinijuegoByID(id_minijuego); // Llama al hook
        window.location.reload(); // Recarga la página
      } catch (error) {
        console.error("Error eliminando minijuego:", error);
        alert("Hubo un error al eliminar el minijuego. Inténtalo de nuevo.");
      }
    }
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  return (
    <div className="h-full space-y-6 bg-white">
      {/* Pestañas */}
      <div className="flex border-b w-full h-[10%]">
        <button
          onClick={() => handleTabClick('minijuegos')}
          className={`flex-1 p-5 mx-1 font-semibold ${activeTab === 'minijuegos'
            ? 'border-b-4 border-[#97F218]'
            : 'text-gray-400'
            }`}
        >
          Tus minijuegos
        </button>
        <button
          onClick={() => handleTabClick('proyectos')}
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

      {/* Lista de Minijuegos */}
      {activeTab === "minijuegos" && (
        <MinigameList
          items={Array.isArray(filteredMinijuegos) ? filteredMinijuegos : []}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      )}

      {/* Lista de Proyectos */}
      {activeTab === "proyectos" && (
        <ProjectList
          items={Array.isArray(filteredProyectos) ? filteredProyectos : []}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      )}
    </div>
  );
};

export default YourDesigns;
