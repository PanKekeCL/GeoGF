import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import MinigameConfig from '../components/minigame/minigameConfig';
import MinigamePages from '../components/minigame/minigamePages';
import { useAuth } from '../context/useAuth'; // Importa el contexto de autenticación
import { useApi } from '../hooks/useApi'; // Importa el hook de API

const Minigame = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ID = queryParams.get('id');
  const navigate = useNavigate();

  // Contexto de autenticación
  const { user } = useAuth(); // Obtén el usuario autenticado

  // Hook de API
  const { saveMinijuego, getMinijuegoByID } = useApi();

  // Data inicial
  const [data, setData] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    mezclarPaginas: false,
    paleta: '',
    paginas: [],
    id_administrador: user._id
  });

  // Estado para manejar errores
  const [error, setError] = useState('');
  const [hasFetched, setHasFetched] = useState(false);  // Estado para verificar si ya se hizo la consulta

  useEffect(() => {
    if (ID && !hasFetched) { // Solo hacer la consulta si aún no se ha hecho
      console.log('ID recibida:', ID);
  
      // Asegúrate de que la función es asíncrona
      const fetchMinijuego = async () => {
        try {
          const minijuego = await getMinijuegoByID(ID);  // Asegúrate de esperar la respuesta
          if (minijuego) {
            setData(minijuego);
            console.log('Minijuego cargado:', minijuego);
          } else {
            console.error('Minijuego no encontrado');
          }
        } catch (error) {
          console.error('Error al obtener el minijuego:', error);
          setError('Hubo un error al cargar el minijuego.');
        } finally {
          setHasFetched(true);  // Marcar como consultado para evitar reintentos
        }
      };
  
      fetchMinijuego();
    }
  }, [ID, hasFetched, getMinijuegoByID]); // La consulta solo se hace si 'ID' cambia y 'hasFetched' es false

  const handleConfigChange = (newConfig) => {
    setData((prevData) => ({
      ...prevData,
      ...newConfig, // Reemplaza prevData por newConfig.
      paginas: prevData.paginas // Se mantiene la lista de páginas sin cambios
    }));
  };

  const handlePagesChange = (newPages) => {
    setData((prevData) => ({
      ...prevData,
      paginas: newPages  // Actualiza solo el atributo paginas
    }));
  };

  const handleSubmit = async () => {
    // Crear el objeto apiData con los datos del minijuego, añadiendo administrador y última modificación
    const ahora = new Date();
    const outputData = {
      ...data,
      ultimaModificacion: ahora, // Añade la fecha y hora actual
    };
    console.log("Ingresado a DB la fecha: ", ahora)
    try {
      // Si el minijuego tiene ID, se actualiza
      const response = await saveMinijuego(outputData);
      if (ID !== response._id) {
        navigate(`/minigame?id=${response._id}`);
      }
    } catch (err) {
      // Manejo de errores
      console.error('Error al guardar el minijuego:', err);
      setError('Hubo un problema al guardar el minijuego.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="h-[12vh]">
        <Header title={data.nombre || 'Nuevo minijuego'} />
      </div>
      <div className="h-[88vh] w-full py-1.5 flex gap-[5px] overflow-hidden">
        <div className="w-1/3 h-full overflow-auto">
          <MinigameConfig
            data={{
              ...data,
              paginas: undefined
            }}
            handleConfigChange={handleConfigChange}
            handleSubmit={handleSubmit}
          />
        </div>
        <div className="w-2/3 h-full overflow-auto">
          <MinigamePages
            data={data.paginas}
            handlePagesChange={handlePagesChange}
            minigameType={data.tipo}
          />
        </div>
      </div>
    </div>
  );
};

export default Minigame;
