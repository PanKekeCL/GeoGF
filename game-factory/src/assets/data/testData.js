const minijuegos = [
  {
    id: 1,
    nombre: "Árboles de Los Ríos",
    descripcion: "Explora la diversidad de árboles nativos en la Región de Los Ríos y pon a prueba tus conocimientos en esta trivia interactiva.",
    tipo: "Trivia",
    mezclarPaginas: true,
    paginas: [
      {
        enunciado: "¿Qué árbol nativo tiene hojas perennes y es común en la Región de Los Ríos?",
        imagen: "https://example.com/coigue.jpg",
        mezclarRespuestas: true,
        respuestas: [
          { texto: "Coigüe", correcta: true },
          { texto: "Raulí", correcta: false },
          { texto: "Arrayán", correcta: false },
          { texto: "Lenga", correcta: false }
        ]
      },
      {
        enunciado: "Este árbol produce piñones comestibles. ¿Cómo se llama?",
        imagen: "https://example.com/peumo.jpg",
        mezclarRespuestas: false,
        respuestas: [
          { texto: "Peumo", correcta: true },
          { texto: "Ñirre", correcta: false },
          { texto: "Luma", correcta: false },
          { texto: "Mañío", correcta: false }
        ]
      }
    ],
    ultimaModificacion: "2024-11-29 14:23:56"
  },
  {
    id: 2,
    nombre: "Fauna Nativa de Valdivia",
    descripcion: "Descubre los animales que habitan en el Jardín Botánico de Valdivia a través de preguntas desafiantes en este minijuego.",
    tipo: "Trivia",
    mezclarPaginas: true,
    paginas: [
      {
        enunciado: "¿Qué animal nativo del Jardín Botánico de Valdivia es conocido por su pelaje espeso y su cola ancha?",
        imagen: "https://example.com/pudú.jpg",
        mezclarRespuestas: true,
        respuestas: [
          { texto: "Pudú", correcta: true },
          { texto: "Zorro", correcta: false },
          { texto: "Martinete", correcta: false },
          { texto: "Huemul", correcta: false }
        ]
      },
      {
        enunciado: "Este ave es conocida por su canto melodioso y es símbolo de la naturaleza chilena. ¿Cuál es?",
        imagen: "https://example.com/huemul.jpg",
        mezclarRespuestas: false,
        respuestas: [
          { texto: "Huemul", correcta: true },
          { texto: "Pingüino", correcta: false },
          { texto: "Cóndor", correcta: false },
          { texto: "Pato", correcta: false }
        ]
      }
    ],
    ultimaModificacion: "2024-11-28 10:15:30"
  },
  {
    id: 3,
    nombre: "Flores y Árboles",
    descripcion: "Asocia correctamente cada flor o árbol con su imagen correspondiente para demostrar tu conocimiento botánico.",
    tipo: "Emparejar",
    mezclarPaginas: false,
    paginas: [
      {
        enunciado: "Empareja cada Flor con su imagen",
        tipoIzquierda: "Texto",
        tipoDerecha: "Imagen",
        parejas: [
          { textoIzquierdo: "Copihue", imagenDerecha: "https://example.com/hoja_copihue.jpg" },
          { textoIzquierdo: "Mañío", imagenDerecha: "https://example.com/hoja_manio.jpg" },
          { textoIzquierdo: "Nalca", imagenDerecha: "https://example.com/hoja_nalca.jpg" },
          { textoIzquierdo: "Peumo", imagenDerecha: "https://example.com/hoja_peumo.jpg" }
        ]
      }
    ],
    ultimaModificacion: "2024-11-27 22:08:40"
  },
  {
    id: 4,
    nombre: "Fauna y Hábitat",
    descripcion: "Empareja a cada animal con su hábitat natural en este desafío educativo sobre la fauna chilena.",
    tipo: "Emparejar",
    mezclarPaginas: true,
    paginas: [
      {
        enunciado: "Empareja cada Flor con su imagen",
        parejas: [
          { texto1: "Pudú", texto2: "Bosque Valdiviano" },
          { texto1: "Cóndor", texto2: "Altos Andes" },
          { texto1: "Zorro", texto2: "Bosque Andino" },
          { texto1: "Huemul", texto2: "Bosque de Niebla" }
        ]
      }
    ],
    ultimaModificacion: "2024-11-29 08:45:12"
  },
  {
    id: 5,
    nombre: "Árboles por Tamaño",
    descripcion: "Ordena distintos árboles según su tamaño y aprende más sobre las especies de Chile.",
    tipo: "Ordenar",
    mezclarPaginas: false,
    paginas: [
      {
        enunciado: "",
        tipoConcepto: "Texto",
        conceptos: [
          { texto: "Coigüe" },
          { texto: "Alerce" },
          { texto: "Raulí" },
          { texto: "Peumo" }
        ]
      }
    ],
    ultimaModificacion: "2024-11-30 17:54:03"
  },
  {
    id: 6,
    nombre: "Ciclo de Vida de Flora",
    descripcion: "Descubre el ciclo de vida de las plantas nativas ordenando las etapas de su crecimiento.",
    tipo: "Ordenar",
    mezclarPaginas: false,
    paginas: [
      {
        enunciado: "Ordena el ciclo de vida de la Flora a partir de su nacimiento.",
        tipoConceptos: "Texto",
        conceptos: [
          { texto: "Semilla" },
          { texto: "Plántula" },
          { texto: "Árbol joven" },
          { texto: "Árbol maduro" },
          { texto: "Frutos" }
        ]
      }
    ],
    ultimaModificacion: "2024-11-28 16:27:18"
  },
  {
    id: 7,
    nombre: "Crecimiento de Árboles",
    descripcion: "Ordena las etapas del crecimiento de un árbol nativo en el Bosque Valdiviano.",
    tipo: "Ordenar",
    mezclarPaginas: false,
    paginas: [
      {
        enunciado: "",
        orden: [
          { texto: "Germinación" },
          { texto: "Brote" },
          { texto: "Árbol joven" },
          { texto: "Árbol maduro" },
          { texto: "Producción de semillas" }
        ]
      }
    ],
    ultimaModificacion: "2024-11-30 13:12:45"
  }
];

module.exports = minijuegos;
