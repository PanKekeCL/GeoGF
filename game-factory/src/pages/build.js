import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import DesignsToBuild from '../components/designsToBuild'; // Cambiado el nombre del componente
import BuildableDesigns from '../components/buildableDesigns'; // Cambiado el nombre del componente
import { useAuth } from '../context/useAuth'; // Importa el contexto de autenticación
import { useApi } from '../hooks/useApi'; // Importa el hook de API

const Build = () => {
  const [minijuegos, setMinijuegos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [selectedDesigns, setSelectedDesigns] = useState([]); // Elementos seleccionados para construir

  const [hasFetched, setHasFetched] = useState(false);
  const { getMinijuegosByAdminID, getProyectosByAdminID } = useApi(); // Obtén las funciones de la API
  const { user } = useAuth();

  const userID = user._id

  useEffect(() => {
    if (userID && !hasFetched) {
      const fetchData = async () => {
        try {
          const fetchedMinijuegos = await getMinijuegosByAdminID(userID); // Obtén minijuegos
          const fetchedProyectos = await getProyectosByAdminID(userID); // Obtén proyectos

          if (fetchedMinijuegos) {
            setMinijuegos(fetchedMinijuegos);
            console.log('Minijuegos cargados:', fetchedMinijuegos);
          }

          if (fetchedProyectos) {
            setProyectos(fetchedProyectos);
            console.log('Proyectos cargados:', fetchedProyectos);
          }
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        } finally {
          setHasFetched(true); // Marcar como consultado
        }
      };

      fetchData();
    }
  }, [userID, hasFetched, getMinijuegosByAdminID, getProyectosByAdminID]); // La consulta solo se hace si 'ID' cambia y 'hasFetched' es false

  const handleSelectMinigame = (id) => {
    setMinijuegos((prevMinijuegos) =>
      prevMinijuegos.map((minijuego) =>
        minijuego._id === id
          ? { ...minijuego, seleccionado: !minijuego.seleccionado } // Cambia el estado de seleccionado
          : minijuego
      )
    );

    setSelectedDesigns((prevSelected) => {
      const selectedMinijuego = minijuegos.find((minijuego) => minijuego._id === id);
      if (selectedMinijuego) {
        // Si está seleccionado, lo eliminamos de los seleccionados; si no, lo agregamos
        return selectedMinijuego.seleccionado
          ? prevSelected.filter((item) => item._id !== id) // Elimina si ya está seleccionado
          : [...prevSelected, selectedMinijuego]; // Agrega si no estaba seleccionado
      }
      return prevSelected;
    });
  };

  const handleSelectProject = (id) => {
    setProyectos((prevProyectos) =>
      prevProyectos.map((proyecto) =>
        proyecto._id === id
          ? { ...proyecto, seleccionado: !proyecto.seleccionado } // Cambia el estado de seleccionado
          : proyecto
      )
    );

    setSelectedDesigns((prevSelected) => {
      const selectedProyecto = proyectos.find((proyecto) => proyecto._id === id);
      if (selectedProyecto) {
        // Si está seleccionado, lo eliminamos de los seleccionados; si no, lo agregamos
        return selectedProyecto.seleccionado
          ? prevSelected.filter((item) => item._id !== id) // Elimina si ya está seleccionado
          : [...prevSelected, selectedProyecto]; // Agrega si no estaba seleccionado
      }
      return prevSelected;
    });
  };

  const handleBuild = async (selectedMinigames) => {
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="h-[12vh]">
        <Header />
      </div>

      {/* Body */}
      <div className="h-[88vh] w-full py-1.5 flex gap-[5px] overflow-hidden">
        {/* Componentes de Diseño a la izquierda */}
        <div className="w-1/3 h-full overflow-auto">
          <DesignsToBuild selectedDesigns={selectedDesigns} onBuild={handleBuild} />
        </div>

        {/* Diseños construibles a la derecha */}
        <div className="w-2/3 h-full overflow-auto">
          <BuildableDesigns
            minigames={minijuegos}
            projects={proyectos}
            onSelectMinigame={handleSelectMinigame}
            onSelectProject={handleSelectProject}
          />
        </div>
      </div>
    </div>
  );
};

export default Build;
