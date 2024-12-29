import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import palettes from './palettes';

const Emparejar = () => {
    const data = {};
    const palette = {};

    const [currentPage, setCurrentPage] = useState(0);
    const [currentPairs, setCurrentPairs] = useState([]);
    const [shuffledLeft, setShuffledLeft] = useState([]);
    const [shuffledRight, setShuffledRight] = useState([]);
    const [checkAnswers, setCheckAnswers] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const currentData = data.paginas[currentPage];
        const { parejas } = currentData;

        setCurrentPairs(parejas);
        setShuffledLeft([...parejas].sort(() => Math.random() - 0.5));
        setShuffledRight([...parejas].sort(() => Math.random() - 0.5));
    }, [currentPage]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const updatedLeft = Array.from(shuffledLeft);
        const [movedItem] = updatedLeft.splice(result.source.index, 1);
        updatedLeft.splice(result.destination.index, 0, movedItem);

        setShuffledLeft(updatedLeft);
    };

    const confirmAnswer = () => {
        const correctPairs = currentPairs.map(pair => pair.TextoIzquierdo + pair.TextoDerecho);
        const userPairs = shuffledLeft.map((item, index) => item.TextoIzquierdo + shuffledRight[index].TextoDerecho);

        const correctCount = userPairs.filter(pair => correctPairs.includes(pair)).length;
        setScore(score + correctCount * 100);

        setCheckAnswers(true);
    };

    const nextQuestion = () => {
        if (currentPage < data.paginas.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(data.paginas.length);
        }
        setCheckAnswers(false);
    };

    if (currentPage >= data.paginas.length) {
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

    const currentQuestion = data.paginas[currentPage];

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${palette.background}`}>
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className={`text-2xl font-bold text-center mb-4 ${palette.text}`}>{data.nombre}</h1>
                <p className="text-gray-600 text-center mb-4">{data.descripcion}</p>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{currentQuestion.enunciado}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="leftColumn">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                    {shuffledLeft.map((item, index) => (
                                        <Draggable key={item.TextoIzquierdo} draggableId={item.TextoIzquierdo} index={index}>
                                            {(provided) => (
                                                <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    className="p-4 rounded-lg shadow-md bg-gray-100"
                                                >
                                                    {currentQuestion.tipoIzquierdo === "Texto" ? item.TextoIzquierdo : <img src={item.ImagenIzquierda} alt="" />}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                        <Droppable droppableId="rightColumn">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                    {shuffledRight.map((item, index) => (
                                        <div
                                            key={item.TextoDerecho}
                                            className="p-4 rounded-lg shadow-md bg-gray-100"
                                        >
                                            {currentQuestion.tipoDerecho === "Texto" ? item.TextoDerecho : <img src={item.ImagenDerecha} alt="" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <div className="mt-6 text-center">
                    {!checkAnswers ? (
                        <button
                            onClick={confirmAnswer}
                            className={`px-6 py-2 rounded-lg ${palette.button.default}`}
                        >
                            Confirmar
                        </button>
                    ) : (
                        <button
                            onClick={nextQuestion}
                            className={`px-6 py-2 rounded-lg ${palette.button.default}`}
                        >
                            {currentPage < data.paginas.length - 1 ? "Siguiente" : "Finalizar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Emparejar;
