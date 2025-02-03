import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const data = {"_id":"679bbd2db73000d63b65527e","nombre":"Emparejar 30","descripcion":"","tipo":"Emparejar","geometry":{"type":"Point","coordinates":[-73.24976992608755,-39.804898854437646]},"paginas":[{"enunciado":"Une el Beacon con su Imagen","tipoIzquierdo":"imagen","tipoDerecho":"","parejas":[{"textoIzquierdo":"","textoDerecho":"Beacon","imagenIzquierda":"../../images/Emparejar30_pagina_1_pareja_1.png","imagenDerecha":""}]}]};

const Emparejar = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPairs, setSelectedPairs] = useState({});
    const [answerVerified, setAnswerVerified] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const navigate = useNavigate();

    useEffect(() => {
        if (data.shufflePages) {
            data.paginas.sort(() => Math.random() - 0.5);
        }
    }, []);

    const handleDragStart = (e, id, side) => {
        e.dataTransfer.setData("id", id);
        e.dataTransfer.setData("side", side);
    };

    const handleDrop = (e, id, side) => {
        const draggedId = e.dataTransfer.getData("id");
        const draggedSide = e.dataTransfer.getData("side");
        
        if (side !== draggedSide) {
            setSelectedPairs((prev) => ({
                ...prev,
                [draggedSide === "left" ? id : draggedId]: draggedSide === "left" ? draggedId : id,
            }));
        }
    };

    const verifyAnswer = () => {
        const pagina = data.paginas[currentPage];
        let correctCount = 0;

        pagina.conceptos.forEach((concepto, index) => {
            if (selectedPairs[index] === `${index}`) {
                correctCount++;
            }
        });

        setCorrectAnswers(correctAnswers + correctCount);
        setAnswerVerified(true);
    };

    const nextPage = () => {
        setAnswerVerified(false);
        setSelectedPairs({});
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {data.paginas[currentPage - 1].conceptos.map((concepto, index) => (
                                <div
                                    key={index}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, `${index}`, "left")}
                                    className="p-2 bg-gray-200 rounded mb-2"
                                >
                                    {data.paginas[currentPage - 1].tipoIzquierdo === "Texto"
                                        ? concepto.TextoIzquierdo
                                        : <img src={concepto.ImagenIzquierda} alt="" />}
                                </div>
                            ))}
                        </div>
                        <div>
                            {data.paginas[currentPage - 1].conceptos.map((concepto, index) => (
                                <div
                                    key={index}
                                    onDrop={(e) => handleDrop(e, `${index}`, "right")}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="p-2 bg-gray-200 rounded mb-2"
                                >
                                    {data.paginas[currentPage - 1].tipoDerecho === "Texto"
                                        ? concepto.TextoDerecho
                                        : <img src={concepto.ImagenDerecha} alt="" />}
                                </div>
                            ))}
                        </div>
                    </div>
                    {!answerVerified ? (
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded mt-4"
                            onClick={verifyAnswer}
                        >
                            Comprobar
                        </button>
                    ) : (
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                            onClick={nextPage}
                        >
                            Siguiente
                        </button>
                    )}
                    {answerVerified && (
                        <p className="mt-4">
                            {`Correctos: ${correctAnswers} / ${data.paginas[currentPage - 1].conceptos.length}`}
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default Emparejar;
