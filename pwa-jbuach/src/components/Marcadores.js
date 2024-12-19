import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet"; // Importar Leaflet para el manejo explícito del ícono si es necesario

// Restablecer explícitamente el ícono a su valor predeterminado si se sobrescribió globalmente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Datos de ejemplo
const data = [
  {
    id: "trivia-arboles",
    position: [-39.804358973220715, -73.25004910640837],
    nombre: "Trivia de Árboles Nativos",
  },
  {
    id: "emparejar-flores",
    position: [-39.805, -73.2505],
    nombre: "Emparejar Flores del Jardín",
  },
  {
    id: "ordenar-bosques",
    position: [-39.8035, -73.249],
    nombre: "Ordenar Bosques Valdivianos",
  },
];

const Marcadores = () => {
  const navigate = useNavigate();

  const handleMarkerClick = (id) => {
    navigate(`/minigame?id=${id}`); // Redirección con query string
  };

  return (
    <>
      {data.map((item) => (
        <Marker
          key={item.id}
          position={item.position}
          eventHandlers={{
            click: () => handleMarkerClick(item.id),
          }}
        >
          <Popup>{item.nombre}</Popup>
        </Marker>
      ))}
    </>
  );
};

export default Marcadores;
