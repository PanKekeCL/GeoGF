const fs = require('fs');
const path = require('path');

// Variables Globales
const palettePath = "paletas.json";
const outputFolder = "data"; // Cambié la ruta para que esté en la carpeta 'data'

// Función que normaliza los nombres de los archivos (minúsculas, guiones bajos, sin tildes)
function normalizeFilename(name) {
    // Convertir a minúsculas
    name = name.toLowerCase();
    // Eliminar acentos
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Quitar marcas diacríticas
    // Reemplazar espacios por guiones bajos
    name = name.replace(/\s+/g, '_');
    // Eliminar caracteres no permitidos
    name = name.replace(/[^\w.-]/g, '');
    return name;
}

// Función que evita nombres repetidos
function getUniqueFilename(folderPath, baseName, extension = ".js") {
    // Crear la carpeta si no existe
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    // Construir el nombre base normalizado
    baseName = normalizeFilename(baseName);
    let outputPath = path.join(folderPath, baseName + extension);

    // Agregar un sufijo si el archivo ya existe
    let counter = 1;
    while (fs.existsSync(outputPath)) {
        outputPath = path.join(folderPath, `${baseName}_${counter}${extension}`);
        counter += 1;
    }

    return outputPath;
}

// Función para generar el archivo JavaScript
function generateJsFile(data) {
    // Usar la carpeta "data" para guardar los archivos generados
    const folderPath = outputFolder;

    // Elegir la paleta
    const paletteName = data.paleta || 'Predeterminado';  // Usar "Predeterminado" si no se especifica la paleta
    const palettes = JSON.parse(fs.readFileSync(palettePath, 'utf8')); // Cargar todas las paletas como diccionario
    const palette = palettes[paletteName] || palettes["Predeterminado"]; // Usar "Predeterminado" si no existe la paleta

    // Elegir el tipo de minijuego
    const templatePath = `${data.tipo}.js`;
    if (!fs.existsSync(templatePath)) {
        throw new Error(`No se encontró el archivo de plantilla: ${templatePath}`);
    }
    const template = fs.readFileSync(templatePath, 'utf8'); // Cargar el template específico como archivo JS

    // Reemplazar con la data y paleta escogidas
    let content = template.replace('{DATA}', JSON.stringify(data)).replace('{PALETA}', JSON.stringify(palette));

    // Generar un nombre único para el archivo
    const fileName = getUniqueFilename(folderPath, data.nombre);

    // Guardar el archivo generado
    fs.writeFileSync(fileName, content, 'utf8');

    console.log(`Archivo generado en ${fileName}`);
}

// Exportar la función para que sea accesible desde otros archivos si es necesario
module.exports = generateJsFile;
