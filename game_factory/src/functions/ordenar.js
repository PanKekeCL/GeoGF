import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import palettes from './palettes';

const Ordenar = () => {
    const data = {};

    const palette = {};

    const [currentPage, setCurrentPage] = useState(0);
    const [shuffledPages, setShuffledPages] = useState([]);
    const [currentOrder, setCurrentOrder] = useState([]);
    const [checkAnswers, setCheckAnswers] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        const pages = data.mezclarPaginas
            ? [...data.paginas].sort(() => Math.random() - 0.5)
            : data.paginas;
        setShuffledPages(pages);
    }, [data.paginas, data.mezclarPaginas]);

    useEffect(() => {
        if (shuffledPages.length > 0) {
            const concepts = [...shuffledPages[currentPage].conceptos].sort(
                () => Math.random() - 0.5
            );
            setCurrentOrder(concepts);
        }
    }, [shuffledPages, currentPage]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const updatedOrder = Array.from(currentOrder);
        const [movedItem] = updatedOrder.splice(result.source.index, 1);
        updatedOrder.splice(result.destination.index, 0, movedItem);

        setCurrentOrder(updatedOrder);
    };

    const confirmAnswer = () => {
        const correctOrder = shuffledPages[currentPage].conceptos.map((c) => c.texto);
        const userOrder = currentOrder.map((c) => c.texto);

        const isCorrect = JSON.stringify(correctOrder) === JSON.stringify(userOrder);
        if (isCorrect) {
            setScore(score + 100);
        }

        setCheckAnswers(true);
    };

    const nextQuestion = () => {
        if (currentPage < shuffledPages.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            setCurrentPage(shuffledPages.length);
        }
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

    const currentQuestion = shuffledPages[currentPage];

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${palette.background}`}>
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
                <h1 className={`text-2xl font-bold text-center mb-4 ${palette.text}`}>{data.nombre}</h1>
                <p className="text-gray-600 text-center mb-4">{data.descripcion}</p>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">{currentQuestion.enunciado}</h2>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="conceptos">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                            >
                                {currentOrder.map((concepto, index) => (
                                    <Draggable
                                        key={concepto.texto}
                                        draggableId={concepto.texto}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                className={`p-4 rounded-lg shadow-md bg-gray-100 ${
                                                    checkAnswers &&
                                                    (currentQuestion.conceptos[index].texto ===
                                                    concepto.texto
                                                        ? "bg-green-200"
                                                        : "bg-red-200")
                                                }`}
                                            >
                                                {concepto.texto}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
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
                            {currentPage < shuffledPages.length - 1 ? "Siguiente" : "Finalizar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ordenar;
