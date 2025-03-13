const fs = require('fs-extra');
const path = require('path');

// Entrada de datos simulada (puedes reemplazar esto con tu input real)
const input = {
    nombre: "Test Data",
    descripcion: "Estos son datos de prueba para la correcta ejecucion del Builder",

    geometry: {
        coordinates: [-33.4489, -70.6693], // Ejemplo: latitud y longitud de Santiago, Chile
    },
};

// Utilzar el Nombre en el archivo menu.js
async function editMenu(copyPath) {
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
async function editMap(copyPath) {
    const filePath = path.join(copyPath, 'src', 'pages', 'map.js');
    try {
        // Leer  archivo
        let content = await fs.readFile(filePath, 'utf8');
        // Leer variables
        const [latitude, longitude] = input.geometry.coordinates;
        // Actualizar archivo
        content = content
            .replace(/LATITUD/g, latitude)
            .replace(/LONGITUD/g, longitude);
        // Guardar los cambios
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo map.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar map.js:', err);
    }
}

// Utilizar los minijuegos en el archivo markers.js
async function editMarkers(copyPath) {
    const filePath = path.join(copyPath, 'src', 'components', 'markers.js');
    try {
        // Leer  archivo
        let content = await fs.readFile(filePath, 'utf8');
        // Leer variables
        const minijuegos = input.minijuegos;
        // Actualizar archivo
        content = content
            .replace(/MINIJUEGOS/g, minijuegos);
        // Guardar los cambios
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo markers.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar markers.js:', err);
    }
}

// Utilizar los minijuegos en el archivo markers.js
async function editList(copyPath) {
    const filePath = path.join(copyPath, 'src', 'components', 'list.js');
    try {
        // Leer  archivo
        let content = await fs.readFile(filePath, 'utf8');
        // Leer variables
        const minijuegos = input.minijuegos;
        // Actualizar archivo
        content = content
            .replace(/MINIJUEGOS/g, minijuegos);
        // Guardar los cambios
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo list.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar list.js:', err);
    }
}

// Crear archivos personalizados para cada minijuego
async function editMinigames(copyPath) {
    const minigamesDir = path.join(copyPath, 'src', 'pages', 'minigames');

    try {
        for (const minijuego of input.minijuegos) {
            const originalFilePath = path.join(minigamesDir, `${minijuego.tipo}.js`);

            // Generar el nuevo nombre del archivo
            const formattedName = minijuego.nombre
                .toLowerCase()
                .replace(/\s+/g, '_')
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            let newFilePath = path.join(minigamesDir, `${formattedName}.js`);
            let counter = 1;

            // Evitar sobrescribir archivos existentes
            while (await fs.pathExists(newFilePath)) {
                newFilePath = path.join(minigamesDir, `${formattedName}_(${counter}).js`);
                counter++;
            }

            // Copiar el archivo base y personalizarlo
            await fs.copy(originalFilePath, newFilePath);
            let content = await fs.readFile(newFilePath, 'utf8');
            content = content.replace(/MINIJUEGO/g, JSON.stringify(minijuego));
            await fs.writeFile(newFilePath, content, 'utf8');
            console.log(`Archivo creado: ${newFilePath}`);
        }

        // Eliminar archivos base (comentado por ahora)
        // await fs.remove(path.join(minigamesDir, 'trivia.js'));
        // await fs.remove(path.join(minigamesDir, 'ordenar.js'));
        // await fs.remove(path.join(minigamesDir, 'emparejar.js'));

    } catch (err) {
        console.error('Error al crear archivos personalizados para los minijuegos:', err);
    }
}

// Función principal para ejecutar las operaciones
async function buildProject() {
    const copyPath = path.join(__dirname, 'template_copy');

    await editMenu(copyPath);
    await editMap(copyPath);
    await editMarkers(copyPath);
    await editList(copyPath);
    await editMinigames(copyPath);
}

buildProject();
