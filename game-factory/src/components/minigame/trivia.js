import { React, useState, useEffect } from 'react';
import AddIcon from '../../assets/icons/addIcon';
import RemoveIcon from '../../assets/icons/removeIcon';
import UploadIcon from '../../assets/icons/uploadIcon';

const Trivia = ({ data, handlePageChange }) => {

    const [page, setPage] = useState({
        enunciado: "",
        imagen: "",
        mezclarRespuestas: false,
        respuestas: []
    })

    useEffect(() => {
        console.log("Actualizando pagina actual:", data)
        const { enunciado, imagen, mezclarRespuestas, respuestas } = data;
        setPage({
            enunciado: enunciado || "",
            imagen: imagen || "",
            mezclarRespuestas: mezclarRespuestas || false,
            respuestas: respuestas || []
        });
    }, [data]);

    const handleQuestionChange = (e) => {
        const updatedPage = {
            ...page,
            enunciado: e.target.value
        };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const updatedPage = {
                    ...page,
                    imagen: reader.result
                };
                setPage(updatedPage);
                handlePageChange(updatedPage);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = () => {
        const updatedPage = {
            ...page,
            imagen: ""
        };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const toggleShuffleAnswers = () => {
        const updatedPage = {
            ...page,
            mezclarRespuestas: !page.mezclarRespuestas
        };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleAddAnswer = () => {
        const updatedPage = {
            ...page,
            respuestas: [
                ...page.respuestas,
                { texto: "", correcta: false }
            ]
        };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleAnswerChange = (e, index) => {
        const { value } = e.target;
        const updatedRespuestas = [...page.respuestas];
        updatedRespuestas[index].texto = value;
        setPage({ ...page, respuestas: updatedRespuestas });
        handlePageChange({ ...page, respuestas: updatedRespuestas });
    };

    const toggleAnswerStatus = (e, index) => {
        const { value } = e.target;
        const updatedRespuestas = [...page.respuestas];
        updatedRespuestas[index].correcta = value === 'correcta';
        setPage({ ...page, respuestas: updatedRespuestas });
        handlePageChange({ ...page, respuestas: updatedRespuestas });
    };

    const handleDeleteAnswer = (index) => {
        const updatedPage = {
            ...page,
            respuestas: page.respuestas.filter((_, i) => i !== index)
        };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    return (
        <div>
            {/* enunciado */}
            <div className="mb-4">
                <label className="text-gray-800 font-medium">Enunciado:</label>
                <input
                    type="text"
                    value={page.enunciado || ''}
                    onChange={(e) => handleQuestionChange(e)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Escribe tu pregunta"
                />
            </div>

            {/* Imagen */}
            <div className="mb-4">
                <label className="text-gray-800 font-medium">Imagen:</label>
                <div className="flex items-center space-x-4 mt-2">
                    <label
                        htmlFor={`file-input`}
                        className="h-12 w-12 bg-blue-600 text-white rounded-md cursor-pointer flex items-center justify-center hover:bg-blue-700"
                    >
                        <UploadIcon color="#FFFFFF" size={30} />
                    </label>
                    <input
                        id={`file-input`}
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                    />

                    {/* Imagen o mensaje de "no hay imagen" */}
                    {page.imagen ? (
                        <div className="flex items-center space-x-4">
                            <img
                                alt="Imagen subida"
                                className="max-h-24 max-w-24 rounded-md"
                                src={page.imagen}
                            />
                            <button
                                onClick={handleDeleteImage}
                                className="w-12 h-12 py-2 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                            >
                                <RemoveIcon color="#FFFFFF" size={30}/>
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400">Sube una imagen</p>
                    )}
                </div>
            </div>


            <div className="my-4 flex items-center gap-x-2">
                <label className="text-gray-800 font-medium">
                    ¿Mezclar orden de las respuestas?
                </label>
                <input
                    type="checkbox"
                    checked={page.mezclarRespuestas || false}
                    onChange={toggleShuffleAnswers}
                    className="mt-0.5 w-6 h-6 rounded-md border border-gray-200"
                />
            </div>


            {/* Respuestas */}
            <div>
                <h3 className="text-gray-800 font-medium">Respuestas:</h3>

                {page.respuestas?.map((respuesta, index) => (
                    <div key={index} className="p-4 mb-4 w-full bg-white rounded-md border flex items-center space-x-4">

                        {/* Enumeracion */}
                        <div className="w-[5%] flex justify-center">
                            <span className="text-gray-800 font-medium">{index + 1}</span>
                        </div>

                        {/* Respuesta */}
                        <div className="w-[60%] flex items-center">
                            <input
                                type="text"
                                value={respuesta.texto}
                                onChange={(e) => handleAnswerChange(e, index)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder={`Escribe la respuesta ${index + 1}`}
                            />
                        </div>

                        {/* Correcto o Incorrecto */}
                        <div className="w-[30%] flex items-center">
                            <select
                                value={respuesta.correcta ? 'correcta' : 'incorrecta'}
                                onChange={(e) => toggleAnswerStatus(e, index)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                <option value="correcta">Correcta</option>
                                <option value="incorrecta">Incorrecta</option>
                            </select>
                        </div>

                        {/* Eliminar respuesta */}
                        <div className="w-[5%] flex items-center justify-center">
                            <button
                                onClick={() => handleDeleteAnswer(index)}
                                className="w-12 h-12 py-2 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                                title={`Eliminar respuesta ${index + 1}`}
                            >
                                <RemoveIcon color="#FFFFFF" size={30} />
                            </button>
                        </div>

                    </div>

                ))}

                {page.respuestas?.length < 6 && (
                    <button
                        onClick={handleAddAnswer}
                        className="h-12 w-12 bg-[#97F218] hover:bg-[#87d916] text-white rounded-md flex items-center justify-center"
                        title="Añadir concepto"
                    >
                        <AddIcon color="#FFFFFF" size={30} />
                    </button>
                )}
            </div>
        </div>
    );

};

export default Trivia;
