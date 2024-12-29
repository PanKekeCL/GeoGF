import React, { useState, useEffect } from 'react';

const Trivia = () => {
    const data = {DATA};
    const palette = {PALETA};

    const [currentPage, setCurrentPage] = useState(0);
    const [shuffledPages, setShuffledPages] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [checkAnswers, setCheckAnswers] = useState(false);
    const [score, setScore] = useState(0);

    

    useEffect(() => {
        const pages = data.mezclarPaginas
            ? [...data.paginas].sort(() => Math.random() - 0.5)
            : data.paginas;
        setShuffledPages(pages);
    }, [data.paginas, data.mezclarPaginas]);

    const currentQuestion = shuffledPages[currentPage];

    const handleAnswerClick = (index) => {
        if (selectedAnswers.includes(index)) {
            setSelectedAnswers(selectedAnswers.filter((i) => i !== index));
        } else {
            setSelectedAnswers([...selectedAnswers, index]);
        }
    };

    const confirmAnswer = () => {
        const correctAnswers = currentQuestion.respuestas
            .map((respuesta, index) => (respuesta.correcta ? index : null))
            .filter((index) => index !== null);

        const correctSelected = selectedAnswers.every((answer) =>
            correctAnswers.includes(answer)
        ) && selectedAnswers.length === correctAnswers.length;

        const pageScore = correctSelected
            ? 100
            : Math.floor((100 * selectedAnswers.filter((answer) => correctAnswers.includes(answer)).length) / correctAnswers.length);

        setScore(score + pageScore);
        setCheckAnswers(true);
    };

    const nextQuestion = () => {
        if (currentPage < shuffledPages.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(shuffledPages.length);
        }
        setSelectedAnswers([]);
        setCheckAnswers(false);
    };

    if (currentPage >= shuffledPages.length) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen ${palette.background}`}>
                <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                    <h1 className={`text-2xl font-bold text-center mb-4 ${palette.text}`}>Resultados</h1>
                    <p className="text-gray-600 text-center mb-4">Tu puntaje final es: {score}</p>
                    <button
                        onClick={() => (window.location.href = '/map')}
                        className={`px-6 py-2 rounded-lg ${palette.button.default}`}
                    >
                        Volver al mapa
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${palette.background}`}>
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className={`text-2xl font-bold text-center mb-4 ${palette.text}`}>{data.nombre}</h1>
                <p className="text-gray-600 text-center mb-4">{data.descripcion}</p>
                {currentQuestion.imagen && (
                    <img
                        src={currentQuestion.imagen}
                        alt="Pregunta"
                        className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                )}
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{currentQuestion.enunciado}</h2>
                <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.respuestas.map((respuesta, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerClick(index)}
                            className={`p-4 rounded-lg font-semibold ${
                                checkAnswers
                                    ? respuesta.correcta
                                        ? palette.button.correct
                                        : selectedAnswers.includes(index)
                                        ? palette.button.incorrect
                                        : palette.button.disabled
                                    : selectedAnswers.includes(index)
                                    ? palette.button.default
                                    : palette.button.default + " hover:bg-opacity-75"
                            }`}
                            disabled={checkAnswers}
                        >
                            {respuesta.texto}
                        </button>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    {!checkAnswers ? (
                        <button
                            onClick={confirmAnswer}
                            disabled={selectedAnswers.length === 0}
                            className={`px-6 py-2 rounded-lg ${palette.button.default}`}
                        >
                            Confirmar
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            className={`px-6 py-2 rounded-lg ${palette.button.default}`}
                        >
                            {currentPage < shuffledPages.length - 1 ? "Siguiente" : "Finalizar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Trivia;
