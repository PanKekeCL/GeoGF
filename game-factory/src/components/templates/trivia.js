import React, { useState, useEffect } from 'react';
import triviaConfig from './triviaConfig.json'; // Asegúrate de tener este archivo en src
import './App.css'; // Archivo donde aplicas los estilos de Tailwind

function Trivia() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [questions, setQuestions] = useState([]);

    const { configuracion_global, configuracion_trivia } = triviaConfig;

    // Mezcla las preguntas y respuestas si está configurado en el JSON
    useEffect(() => {
        let loadedQuestions = [...configuracion_trivia.preguntas];
        if (configuracion_trivia.mezclar_preguntas) {
            loadedQuestions = shuffleArray(loadedQuestions);
        }
        if (configuracion_trivia.mezclar_respuestas) {
            loadedQuestions = loadedQuestions.map(q => ({
                ...q,
                respuestas: shuffleArray(q.respuestas),
            }));
        }
        setQuestions(loadedQuestions);
    }, [configuracion_trivia]);

    // Función para mezclar un array
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col justify-center items-center"
            style={{ backgroundColor: configuracion_global.color_fondo, fontFamily: configuracion_global.fuente }}
        >
            <div className="w-full max-w-md px-4">
                <h2 className={`text-center mb-4 ${configuracion_global.tamano_texto}`} style={{ color: configuracion_global.color_texto }}>
                    {questions[currentQuestionIndex]?.pregunta}
                </h2>

                {questions[currentQuestionIndex]?.imagen && (
                    <img src={questions[currentQuestionIndex].imagen} alt="question" className="mb-4 w-full rounded" />
                )}

                <div className="grid gap-2">
                    {questions[currentQuestionIndex]?.respuestas.map((respuesta, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            className={`p-3 rounded-lg border ${selectedAnswer === index ? 'bg-blue-300' : 'bg-white'}`}
                        >
                            {respuesta.texto}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={handlePreviousQuestion}
                        className="px-4 py-2 rounded bg-gray-300"
                        disabled={currentQuestionIndex === 0}
                    >
                        Anterior
                    </button>

                    <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 rounded"
                        style={{
                            backgroundColor: configuracion_global.color_boton,
                            color: configuracion_global.color_texto_boton,
                        }}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Trivia;
