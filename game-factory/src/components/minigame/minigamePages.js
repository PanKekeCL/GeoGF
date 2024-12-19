import React, { useState, useEffect } from 'react';
import AddIcon from '../../assets/icons/addIcon';
import DeleteIcon from '../../assets/icons/deleteIcon';
import Trivia from './trivia';
import Ordenar from './ordenar';
import Emparejar from './emparejar';

const MinigamePages = ({ data, handlePagesChange, minigameType
    /*
    pages,
    currentPage,
    setCurrentPage,
    handleAddPage,
    handleDeletePage,
    handleInputChange,
    handleImageUpload,
    handleDeleteImage,
    handleAnswerChange,
    handleCorrectAnswer,
    handleDeleteAnswer,
    handleAddAnswer,
    handleShuffleAnswers,
    maxPages,
    minijuegoTipo */
}) => {
    const maxPages = 10;
    const [currentPage, setCurrentPage] = useState(null)

    const [pages, setPages] = useState([]);

    useEffect(() => {
        setPages(data || []);
    }, [data]);

    const handlePageChange = (updatedPage) => {
        if (currentPage !== null && currentPage >= 0 && currentPage < pages.length) {
            const updatedPages = pages.map((page, index) =>
                index === currentPage ? updatedPage : page
            );
            setPages(updatedPages);
            handlePagesChange(updatedPages);
        }
    };

    const handleSelectPage = (index) => {
        if (index >= 0 && index < pages.length) {
            setCurrentPage(index); // Usa el índice tal cual
        }
    };

    const handleAddPage = () => {
        const newPage = {
            enunciado: "",
            imagen: "",
            mezclarRespuestas: false,
            respuestas: []
        };
        setPages([...pages, newPage]);
        setCurrentPage(pages.length); // Nuevo índice será pages.length
        handlePagesChange([...pages, newPage]); // Pasar la nueva lista de páginas
    };

    const handleDeletePage = () => {
        if (currentPage !== null && currentPage >= 0 && currentPage < pages.length) {
            if (window.confirm(`¿Estás seguro de que deseas eliminar la página ${currentPage + 1}?`)) {
                const updatedPages = pages.filter((_, index) => index !== currentPage);
                setPages(updatedPages);
                handlePagesChange(updatedPages);
    
                if (updatedPages.length === 0) {
                    setCurrentPage(null);
                } else {
                    const newCurrentPage = currentPage === updatedPages.length ? currentPage - 1 : currentPage;
                    setCurrentPage(newCurrentPage);
                }
            }
        }
    };
    
    return (
        <div className="h-full bg-white p-5 flex flex-col">
            <h1 className="text-center text-xl font-semibold">Páginas del Minijuego</h1>
            <div className="flex justify-between items-center my-4">
                <div className="flex space-x-2">
                    {pages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => handleSelectPage(i)}
                            className={`h-12 w-12 flex items-center justify-center font-normal font-sans text-lg rounded-md ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {i + 1}
                        </button>

                    ))}
                    {pages.length < maxPages && (
                        <button
                            onClick={handleAddPage}
                            className="h-12 w-12 bg-[#97F218] hover:bg-[#87d916] rounded-md flex items-center justify-center"
                            disabled={pages.length >= maxPages}
                            title="Añadir página"
                        >
                            <AddIcon color="#FFFFFF" size={30} />
                        </button>
                    )}
                </div>
                {pages.length > 0 && (
                    <button
                        onClick={() => handleDeletePage()}
                        className="h-12 w-12 bg-[#F2182A] hover:bg-[#D91626] rounded-md flex items-center justify-center"
                        title={`Eliminar página ${currentPage + 1}`}
                    >
                        <DeleteIcon color="#FFFFFF" size={24} />
                    </button>
                )}
            </div>

            {pages.length === 0 ? (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                    <p className="text-gray-400">Añade una página para continuar.</p>
                </div>
            ) : currentPage === null ? (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                    <p className="text-gray-400">Selecciona una página para continuar</p>
                </div>
            ) : minigameType === '' ? (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-md">
                    <p className="text-gray-400">Selecciona un tipo de minijuego para continuar</p>
                </div>
            ) : (
                <div className="flex-grow w-full border p-4 rounded-md overflow-y-auto">

                    {minigameType === 'Trivia' && (
                        <Trivia
                            data={pages[currentPage]}
                            handlePageChange={handlePageChange}
                        />
                    )}
                    {minigameType === 'Ordenar' && (
                        <Ordenar
                            data={pages[currentPage]}
                            handlePageChange={handlePageChange}
                        />
                    )}
                    {minigameType === 'Emparejar' && (
                        <Emparejar
                            data={pages[currentPage]}
                            handlePageChange={handlePageChange}
                        />
                    )}
                </div>

            )}
        </div>
    );
};

export default MinigamePages;
