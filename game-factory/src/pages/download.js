import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import DesignsToDownload from '../components/designsToDownload';
import DownloadableDesigns from '../components/downloadableDesigns';

const Download = () => {
  const [minijuegos, setMinijuegos] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // Elementos seleccionados para descarga

  // Consulta a la API para obtener los minijuegos y proyectos del usuario
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/minigames-projects'); // Asumiendo que la API devuelve los minijuegos y proyectos
        const data = await response.json();
        setMinijuegos(data.minijuegos);
        setProyectos(data.proyectos);
      } catch (error) {
        console.error('Error fetching minijuegos and proyectos:', error);
      }
    };
    fetchData();
  }, []);

  // Función para marcar/desmarcar un proyecto o minijuego para descarga
  const handleSelectItem = (item) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(item)) {
        return prevItems.filter((i) => i !== item);
      } else {
        return [...prevItems, item];
      }
    });
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
          <DesignsToDownload selectedItems={selectedItems} />
        </div>

        {/* Diseños descargables a la derecha */}
        <div className="w-2/3 h-full overflow-auto">
          <DownloadableDesigns
            minijuegos={minijuegos}
            proyectos={proyectos}
            onSelectItem={handleSelectItem}
          />
        </div>
      </div>
    </div>
  );
};

export default Download;
