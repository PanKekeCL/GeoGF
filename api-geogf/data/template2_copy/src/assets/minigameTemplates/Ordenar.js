import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const data = DATOS;

const Ordenar = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [concepts, setConcepts] = useState([]);
    const [answerVerified, setAnswerVerified] = useState(false);
    const [correctIndexes, setCorrectIndexes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (data.shufflePages) {
            data.paginas.sort(() => Math.random() - 0.5);
        }
        setConcepts(shuffleArray(data.paginas[currentPage].conceptos));
    }, [currentPage]);

    const shuffleArray = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("index", index);
    };

    const handleDrop = (e, index) => {
        const draggedIndex = e.dataTransfer.getData("index");
        const updatedConcepts = [...concepts];
        const [draggedItem] = updatedConcepts.splice(draggedIndex, 1);
        updatedConcepts.splice(index, 0, draggedItem);
        setConcepts(updatedConcepts);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const verifyAnswer = () => {
        const correctConcepts = data.paginas[currentPage].conceptos;
        const correctIndexes = concepts.map((concept, index) =>
            concept.texto === correctConcepts[index].texto && concept.imagen === correctConcepts[index].imagen ? index : -1
        );
        setCorrectIndexes(correctIndexes);
        setAnswerVerified(true);
    };

    const nextPage = () => {
        setAnswerVerified(false);
        setCorrectIndexes([]);
        if (currentPage + 1 < data.paginas.length) {
            setCurrentPage(currentPage + 1);
        } else {
            navigate("/map");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{data.paginas[currentPage].enunciado}</h2>
            <div className="mb-4">
                {concepts.map((concept, index) => (
                    <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        className={`p-2 mb-2 rounded ${
                            correctIndexes.includes(index) ? "bg-green-300" : "bg-gray-200"
                        }`}
                    >
                        {data.paginas[currentPage].tipoConcepto === "texto" ? (
                            <span>{concept.texto}</span>
                        ) : (
                            <img src={concept.imagen} alt="" className="w-full h-auto" />
                        )}
                    </div>
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
        </div>
    );
};

export default Ordenar;
