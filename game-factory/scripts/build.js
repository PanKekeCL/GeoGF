const fs = require('fs-extra');
const path = require('path');

// Entrada de datos simulada (puedes reemplazar esto con tu input real)
const input = {
    geometry: {
        coordinates: [-33.4489, -70.6693], // Ejemplo: latitud y longitud de Santiago, Chile
    },
};

// Utilzar el Nombre en el archivo menu.js
async function editMenu() {
    const filePath = path.join(copyPath, 'src', 'pages', 'menu.js');
    try {
        // Leer archivo
        let content = await fs.readFile(filePath, 'utf8');
        // Leer variables
        const nombre = input.nombre;
        // Actualizar archivo
        content = content.replace(/NOMBRE/g, nombre);
        // Guardar los cambios
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo map.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar map.js:', err);
    }
}

// Utilizar las coordenadas en el archivo map.js
async function editMapFile() {
    const mapFilePath = path.join(copyPath, 'src', 'pages', 'map.js');

    try {
        // Leer el contenido del archivo
        let content = await fs.readFile(mapFilePath, 'utf8');

        // Reemplazar LATITUD y LONGITUD por los valores del input
        const [latitude, longitude] = input.geometry.coordinates;
        content = content
            .replace(/LATITUD/g, latitude)
            .replace(/LONGITUD/g, longitude);

        // Guardar los cambios
        await fs.writeFile(mapFilePath, content, 'utf8');
        console.log('Archivo map.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar map.js:', err);
    }
}

// Función principal para ejecutar las operaciones
async function buildProject() {
    await copyTemplate();
    await editMapFile();
}

buildProject();
