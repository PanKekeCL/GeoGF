import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Trivia = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const navigate = useNavigate();

  const currentQuestion = data.paginas[currentPage];

  useEffect(() => {
    // Mezclar respuestas si está habilitado
    if (currentQuestion.mezclarRespuestas) {
      const shuffled = [...currentQuestion.respuestas].sort(() => Math.random() - 0.5);
      setShuffledAnswers(shuffled);
    } else {
      setShuffledAnswers(currentQuestion.respuestas);
    }
    setSelectedAnswer(null); // Resetear la selección al cambiar de página
    setIsConfirmed(false); // Resetear confirmación al cambiar de página
  }, [currentPage]);

  const handleAnswerClick = (index) => {
    if (!isConfirmed) {
      setSelectedAnswer(index);
    }
  };

  const confirmAnswer = () => {
    setIsConfirmed(true);
  };

  const nextQuestion = () => {
    if (currentPage < data.paginas.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      navigate("/map");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-green-200">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-green-800">{data.nombre}</h1>
        <img
          src={currentQuestion.imagen}
          alt="Pregunta"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-lg font-semibold text-gray-700 mb-4">{currentQuestion.pregunta}</h2>
        <div className="grid grid-cols-2 gap-4">
          {shuffledAnswers.map((respuesta, index) => (
            <button
              key={index}
              onClick={() => handleAnswerClick(index)}
              className={`p-4 rounded-lg text-white font-semibold ${
                isConfirmed
                  ? respuesta.correcta
                    ? "bg-green-500"
                    : index === selectedAnswer
                    ? "bg-red-500"
                    : "bg-gray-300"
                  : selectedAnswer === index
                  ? "bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={isConfirmed}
            >
              {respuesta.texto}
            </button>
          ))}
        </div>
        <div className="mt-6 text-center">
          {!isConfirmed ? (
            <button
              onClick={confirmAnswer}
              disabled={selectedAnswer === null}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              Confirmar
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              {currentPage < data.paginas.length - 1 ? "Siguiente" : "Ir al Mapa"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trivia;
