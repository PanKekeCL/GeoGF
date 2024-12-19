import { useSearchParams } from "react-router-dom";
import getMinijuego from "../hooks/api-geogf";
import Trivia from "../components/Trivia";
import Emparejar from "../components/Emparejar";
import Ordenar from "../components/Ordenar";

const Minijuego = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // Obtiene la ID desde el query string
  console.log("ID recibida:", id); // Imprime la ID en la consola
  // Utilizar la ID para buscar la data del minijuego en la API

  const data = {
    "nombre": "Trivia de Árboles Nativos de Valdivia",
    "tipo": "trivia",
    "mezclarPaginas": true,
    "paginas": [
      {
        "pregunta": "¿Qué árbol nativo tiene hojas con forma de helecho y produce frutos comestibles llamados piñones?",
        "imagen": "https://fundacionmaradentro.cl/wp-content/uploads/2013/09/5-1-300x225.jpg",
        "mezclarRespuestas": true,
        "respuestas": [
          { "texto": "Araucaria", "correcta": true },
          { "texto": "Lingue", "correcta": false },
          { "texto": "Tineo", "correcta": false },
          { "texto": "Mañío", "correcta": false }
        ]
      },
      {
        "pregunta": "Este árbol es conocido por su corteza rojiza y exfoliante, característica de los bosques valdivianos. ¿Cuál es?",
        "imagen": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Tronco_Arrayan.jpg/220px-Tronco_Arrayan.jpg",
        "mezclarRespuestas": false,
        "respuestas": [
          { "texto": "Arrayán", "correcta": true },
          { "texto": "Laurel", "correcta": false },
          { "texto": "Coigüe", "correcta": false },
          { "texto": "Raulí", "correcta": false }
        ]
      },
      {
        "pregunta": "¿Qué árbol nativo es conocido como 'alimento de los dioses' por los mapuches, gracias a sus frutos comestibles?",
        "imagen": "https://www.nublenaturaleza.cl/wp-content/uploads/peumo00.jpg",
        "mezclarRespuestas": true,
        "respuestas": [
          { "texto": "Peumo", "correcta": true },
          { "texto": "Notro", "correcta": false },
          { "texto": "Tepa", "correcta": false },
          { "texto": "Alerce", "correcta": false }
        ]
      }
    ]
  };

  // Renderizado Condicional según el Tipo
  switch (data?.tipo) {
    case "trivia":
      return <Trivia data={data} />;
    case "emparejar":
      return <Emparejar data={data} />;
    case "ordenar":
      return <Ordenar data={data} />;
    default:
      return <div>Error: Tipo de componente desconocido.</div>;
  }
};

export default Minijuego;
