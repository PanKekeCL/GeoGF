import React, { useState, useEffect } from 'react';
import UploadIcon from '../../assets/icons/uploadIcon';
import RemoveIcon from '../../assets/icons/removeIcon';
import AddIcon from '../../assets/icons/addIcon';

const Ordenar = ({ data, handlePageChange }) => {
    const maxConcepts = 6;

    const [page, setPage] = useState({
        enunciado: '',
        tipoConcepto: 'texto',
        conceptos: []
    });

    useEffect(() => {
        const { enunciado, tipoConcepto, conceptos } = data;
        setPage({
            enunciado: enunciado || '',
            tipoConcepto: tipoConcepto || 'texto',
            conceptos: conceptos || []
        });
    }, [data]);

    const handleInputChange = (e) => {
        const updatedPage = { ...page, enunciado: e.target.value };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleSelectorChange = (e) => {
        const updatedPage = { ...page, tipoConcepto: e.target.value };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleAddConcept = () => {
        const updatedPage = {
            ...page,
            conceptos: [...page.conceptos, { texto: '', imagen: null }]
        };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleDeleteConcept = (index) => {
        const updatedConceptos = page.conceptos.filter((_, i) => i !== index);
        const updatedPage = { ...page, conceptos: updatedConceptos };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleConceptChange = (e, index) => {
        const updatedConceptos = page.conceptos.map((concepto, i) =>
            i === index ? { ...concepto, texto: e.target.value } : concepto
        );
        const updatedPage = { ...page, conceptos: updatedConceptos };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const handleFileChange = (e, index) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            const updatedConceptos = page.conceptos.map((concepto, i) =>
                i === index ? { ...concepto, imagen: reader.result } : concepto
            );
            const updatedPage = { ...page, conceptos: updatedConceptos };
            setPage(updatedPage);
            handlePageChange(updatedPage);
        };
        reader.readAsDataURL(file);  // Leemos el archivo como URL base64
    };

    const handleRemoveImage = (index) => {
        const updatedConceptos = page.conceptos.map((concepto, i) =>
            i === index ? { ...concepto, imagen: null } : concepto
        );
        const updatedPage = { ...page, conceptos: updatedConceptos };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    return (
        <div>
            <div className="mb-4">
                <label className="text-gray-800 font-medium">Enunciado:</label>
                <input
                    type="text"
                    value={page.enunciado}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Escribe el enunciado"
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-800 font-medium">Tipo de conceptos:</label>
                <select
                    value={page.tipoConcepto}
                    onChange={handleSelectorChange}
                    className="w-full p-2 border border-gray-200 rounded-md"
                >
                    <option value="texto">Texto</option>
                    <option value="imagen">Imagen</option>
                </select>
            </div>

            <div>
                <p className="block text-gray-800 font-medium">Conceptos a ordenar:</p>
                {page.conceptos.map((concepto, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4 border rounded-md">
                        <div className="w-8 text-right font-bold text-gray-800">
                            {index + 1}
                        </div>

                        <div className="flex-grow p-2">
                            {page.tipoConcepto === 'imagen' ? (
                                <div className="flex items-center space-x-4">
                                    <label
                                        htmlFor={`file-input-${index}`}
                                        className="h-12 w-12 bg-blue-600 text-white rounded-md cursor-pointer flex items-center justify-center hover:bg-blue-700"
                                    >
                                        <UploadIcon color="#FFFFFF" size={30} />
                                    </label>
                                    <input
                                        id={`file-input-${index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, index)}
                                        className="hidden"
                                    />
                                    {concepto.imagen ? (
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={concepto.imagen}  // Asegúrate de que la URL base64 se usa aquí
                                                alt={`Concepto ${index + 1}`}
                                                className="max-h-24 max-w-24 rounded-md"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="h-8 w-8 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                                                title="Eliminar imagen"
                                            >
                                                <RemoveIcon color="#FFFFFF" size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">Sube una imagen</p>
                                    )}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={concepto.texto || ''}
                                    onChange={(e) => handleConceptChange(e, index)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder={`Escribe el concepto ${index + 1}`}
                                />
                            )}
                        </div>

                        <button
                            onClick={() => handleDeleteConcept(index)}
                            className="h-12 w-12 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                            title="Eliminar concepto"
                        >
                            <RemoveIcon color="#FFFFFF" size={30} />
                        </button>
                    </div>
                ))}

                {page.conceptos.length < maxConcepts && (
                    <button
                        onClick={handleAddConcept}
                        className="h-12 w-12 bg-[#97F218] hover:bg-[#87d916] text-white rounded-md flex items-center justify-center"
                        title="Añadir concepto"
                    >
                        <AddIcon color="#FFFFFF" size={30} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Ordenar;
