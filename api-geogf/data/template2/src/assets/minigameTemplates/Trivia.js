import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const data = DATOS;

const paleta = palettes[data.paleta] || palettes.Predeterminado;

const Trivia = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answerVerified, setAnswerVerified] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const navigate = useNavigate();
    const [lives, setLives] = useState(3);
    const [correct, setCorrect] = useState(null);

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
        console.log("Pagina actual: ", currentPage, "Respuesta seleccionada: ", selectedOption);

        // Verificar si la respuesta seleccionada existe
        if (data.paginas[currentPage - 1]?.respuestas[selectedOption]) {
            const isCorrect = data.paginas[currentPage - 1].respuestas[selectedOption].correcta;
            if (isCorrect) {
                setCorrectAnswers(correctAnswers + 1);
                setCorrect(true);

            } else setCorrect(false);
            setAnswerVerified(true);
        } else {
            console.error('Respuesta no válida');
        }
    };

    const nextPage = () => {
        setAnswerVerified(false);
        setSelectedOption(null);
        setCorrect(null);
        setCurrentPage(currentPage + 1);
    };

    return (
        <div className={`h-screen w-full ${currentPage > 0 && currentPage < data.paginas.length + 1 ? `bg-${paleta.color1}` : `bg-${paleta.color4}`}`}>
            <div className={"p-4 max-w-lg mx-auto"}>
                <div className="flex items-center justify-between w-full space-x-4 mb-4">
                    {/* Boton para volver */}
                    <div
                        className="w-12 h-12 text-400 cursor-pointer"
                        onClick={() => navigate("/map")}
                    ></div>

                    {/* Barra de progreso */}
                    <div className="flex-1 h-4 bg-gray-200 relative rounded-full">
                        <div
                            className="absolute top-0 left-0 h-full bg-lime-500 rounded-full"
                            style={{ width: `${(currentPage / (data.paginas.length + 1)) * 100}%` }}
                        ></div>
                    </div>

                    {/* Vidas */}
                    <div className="w-12 h-12 text-red-500 flex items-center justify-center font-bold">
                        {lives}
                    </div>
                </div>

                {/* Presentacion */}
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

                {/* Paginas de la trivia */}
                {(currentPage > 0) && (currentPage < data.paginas.length + 1) && (
                    <>
                        {data.paginas[currentPage - 1] && (
                            <>
                                <h2 className="text-xl font-semibold mb-2">
                                    {data.paginas[currentPage - 1].enunciado}
                                </h2>
                                {data.paginas[currentPage - 1].imagen && (
                                    <img
                                        src={data.paginas[currentPage - 1].imagen}
                                        alt="Imagen"
                                        className="mb-4 w-full h-auto rounded-xl"
                                    />
                                )}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    {data.paginas[currentPage - 1].respuestas.map((answer, index) => (
                                        <button
                                            key={index}
                                            className={`py-4 rounded-xl border-2 transition-all duration-200
                                          ${selectedOption === index
                                                    ? answerVerified
                                                        ? correct
                                                            ? "bg-lime-200 border-lime-400 text-lime-600" // Estado 3: Verificado y correcto
                                                            : "bg-red-200 border-red-400 text-red-600" // Estado 4: Verificado pero incorrecto
                                                        : `bg-${paleta.color4} border-${paleta.color5} text-${paleta.color6}` // Estado 2: Seleccionado
                                                    : "bg-white border-gray-200 text-black" // Estado 1: Deseleccionado
                                                }
                                        `}
                                            onClick={() => handleSelection(index)}
                                            disabled={answerVerified}
                                        >
                                            {answer.texto}
                                        </button>

                                    ))}
                                </div>

                                {/* Boton para comprobar respuestas*/}
                                {!answerVerified && (
                                    <button
                                        className={`w-full py-3 font-bold text-white rounded-xl ${selectedOption === null
                                            ? "bg-gray-200"
                                            : `bg-${paleta.color6}`
                                            }`}
                                        onClick={verifyAnswer}
                                        disabled={selectedOption === null}
                                    >
                                        COMPROBAR
                                    </button>
                                )}

                                {/* Boton para avanzar*/}
                                {answerVerified && (
                                    <button
                                        className={`w-full py-3 font-bold text-white rounded-xl ${correct === true
                                            ? "bg-lime-500"
                                            : "bg-red-500"
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
                            <div className={`bg-${paleta.color1} border-${paleta.color2} text-${paleta.color3} border-2 rounded-xl p-4 w-40`}>
                                <p className="text-lg font-bold">Puntaje:</p>
                                <p className="text-2xl">{correctAnswers * 100}</p>
                            </div>

                            {/* Cuadro de Tiempo */}
                            <div className={`bg-${paleta.color4} border-${paleta.color5} text-${paleta.color6} border-2 rounded-xl p-4 w-40`}>
                                <p className="text-lg font-bold">Tiempo:</p>
                                <p className="text-2xl">
                                    {String(Math.floor((Date.now() - startTime) / 60000)).padStart(2, '0')}:
                                    {String(Math.floor((Date.now() - startTime) / 1000) % 60).padStart(2, '0')}
                                </p>
                            </div>
                        </div>

                        <button
                            className={`bg-${paleta.color6} text-white px-8 py-4 text-xl font-bold rounded-xl`}
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

export default Trivia;