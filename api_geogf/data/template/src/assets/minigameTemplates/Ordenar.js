import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import palettes from "../../assets/palettes";
import BackIcon from "../../assets/icons/backIcon";

const data = DATOS;

const Ordenar = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answerVerified, setAnswerVerified] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(null);

  const paleta = palettes[data.paleta] || palettes.Predeterminado;

  // Estados para manejar los conceptos seleccionados y mezclados
  const [conceptosSeleccionados, setConceptosSeleccionados] = useState([]);
  const [conceptosMezclados, setConceptosMezclados] = useState([]);
  const [conceptosOrdenados, setConceptosOrdenados] = useState([]);

  const navigate = useNavigate();

  // Si se requiere barajar las páginas, se hace aquí
  useEffect(() => {
    if (data.shufflePages) {
      data.paginas.sort(() => Math.random() - 0.5);
    }
  }, []);

  // Al cambiar de página, reiniciamos los estados de conceptos.
  useEffect(() => {
    if (currentPage > 0 && currentPage <= data.paginas.length) {
      const paginaActual = data.paginas[currentPage - 1];
      setConceptosOrdenados(paginaActual.conceptos);
      setConceptosMezclados(shuffleArray([...paginaActual.conceptos]));
      setConceptosSeleccionados([]);
    }
  }, [currentPage]);

  useEffect(() => {
    console.log("conceptosOrdenados", conceptosOrdenados);
    console.log("conceptosMezclados", conceptosMezclados);
  }, [conceptosOrdenados, conceptosMezclados]);

  // Función para barajar un arreglo
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAddToSelected = (index) => {
    const concept = conceptosMezclados[index];
    setConceptosSeleccionados([...conceptosSeleccionados, concept]);
    const updatedMezclados = [...conceptosMezclados];
    updatedMezclados.splice(index, 1);
    setConceptosMezclados(updatedMezclados);
  };

  const handleRemoveFromSelected = (index) => {
    const concept = conceptosSeleccionados[index];
    setConceptosMezclados([...conceptosMezclados, concept]);
    const updatedSelected = [...conceptosSeleccionados];
    updatedSelected.splice(index, 1);
    setConceptosSeleccionados(updatedSelected);
  };

  const verifyOrder = () => {
    if (conceptosSeleccionados.length !== conceptosOrdenados.length) return;
    
    const isCorrect = conceptosSeleccionados.every((concepto, index) => {
      return (
        concepto.texto === conceptosOrdenados[index].texto &&
        concepto.imagen === conceptosOrdenados[index].imagen
      );
    });
    
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
      setCorrect(true);
    } else {
      setCorrect(false);
      setLives(lives - 1);
    }
    setAnswerVerified(true);
  };

  const nextPage = () => {
    setAnswerVerified(false);
    setCorrect(null);
    setCurrentPage(currentPage + 1);
  };

  return (
    <div
      className={`h-screen w-full ${
        currentPage > 0 && currentPage < data.paginas.length + 1
          ? `bg-${paleta.color1}`
          : `bg-${paleta.color4}`
      }`}
    >
      {/* Pantalla de sin vidas */}
      {lives === 0 && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-red-200 border border-red-400 p-6 rounded-lg text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">¡Lo siento!</h1>
            <p className="text-xl mb-4 text-red-600">Te has quedado sin vidas.</p>
            <button
              className={`bg-${paleta.color6} text-white px-8 py-4 text-xl font-bold rounded-xl`}
              onClick={() => navigate("/map")}
            >
              Volver al mapa
            </button>
          </div>
        </div>
      )}

      <div className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between w-full space-x-4 mb-4">
          {/* Botón para volver */}
          <div
            className="w-12 h-12 cursor-pointer"
            onClick={() => navigate("/map")}
          >
            <BackIcon />
          </div>

          {/* Barra de progreso */}
          <div className="flex-1 h-4 bg-gray-200 relative rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-lime-500 rounded-full"
              style={{
                width: `${(currentPage / (data.paginas.length + 1)) * 100}%`,
              }}
            ></div>
          </div>

          {/* Vidas */}
          <div className="w-12 h-12 text-red-500 flex items-center justify-center font-bold">
            {lives}
          </div>
        </div>

        {/* Pantalla de presentación */}
        {currentPage === 0 && (
          <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold mb-6">{data.nombre}</h1>
            <p className="text-gray-700 mb-6">{data.descripcion}</p>
            <button
              className={`bg-${paleta.color6} text-white px-8 py-4 text-xl font-bold rounded-xl`}
              onClick={() => setCurrentPage(1)}
            >
              JUGAR
            </button>
          </div>
        )}

        {/* Páginas de ordenar */}
        {currentPage > 0 && currentPage <= data.paginas.length && (
          <>
            {data.paginas[currentPage - 1] && (
              <>
                {/* 1. Parte superior: enunciado */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-left">
                    {data.paginas[currentPage - 1].enunciado}
                  </h2>
                </div>

                {/* 2. Zona central: cuadricula con los conceptos seleccionados */}
                <div className="mb-4">
                  <div className="grid grid-cols-4 gap-2 min-h-[100px] border border-dashed border-gray-400 p-2">
                    {conceptosSeleccionados.map((concepto, index) => (
                      <div
                        key={index}
                        className="bg-gray-200 p-2 flex items-center justify-center cursor-pointer"
                        onClick={() => handleRemoveFromSelected(index)}
                      >
                        {data.paginas[currentPage - 1].tipoConcepto === "imagen" ? (
                          <img
                            src={concepto.imagen}
                            alt={`concepto-${index}`}
                            className="object-contain h-16"
                          />
                          
                        ) : (
                          concepto.texto
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Zona inferior: conceptos mezclados disponibles para seleccionar */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {conceptosMezclados.map((concepto, index) => (
                      <div
                        key={index}
                        className="bg-blue-200 p-2 cursor-pointer rounded flex items-center justify-center"
                        onClick={() => handleAddToSelected(index)}
                      >
                        {data.paginas[currentPage - 1].tipoConcepto === "imagen" ? (
                          <img
                            src={concepto.imagen}
                            alt={`concepto-${index}`}
                            className="object-contain h-16"
                          />
                        ) : (
                          concepto.texto
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botón para comprobar respuestas */}
                {!answerVerified && (
                  <button
                    className={`w-full py-3 font-bold text-white rounded-xl ${
                      conceptosSeleccionados.length !==
                      data.paginas[currentPage - 1].conceptos.length
                        ? "bg-gray-200 cursor-not-allowed"
                        : `bg-${paleta.color6}`
                    }`}
                    onClick={verifyOrder}
                    disabled={
                      conceptosSeleccionados.length !==
                      data.paginas[currentPage - 1].conceptos.length
                    }
                  >
                    COMPROBAR
                  </button>
                )}

                {/* Botón para avanzar */}
                {answerVerified && (
                  <button
                    className={`w-full py-3 font-bold text-white rounded-xl ${
                      correct === true ? "bg-lime-500" : "bg-red-500"
                    }`}
                    onClick={nextPage}
                  >
                    {correct === true ? "SIGUIENTE" : "ENTENDIDO"}
                  </button>
                )}
              </>
            )}
          </>
        )}

        {/* Página final con resultados */}
        {currentPage === data.paginas.length + 1 && (
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            <h2 className="text-4xl font-bold text-black">¡Felicitaciones!</h2>
            <p className="text-lg">Aquí están tus resultados.</p>

            <div className="flex space-x-4">
              {/* Cuadro de Puntaje */}
              <div
                className={`bg-${paleta.color1} border-${paleta.color2} text-${paleta.color3} border-2 rounded-xl p-4 w-40`}
              >
                <p className="text-lg font-bold">Puntaje:</p>
                {correctAnswers === data.paginas.length && (
                  <p className={`text-md font-semibold text-${paleta.color3}`}>
                    ¡Perfecto!
                  </p>
                )}
                <p className="text-2xl">{correctAnswers * 100}</p>
              </div>

              {/* Cuadro de Tiempo */}
              <div
                className={`bg-${paleta.color1} border-${paleta.color2} text-${paleta.color3} border-2 rounded-xl p-4 w-40`}
              >
                <p className="text-lg font-bold">Tiempo:</p>
                {Math.floor((Date.now() - startTime) / 1000) <=
                  data.paginas.length * 10 && (
                  <p className={`text-md font-semibold text-${paleta.color6}`}>
                    ¡Rápido!
                  </p>
                )}
                <p className="text-2xl">
                  {String(Math.floor((Date.now() - startTime) / 60000)).padStart(
                    2,
                    "0"
                  )}
                  :
                  {String(
                    Math.floor((Date.now() - startTime) / 1000) % 60
                  ).padStart(2, "0")}
                </p>
              </div>
            </div>

            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-xl mt-6"
              onClick={() => navigate("/map")}
            >
              Volver al mapa
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ordenar;