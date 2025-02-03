import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { useApi } from "../hooks/useApi";
import SearchIcon from "../assets/icons/searchIcon";
import MinigameList from "./minigameList.js";
import ProjectList from "./projectList.js";

const YourDesigns = () => {
  const [minijuegos, setMinijuegos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [filteredMinijuegos, setFilteredMinijuegos] = useState([]);
  const [filteredProyectos, setFilteredProyectos] = useState([]);
  const [activeTab, setActiveTab] = useState("minijuegos");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [hasFetched, setHasFetched] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { getMinigamesByAdminID, getProjectsByAdminID, deleteMinigameByID, deleteProjectByID } = useApi();

  useEffect(() => {
    if (!hasFetched) {
      const fetchMinijuegos = async () => {
        try {
          const minijuegos = await getMinigamesByAdminID(user._id);
          setMinijuegos(minijuegos || []);
        } catch (error) {
          console.error('Error al obtener los minijuegos:', error);
          setMinijuegos([]);
        }
      };

      const fetchProyectos = async () => {
        try {
          const proyectos = await getProjectsByAdminID(user._id);
          setProyectos(proyectos || []);
        } catch (error) {
          console.error('Error al obtener los proyectos:', error);
          setProyectos([]);
        }
      };

      fetchMinijuegos();
      fetchProyectos();
      setHasFetched(true);
    }
  }, [hasFetched, getMinigamesByAdminID, getProjectsByAdminID, user._id]);

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
            return a.nombre.localeCompare(b.nombre);
          } else if (sortBy === "fechaModificacion") {
            return new Date(b.ultimaModificacion) - new Date(a.ultimaModificacion);
          }
          return 0;
        });
    };

    setFilteredMinijuegos(filterAndSort(minijuegos));
    setFilteredProyectos(filterAndSort(proyectos));
  }, [minijuegos, proyectos, searchTerm, sortBy]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleEditClick = (id, tipo_diseño) => {
    navigate(`/${tipo_diseño}?id=${id}`);
  };

  const handleDeleteMinigame = async (id_minijuego) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este minijuego?")) {
      try {
        await deleteMinigameByID(id_minijuego);
        window.location.reload();
      } catch (error) {
        console.error("Error eliminando minijuego:", error);
        alert("Hubo un error al eliminar el minijuego. Inténtalo de nuevo.");
      }
    }
  };

  const handleDeleteProject = async (id_proyecto) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      try {
        await deleteProjectByID(id_proyecto);
        window.location.reload();
      } catch (error) {
        console.error("Error eliminando proyecto:", error);
        alert("Hubo un error al eliminar el proyecto. Inténtalo de nuevo.");
      }
    }
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  return (
    <div className="h-full space-y-6 bg-white">
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
        </div>
      </div>

      {activeTab === "minijuegos" && (
        <MinigameList
          items={Array.isArray(filteredMinijuegos) ? filteredMinijuegos : []}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteMinigame}
        />
      )}

      {activeTab === "proyectos" && (
        <ProjectList
          items={Array.isArray(filteredProyectos) ? filteredProyectos : []}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteProject}
        />
      )}
    </div>
  );
};

export default YourDesigns;
