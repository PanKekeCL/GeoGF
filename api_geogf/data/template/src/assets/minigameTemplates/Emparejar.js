import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import palettes from "../../assets/palettes";
import BackIcon from "../../assets/icons/backIcon";

const data = DATOS;

const Emparejar = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedLeft, setSelectedLeft] = useState(null);
    const [selectedRight, setSelectedRight] = useState(null);
    const [errorLeft, setErrorLeft] = useState(null);
    const [errorRight, setErrorRight] = useState(null);
    const [answerVerified, setAnswerVerified] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [lives, setLives] = useState(3);
    const [matchedLeft, setMatchedLeft] = useState([]);
    const [matchedRight, setMatchedRight] = useState([]);
    const [shuffledLeft, setShuffledLeft] = useState([]);
    const [shuffledRight, setShuffledRight] = useState([]);
    const navigate = useNavigate();
    const paleta = palettes[data.paleta] || palettes.Predeterminado;

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    useEffect(() => {
        if (currentPage > 0 && currentPage <= data.paginas.length) {
            const paginaActual = data.paginas[currentPage - 1];
            setShuffledLeft(shuffleArray(paginaActual.parejas.map(p => ({ texto: p.textoIzquierdo, imagen: p.imagenIzquierda }))));
            setShuffledRight(shuffleArray(paginaActual.parejas.map(p => ({ texto: p.textoDerecho, imagen: p.imagenDerecha }))));
            setMatchedLeft([]);
            setMatchedRight([]);
            setSelectedLeft(null);
            setSelectedRight(null);
            setErrorLeft(null);
            setErrorRight(null);
        }
    }, [currentPage]);

    const handleLeftSelect = (index) => {
        setErrorLeft(null);
        setErrorRight(null);
        if (selectedLeft === index) {
            setSelectedLeft(null); // Deselecciona si se vuelve a hacer clic en el mismo índice
        } else {
            setSelectedLeft(index); // Selecciona un nuevo índice
        }

        if (selectedRight !== null) {
            verifyAnswer(index, selectedRight);
        }
    };

    const handleRightSelect = (index) => {
        setErrorLeft(null);
        setErrorRight(null);
        if (selectedRight === index) {
            setSelectedRight(null); // Deselecciona si se vuelve a hacer clic en el mismo índice
        } else {
            setSelectedRight(index); // Selecciona un nuevo índice
        }

        if (selectedLeft !== null) {
            verifyAnswer(selectedLeft, index);
        }
    };

    const verifyAnswer = (leftIndex, rightIndex) => {
        const pagina = data.paginas[currentPage - 1];
        const pareja = pagina.parejas.find(p => p.textoIzquierdo === shuffledLeft[leftIndex].texto && p.imagenIzquierda === shuffledLeft[leftIndex].imagen);
        if (pareja) {
            if (shuffledRight[rightIndex].texto == pareja.textoDerecho && shuffledRight[rightIndex].imagen == pareja.imagenDerecha) {
                setMatchedLeft([...matchedLeft, leftIndex]);
                setMatchedRight([...matchedRight, rightIndex]);
                setCorrectAnswers(correctAnswers + (1 / pagina.parejas.length));
            } else {
                setErrorLeft(leftIndex);
                setErrorRight(rightIndex);
                setLives((prev) => Math.max(0, prev - 1));
                setCorrectAnswers(Math.max(0, correctAnswers - (0.5 / pagina.parejas.length)));
            }
        } else {
            console.error("Pareja no encontrada usando info izquierda.")
        }

        setSelectedLeft(null);
        setSelectedRight(null);
    };


    const nextPage = () => {
        if (matchedLeft.length === data.paginas[currentPage - 1].parejas.length) {
            setCurrentPage(currentPage + 1);
        } else {
            const finalTime = Math.floor((Date.now() - startTime) / 1000);
            alert(`Correct answers: ${correctAnswers}. Time: ${finalTime} seconds.`);
            navigate("/map");
        }
    };

    return (
        <div className={`h-screen w-full ${currentPage > 0 && currentPage < data.paginas.length + 1 ? `bg-${paleta.color1}` : `bg-${paleta.color4}`}`}>
            {lives === 0 && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center">
                    <div className="bg-red-200 border border-red-400 p-6 rounded-lg text-center">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">¡Lo siento!</h1>
                        <p className="text-xl mb-4 text-red-600">Te has quedado sin vidas.</p>
                        <button className={`bg-${paleta.color6} text-white px-8 py-4 text-xl font-bold rounded-xl`} onClick={() => navigate("/map")}>
                            Salir
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between w-full space-x-4 mb-4">
                    <div className="w-12 h-12 cursor-pointer" onClick={() => navigate("/map")}>
                        <BackIcon />
                    </div>
                    <div className="flex-1 h-4 bg-gray-200 relative rounded-full">
                        <div className="absolute top-0 left-0 h-full bg-lime-500 rounded-full" style={{ width: `${(currentPage / (data.paginas.length + 1)) * 100}%` }}></div>
                    </div>
                    <div className="w-12 h-12 text-red-500 flex items-center justify-center font-bold">{lives}</div>
                </div>

                {currentPage === 0 && (
                    <div className="flex flex-col items-center justify-center h-screen text-center">
                        <h1 className="text-4xl font-bold mb-6">{data.nombre}</h1>
                        <p className="text-gray-700 mb-6">{data.descripcion}</p>
                        <button className={`bg-${paleta.color6} text-white px-8 py-4 text-xl font-bold rounded-xl`} onClick={() => setCurrentPage(1)}>
                            JUGAR
                        </button>
                    </div>
                )}

                {currentPage > 0 && currentPage <= data.paginas.length && (
                    <>
                        {data.paginas[currentPage - 1] && (
                            <>
                                <div className="mb-4">
                                    <h2 className="text-xl font-bold text-left">{data.paginas[currentPage - 1].enunciado}</h2>
                                </div>

                                {/* Cuadrícula con conceptos a emparejar */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-4">
                                        {shuffledLeft.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => !matchedLeft?.includes(index) && handleLeftSelect(index)}
                                                className={`p-4 cursor-pointer rounded-lg ${matchedLeft?.includes(index) ? "border text-green-600 border-green-400 bg-green-200 pointer-events-none" :
                                                    errorLeft === index ? "text-red-600 border border-red-400 bg-red-200" :
                                                        selectedLeft === index ? "border text-blue-600 border-blue-400 bg-blue-200" : "border border-gray-400"}`}
                                            >
                                                {/* Contenedor flex para centrar el contenido */}
                                                <div className="flex flex-col justify-center items-center max-h-40">  {/* Altura fija */}
                                                    {/* Verificación basada en el tipoIzquierdo */}
                                                    {item.imagen && item.imagen !== "" && (
                                                        <img
                                                            src={item.imagen}
                                                            alt={item.texto}
                                                            className="w-full max-h-20 object-cover"  // Máximo alto de imagen
                                                        />
                                                    )}
                                                    {item.texto && (
                                                        <p className="text-center flex-grow">{item.texto}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-4">
                                        {shuffledRight.map((item, index) => (
                                            <div
                                                key={index}
                                                onClick={() => !matchedRight?.includes(index) && handleRightSelect(index)}
                                                className={`p-4 cursor-pointer rounded-lg ${matchedRight?.includes(index) ? "border text-green-600 border-green-400 bg-green-200 pointer-events-none" :
                                                    errorRight === index ? "text-red-600 border border-red-400 bg-red-200" :
                                                        selectedRight === index ? "border text-blue-600 border-blue-400 bg-blue-200" : "border border-gray-400"}`}
                                            >
                                                {/* Contenedor flex para centrar el contenido */}
                                                <div className="flex flex-col justify-center items-center max-h-40">  {/* Altura fija */}
                                                    {/* Verificación basada en el tipoDerecho */}
                                                    {item.imagen && item.imagen !== "" && (
                                                        <img
                                                            src={item.imagen}
                                                            alt={item.texto}
                                                            className="w-full max-h-20 object-cover"  // Máximo alto de imagen
                                                        />
                                                    )}
                                                    {item.texto && (
                                                        <p className="text-center flex-grow">{item.texto}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>





                                <div className="text-center">
                                    <button
                                        onClick={nextPage}
                                        className={`px-8 py-4 text-xl font-bold rounded-xl ${matchedLeft.length === data.paginas[currentPage - 1].parejas.length
                                            ? `bg-${paleta.color6} text-white`
                                            : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                            }`}
                                        disabled={matchedLeft.length !== data.paginas[currentPage - 1].parejas.length || lives === 0}
                                    >
                                        Siguiente
                                    </button>
                                </div>
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
                                {correctAnswers >= data.paginas.length && (
                                    <p className={`text-md font-semibold text-${paleta.color3}`}>
                                        ¡Perfecto!
                                    </p>
                                )}
                                <p className="text-2xl">{Math.round(correctAnswers * 100)}</p>
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

export default Emparejar;