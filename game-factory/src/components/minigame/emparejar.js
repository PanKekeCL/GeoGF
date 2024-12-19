import React, { useState, useEffect } from 'react';
import UploadIcon from '../../assets/icons/uploadIcon';
import AddIcon from '../../assets/icons/addIcon';
import RemoveIcon from '../../assets/icons/removeIcon';

const Emparejar = ({ data, handlePageChange }) => {
    const [page, setPage] = useState({
        enunciado: "",
        tipoIzquierdo: "",
        tipoDerecho: "",
        parejas: []
    });

    useEffect(() => {
        const { enunciado, tipoIzquierdo, tipoDerecho, parejas } = data || {};
        setPage({
            enunciado: enunciado || "",
            tipoIzquierdo: tipoIzquierdo || "",
            tipoDerecho: tipoDerecho || "",
            parejas: parejas || []
        });
    }, [data]);

    const handleStatementChange = (e) => {
        updatePage({ enunciado: e.target.value });
    };

    const handleSelectorChange = (side, value) => {
        updatePage({ [side]: value });
    };

    const handlePairChange = (e, index, side) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            updatePair(index, side, imageUrl);
        }
    };

    const handleAddPair = () => {
        const newPair = {
            textoIzquierdo: "",
            textoDerecho: "",
            imagenIzquierda: "",
            imagenDerecha: ""
        };
        updatePage({ parejas: [...page.parejas, newPair] });
    };

    const handleDeletePair = (index) => {
        updatePage({ parejas: page.parejas.filter((_, i) => i !== index) });
    };

    const updatePage = (updatedFields) => {
        const updatedPage = { ...page, ...updatedFields };
        setPage(updatedPage);
        handlePageChange(updatedPage);
    };

    const updatePair = (index, side, value) => {
        const updatedPairs = page.parejas.map((pair, i) =>
            i === index ? { ...pair, [side]: value } : pair
        );
        updatePage({ parejas: updatedPairs });
    };

    const handleDeleteImage = (index, side) => {
        const updatedPairs = page.parejas.map((pair, i) =>
            i === index ? { ...pair, [side]: "" } : pair
        );
        updatePage({ parejas: updatedPairs });
    };

    return (
        <div>
            <div className="mb-4">
                <label className="text-gray-800 font-medium">Enunciado:</label>
                <input
                    type="text"
                    value={page.enunciado}
                    onChange={handleStatementChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Escribe el enunciado"
                />
            </div>

            <h2 className="text-gray-800 font-medium mb-4">Parejas:</h2>

            <div className="mb-4 flex space-x-4 items-center">
                <div className="w-[5.5%] bg-white"></div>
                <div className="flex-1">
                    <label className="text-gray-800">Concepto izquierdo:</label>
                    <select
                        value={page.tipoIzquierdo}
                        onChange={(e) => handleSelectorChange('tipoIzquierdo', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="texto">Texto</option>
                        <option value="imagen">Imagen</option>
                    </select>
                </div>

                <div className="flex-1">
                    <label className="text-gray-800">Concepto derecho:</label>
                    <select
                        value={page.tipoDerecho}
                        onChange={(e) => handleSelectorChange('tipoDerecho', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="texto">Texto</option>
                        <option value="imagen">Imagen</option>
                    </select>
                </div>

                <div className="w-[5.5%] bg-white"></div>
            </div>

            <div>
                {page.parejas.map((pareja, index) => (
                    <div key={index} className="flex items-center space-x-4 mb-4 border rounded-md p-2">

                        <div className="w-[5%] flex justify-center">
                            <span className="text-gray-800 font-medium">{index + 1}</span>
                        </div>

                        <div className="w-[45%]">
                            {page.tipoIzquierdo === 'imagen' ? (
                                <div className="flex items-center space-x-4">
                                    <label
                                        htmlFor={`upload-izquierda-${index}`}
                                        className="h-12 w-12 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center cursor-pointer"
                                    >
                                        <UploadIcon color="#FFFFFF" size={30} />
                                    </label>
                                    <input
                                        id={`upload-izquierda-${index}`}
                                        type="file"
                                        onChange={(e) => handlePairChange(e, index, 'imagenIzquierda')}
                                        className="hidden"
                                    />
                                    {pareja.imagenIzquierda ? (
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={pareja.imagenIzquierda}
                                                alt={`Concepto Izquierda ${index + 1}`}
                                                className="max-h-24 max-w-24 rounded-md"
                                            />
                                            <button
                                                onClick={() => handleDeleteImage(index, 'imagenIzquierda')}
                                                className="w-12 h-12 py-2 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                                            >
                                                <RemoveIcon color="#FFFFFF" size={30} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">Sube una imagen</p>
                                    )}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={pareja.textoIzquierdo}
                                    onChange={(e) => updatePair(index, 'textoIzquierdo', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Escribe el texto"
                                />
                            )}
                        </div>

                        <div className="w-[45%]">
                            {page.tipoDerecho === 'imagen' ? (
                                <div className="flex items-center space-x-4">
                                    <label
                                        htmlFor={`upload-derecha-${index}`}
                                        className="h-12 w-12 bg-blue-600 hover:bg-blue-700 rounded-md flex items-center justify-center cursor-pointer"
                                    >
                                        <UploadIcon color="#FFFFFF" size={30} />
                                    </label>
                                    <input
                                        id={`upload-derecha-${index}`}
                                        type="file"
                                        onChange={(e) => handlePairChange(e, index, 'imagenDerecha')}
                                        className="hidden"
                                    />
                                    {pareja.imagenDerecha ? (
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={pareja.imagenDerecha}
                                                alt={`Concepto Derecha ${index + 1}`}
                                                className="max-h-24 max-w-24 rounded-md"
                                            />
                                            <button
                                                onClick={() => handleDeleteImage(index, 'imagenDerecha')}
                                                className="w-12 h-12 py-2 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                                            >
                                                <RemoveIcon color="#FFFFFF" size={30} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400">Sube una imagen</p>
                                    )}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={pareja.textoDerecho}
                                    onChange={(e) => updatePair(index, 'textoDerecho', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Escribe el texto"
                                />
                            )}
                        </div>

                        <div className="w-[5%] flex justify-center">
                            <button
                                onClick={() => handleDeletePair(index)}
                                className="h-12 w-12 bg-[#F2182A] hover:bg-[#D91626] text-white rounded-md flex items-center justify-center"
                            >
                                <RemoveIcon color="#FFFFFF" size={30} />
                            </button>
                        </div>
                    </div>
                ))}

                {page.parejas.length < 6 && (
                    <button
                        onClick={handleAddPair}
                        className="h-12 w-12 bg-[#97F218] hover:bg-[#87d916] rounded-md flex items-center justify-center"
                        title="Añadir pareja"
                    >
                        <AddIcon color="#FFFFFF" size={30} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Emparejar;
