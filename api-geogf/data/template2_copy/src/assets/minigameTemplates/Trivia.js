import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const data = DATOS;

const Trivia = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answerVerified, setAnswerVerified] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const navigate = useNavigate();

    useEffect(() => {
        if (data.shufflePages) {
            data.paginas.sort(() => Math.random() - 0.5);
        }
    }, []);

    const handleSelection = (index) => {
        setSelectedOption(index);
    };

    const verifyAnswer = () => {
        if (selectedOption === null) return;
        const isCorrect = data.paginas[currentPage].respuestas[selectedOption].correcto;
        if (isCorrect) setCorrectAnswers(correctAnswers + 1);
        setAnswerVerified(true);
    };

    const nextPage = () => {
        setAnswerVerified(false);
        setSelectedOption(null);
        if (currentPage + 1 < data.paginas.length) {
            setCurrentPage(currentPage + 1);
        } else {
            const finalTime = Math.floor((Date.now() - startTime) / 1000);
            alert(`Correct answers: ${correctAnswers}. Time: ${finalTime} seconds.`);
            navigate("/map");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
            {currentPage === 0 && (
                <>
                    <h1 className="text-2xl font-bold mb-4">{data.nombre}</h1>
                    <p className="text-gray-700 mb-4">{data.descripcion}</p>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setCurrentPage(1)}
                    >
                        Jugar
                    </button>
                </>
            )}
            {currentPage > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-2">{data.paginas[currentPage - 1].enunciado}</h2>
                    {data.paginas[currentPage - 1].imagen && (
                        <img
                            src={data.paginas[currentPage - 1].imagen}
                            alt="Imagen"
                            className="mb-4 w-full h-auto rounded"
                        />
                    )}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        {data.paginas[currentPage - 1].respuestas.map((answer, index) => (
                            <button
                                key={index}
                                className={`p-2 rounded ${
                                    selectedOption === index
                                        ? "bg-blue-300"
                                        : "bg-gray-200"
                                }`}
                                onClick={() => handleSelection(index)}
                                disabled={answerVerified}
                            >
                                {answer.texto}
                            </button>
                        ))}
                    </div>
                    {!answerVerified ? (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={verifyAnswer}
                        >
                            Comprobar
                        </button>
                    ) : (
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={nextPage}
                        >
                            Siguiente
                        </button>
                    )}
                    {answerVerified && (
                        <p className="mt-4">
                            {data.paginas[currentPage - 1].respuestas[selectedOption].correcto
                                ? "Correcto!"
                                : "Incorrecto. Las respuestas correctas eran: " +
                                  data.paginas[currentPage - 1].respuestas.find((a) => a.correcto).texto}
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default Trivia;