import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import DesignsToBuild from '../components/designsToBuild';
import BuildableDesigns from '../components/buildableDesigns';
import { useAuth } from '../context/useAuth';
import { useApi } from '../hooks/useApi';

const Build = () => {
  // Data proveniente de la API
  const [minigames, setMinigames] = useState([]);
  const [projects, setProjects] = useState([]);

  // Data seleccionada para construir
  const [selectedMinigames, setSelectedMinigames] = useState([]); // Maneja varios minijuegos.
  const [selectedProject, setSelectedProject] = useState(null); // Maneja un solo proyecto.

  // COtras constantes y funciones
  const [hasFetched, setHasFetched] = useState(false);
  const { getMinigamesByAdminID, getProjectsByAdminID, buildProject } = useApi(); // Obtén las funciones de la API
  const { user } = useAuth();
  const userID = user._id

  // Buscar la Data desde la API al cargar la pagina.
  useEffect(() => {
    if (userID && !hasFetched) {
      const fetchData = async () => {
        try {
          const fetchedMinigames = await getMinigamesByAdminID(userID); // Obtén minijuegos
          const fetchedProjects = await getProjectsByAdminID(userID); // Obtén proyectos

          if (fetchedMinigames) {
            setMinigames(fetchedMinigames);
            console.log('Minijuegos cargados:', fetchedMinigames);
          }

          if (fetchedProjects) {
            setProjects(fetchedProjects);
            console.log('Proyectos cargados:', fetchedProjects);
          }
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        } finally {
          setHasFetched(true); // Marcar como consultado
        }
      };

      fetchData();
    }
  }, [userID, hasFetched, getMinigamesByAdminID, getProjectsByAdminID]); // La consulta solo se hace si 'ID' cambia y 'hasFetched' es false

  // Manejar la seleccion de un Minijuego
  const handleSelectMinigame = (id) => {
    setSelectedMinigames((prevSelectedMinigames) => {
      const isAlreadySelected = prevSelectedMinigames.some((minigame) => minigame._id === id);
      if (isAlreadySelected) {
        return prevSelectedMinigames.filter((minigame) => minigame._id !== id);
      } else {
        const minigameToAdd = minigames.find((minigame) => minigame._id === id);
        return minigameToAdd ? [...prevSelectedMinigames, minigameToAdd] : prevSelectedMinigames;
      }
    });
  };

  // Manejar la seleccion de un Proyecto
  const handleSelectProject = (id) => {
    setSelectedProject((prevSelectedProject) => {
      if (prevSelectedProject && prevSelectedProject._id === id) {
        return null;
      }
      const projectToSelect = projects.find((project) => project._id === id);
      return projectToSelect || null;
    });
    console.log("Proyecto seleccionado: ", selectedProject);
  };

  // Manejar la construccion
  const handleBuild = async () => {
    try {
      console.log("Construyendo...");
  
      // Si no se ha seleccionado ningún proyecto
      let OutputProject = {};
  
      if (selectedProject) {
        // Usar el proyecto seleccionado
        OutputProject = { ...selectedProject };
        console.log('Proyecto seleccionado:', selectedProject);
      } else {
        // Crear un proyecto vacío si no se seleccionó uno
        console.log('No se ha seleccionado un proyecto. Se creará un proyecto vacío.');
        OutputProject = {
          nombre: "", // Nombre vacío si no hay seleccionado
          descripcion: "", // Descripción vacía si no hay seleccionado
          minijuegos: selectedMinigames, // Usar los minijuegos seleccionados
          ultimaModificacion: new Date().toISOString(), // Fecha de la última modificación
          id_administrador: user._id, // ID del administrador
        };
      }
  
      // Verificar que haya al menos un minijuego
      if (OutputProject.minijuegos.length === 0) {
        console.error('Por favor selecciona al menos un minijuego.');
        return;
      }
  
      // Ejecutar el script de construcción en la API
      buildProject(OutputProject);
    } catch (err) {
      console.error('Error al manejar el botón:', err);
    }
  };

  // Estructura de la pagina
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      <div className="h-[12vh]">
        <Header />
      </div>

      <div className="h-[88vh] w-full py-1.5 flex gap-[5px] overflow-hidden">
        <div className="w-1/3 h-full overflow-auto">
          <DesignsToBuild
            selectedMinigames={selectedMinigames}
            selectedProject={selectedProject}
            onBuild={handleBuild} />
        </div>

        <div className="w-2/3 h-full overflow-auto">
          <BuildableDesigns
            minigames={minigames}
            projects={projects}
            selectedMinigames={selectedMinigames}
            selectedProject={selectedProject}
            onSelectMinigame={handleSelectMinigame}
            onSelectProject={handleSelectProject}
          />
        </div>
      </div>

    </div>
  );
};

export default Build;
