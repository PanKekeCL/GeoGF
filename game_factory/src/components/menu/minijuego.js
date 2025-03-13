import React from 'react';

function DiseñadorMinijuegos({ goBack }) {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Diseñador de Minijuegos</h2>
            <p>Aquí puedes crear y personalizar tus minijuegos.</p>

            {/* Botón para regresar al menú diseñador */}
            <button
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg"
                onClick={goBack}
            >
                Volver al Menú Diseñador
            </button>
        </div>
    );
}

export default DiseñadorMinijuegos;
