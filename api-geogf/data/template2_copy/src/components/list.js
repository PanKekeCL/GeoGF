import React from "react";

const minigames = [{"_id":"679bbd2db73000d63b65527e","nombre":"Emparejar 30","descripcion":"","tipo":"Emparejar","geometry":{"type":"Point","coordinates":[-73.24976992608755,-39.804898854437646]},"paginas":[{"enunciado":"Une el Beacon con su Imagen","tipoIzquierdo":"imagen","tipoDerecho":"","parejas":[{"textoIzquierdo":"","textoDerecho":"Beacon","imagenIzquierda":"../../images/Emparejar30_pagina_1_pareja_1.png","imagenDerecha":""}]}]},{"_id":"679bc5f7b73000d63b655280","nombre":"Ordenar 30","descripcion":"","tipo":"Ordenar","geometry":{"type":"Point","coordinates":[-73.24845457080302,-39.80486341294013]},"paginas":[{"enunciado":"Ordena el crecimiento correcto de los arboles.","tipoConcepto":"imagen","conceptos":[{"texto":"","imagen":"../../images/Ordenar30_pagina_1_concepto_1.jpg"},{"texto":"","imagen":"../../images/Ordenar30_pagina_1_concepto_2.jpg"},{"texto":"","imagen":"../../images/Ordenar30_pagina_1_concepto_3.png"}]}]},{"_id":"679bc54eb73000d63b65527f","nombre":"Trivia 30","descripcion":"","tipo":"Trivia","geometry":{"type":"Point","coordinates":[-73.25103056432454,-39.803365788006914]},"paginas":[{"enunciado":"Cuanto miden los Olivillos","imagen":"../../images/Trivia30_pagina_1.jpg","mezclarRespuestas":false,"respuestas":[{"texto":"10 metros","correcta":false},{"texto":"20 metros","correcta":true},{"texto":"30 metros","correcta":false}]}]}];

const List = ({ onClose }) => (
  <div className="absolute bottom-16 right-4 bg-white shadow-lg rounded-lg p-4 w-64 z-50">
    <button
      className="absolute top-2 right-2 text-gray-600 hover:text-black"
      onClick={onClose}
    >
      ✕
    </button>
    <h3 className="text-lg font-bold mb-2">Minijuegos</h3>
    <ul className="list-disc list-inside text-sm">
      {minigames.map((game, index) => (
        <li key={index}>
          <span className="font-semibold">{game.nombre}</span>: {game.descripcion}
        </li>
      ))}
    </ul>
  </div>
);

export default List;
