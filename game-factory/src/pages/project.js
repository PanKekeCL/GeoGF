import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import ProjectConfig from '../components/project/projectConfig';
import ProjectMinigames from '../components/project/projectMinigames';
import { useAuth } from '../context/useAuth'; // Importa el contexto de autenticación
import { useApi } from '../hooks/useApi'; // Importa el hook de API

const Project = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ID = queryParams.get('id');
  const navigate = useNavigate();

  // Contexto de autenticación
  const { user } = useAuth(); // Obtén el usuario autenticado

  // Hook de API
  const { saveProject, getProjectByID } = useApi();

  // Data inicial
  const [data, setData] = useState({
    nombre: '',
    descripcion: '',
    geometry: {type: null, coordinates: [0,0]},
    minijuegos: [],
    id_administrador: user._id
  });

  // Estado para manejar errores
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);  // Estado para verificar si ya se hizo la consulta

  useEffect(() => {
    if (ID && !hasFetched) { // Solo hacer la consulta si aún no se ha hecho
      console.log('ID recibida:', ID);
  
      // Asegúrate de que la función es asíncrona
      const fetchProyecto = async () => {
        try {
          const proyecto = await getProjectByID(ID);  // Asegúrate de esperar la respuesta
          if (proyecto) {
            setData(proyecto);
            console.log('Proyecto cargado:', proyecto);
          } else {
            console.error('Proyecto no encontrado');
          }
        } catch (error) {
          console.error('Error al obtener el proyecto:', error);
          setError('Hubo un error al cargar el proyecto.');
        } finally {
          setHasFetched(true);  // Marcar como consultado para evitar reintentos
        }
      };
  
      fetchProyecto();
    }
  }, [ID, hasFetched, getProjectByID]); // La consulta solo se hace si 'ID' cambia y 'hasFetched' es false

  const handleConfigChange = (newConfig) => {
    setData((prevData) => ({
      ...prevData,
      ...newConfig, // Reemplaza prevData por newConfig.
      minijuegos: prevData.minijuegos // Se mantiene la lista de páginas sin cambios
    }));
  };

  const handleMinigamesChange = (newMinigames) => {
    console.log("Nueva data recibida: ", newMinigames)
    setData((prevData) => ({
      ...prevData,
      minijuegos: newMinigames  // Actualiza solo el atributo paginas
    }));
  };

  const handleSubmit = async () => {
    // Crear el objeto apiData con los datos del minijuego, añadiendo administrador y última modificación
    const ahora = new Date();
    const outputData = {
      ...data,
      ultimaModificacion: ahora, // Añade la fecha y hora actual
    };
    try {
      // Si el proyecto tiene ID, se actualiza
      const response = await saveProject(outputData);
      if (ID !== response._id) {
        navigate(`/project?id=${response._id}`);
      }
    } catch (err) {
      // Manejo de errores
      console.error('Error al guardar el proyecto:', err);
      setError('Hubo un problema al guardar el proyecto.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="h-[12vh]">
        <Header title={data.nombre || 'Nuevo proyecto'} />
      </div>
      <div className="h-[88vh] w-full py-1.5 flex gap-[5px] overflow-hidden">
        <div className="w-1/3 h-full overflow-auto">
          <ProjectConfig
            data={data}
            handleConfigChange={handleConfigChange}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="w-2/3 h-full overflow-auto">
          <ProjectMinigames
            selectedMinigames={data.minijuegos}
            handleMinigamesChange={handleMinigamesChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Project;
