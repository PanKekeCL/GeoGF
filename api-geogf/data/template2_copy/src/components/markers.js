import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";

const minigames = [{"_id":"679bbd2db73000d63b65527e","nombre":"Emparejar 30","descripcion":"","tipo":"Emparejar","geometry":{"type":"Point","coordinates":[-73.24976992608755,-39.804898854437646]},"paginas":[{"enunciado":"Une el Beacon con su Imagen","tipoIzquierdo":"imagen","tipoDerecho":"","parejas":[{"textoIzquierdo":"","textoDerecho":"Beacon","imagenIzquierda":"../../images/Emparejar30_pagina_1_pareja_1.png","imagenDerecha":""}]}]},{"_id":"679bc5f7b73000d63b655280","nombre":"Ordenar 30","descripcion":"","tipo":"Ordenar","geometry":{"type":"Point","coordinates":[-73.24845457080302,-39.80486341294013]},"paginas":[{"enunciado":"Ordena el crecimiento correcto de los arboles.","tipoConcepto":"imagen","conceptos":[{"texto":"","imagen":"../../images/Ordenar30_pagina_1_concepto_1.jpg"},{"texto":"","imagen":"../../images/Ordenar30_pagina_1_concepto_2.jpg"},{"texto":"","imagen":"../../images/Ordenar30_pagina_1_concepto_3.png"}]}]},{"_id":"679bc54eb73000d63b65527f","nombre":"Trivia 30","descripcion":"","tipo":"Trivia","geometry":{"type":"Point","coordinates":[-73.25103056432454,-39.803365788006914]},"paginas":[{"enunciado":"Cuanto miden los Olivillos","imagen":"../../images/Trivia30_pagina_1.jpg","mezclarRespuestas":false,"respuestas":[{"texto":"10 metros","correcta":false},{"texto":"20 metros","correcta":true},{"texto":"30 metros","correcta":false}]}]}];

const removeAccents = (str) => {
  const accentMap = {
    á: "a", é: "e", í: "i", ó: "o", ú: "u",
    Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U",
  };
  return str.replace(/[áéíóúÁÉÍÓÚ]/g, (match) => accentMap[match] || match);
};

const formatGameNameForUrl = (gameName) => {
  return removeAccents(gameName)
    .toLowerCase()
    .replace(/\s+/g, "_");
};

const Markers = () => {
  return (
    <>
      {minigames.map((minigame, index) => (
        <Marker key={index} position={[minigame.geometry.coordinates[1], minigame.geometry.coordinates[0]]}>
          <Popup>
            <h3 className="text-lg font-bold">{minigame.nombre}</h3>
            <p className="text-sm text-gray-600">{minigame.descripcion}</p>
            <Link
              to={`/${formatGameNameForUrl(minigame.nombre)}`}
              className="mt-2 inline-block bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600"
            >
              Jugar
            </Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default Markers;
