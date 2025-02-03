const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env ubicado una carpeta atrás
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Leer INPUT_JSON desde las variables de entorno
const inputJson = process.env.INPUT_JSON;
if (!inputJson) {
    console.error('Error: No se encontró INPUT_JSON en el archivo .env.');
    process.exit(1);
}

let data;
try {
    data = JSON.parse(inputJson);
    console.log('Info: Input:', data);
} catch (err) {
    console.error('Error: INPUT_JSON no es un objeto JSON válido.', err);
    process.exit(1);
}

// Utilizar el nombre en el archivo menu.js
async function editMenu(copyPath) {
    const filePath = path.join(copyPath, 'src', 'pages', 'menu.js');  // Cambiar la ruta aquí
    try {
        let content = await fs.readFile(filePath, 'utf8');
        const nombre = data.nombre;
        content = content.replace(/NOMBRE/g, nombre);
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo menu.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar menu.js:', err);
    }
}

// Utilizar las coordenadas en el archivo map.js
async function editMap(copyPath) {
    const filePath = path.join(copyPath, 'src', 'pages', 'map.js');  // Cambiar la ruta aquí
    try {
        let content = await fs.readFile(filePath, 'utf8');
        const [longitude, latitude] = data.geometry.coordinates;
        content = content
            .replace(/LATITUD/g, latitude)
            .replace(/LONGITUD/g, longitude);
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo map.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar map.js:', err);
    }
}

// Utilizar los minijuegos en el archivo markers.js
async function editMarkers(copyPath) {
    const filePath = path.join(copyPath, 'src', 'components', 'markers.js');  // Cambiar la ruta aquí
    try {
        let content = await fs.readFile(filePath, 'utf8');
        const minijuegos = data.minijuegos;

        content = content.replace(/MINIJUEGOS/g, JSON.stringify(minijuegos));
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo markers.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar markers.js:', err);
    }
}

// Utilizar los minijuegos en el archivo list.js
async function editList(copyPath) {
    const filePath = path.join(copyPath, 'src', 'components', 'list.js');  // Cambiar la ruta aquí
    try {
        let content = await fs.readFile(filePath, 'utf8');
        const minijuegos = data.minijuegos;

        content = content.replace(/MINIJUEGOS/g, JSON.stringify(minijuegos));
        await fs.writeFile(filePath, content, 'utf8');
        console.log('Archivo list.js modificado con éxito.');
    } catch (err) {
        console.error('Error al editar list.js:', err);
    }
}

const normalizeString = (str) => {
    return str
        .normalize('NFD') // Normaliza la cadena, descomponiendo caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Elimina los acentos
        .replace(/[^a-zA-Z0-9-_]/g, '') // Elimina símbolos no alfanuméricos
        .replace(/\s+/g, '_'); // Reemplaza los espacios por guiones bajos
};

async function saveImage(imageDataBase64, fileName) {
    try {
        console.log("Iniciando guardado de imagen...");
        
        // Directorio donde se guardarán las imágenes (public/images)
        const imagesDir = path.posix.join('public', 'images');
        console.log("Cabecera de imagen: ", imageDataBase64.substring(0, 50));

        // Verificar si el directorio existe, si no, crearlo
        if (!await fs.pathExists(imagesDir)) {
            await fs.mkdirp(imagesDir);
            console.log('Directorio creado:', imagesDir);
        }

        // Determinar el formato de la imagen
        let extension;
        let base64Data;
        let formatoDetectado = '';

        if (imageDataBase64.startsWith('data:image/png;base64,')) {
            extension = '.png';
            base64Data = imageDataBase64.replace(/^data:image\/png;base64,/, '');
            formatoDetectado = 'PNG';
        } else if (imageDataBase64.startsWith('data:image/jpeg;base64,') || imageDataBase64.startsWith('data:image/jpg;base64,')) {
            extension = '.jpg';
            base64Data = imageDataBase64.replace(/^data:image\/(jpeg|jpg);base64,/, '');
            formatoDetectado = 'JPG/JPEG';
        } else {
            formatoDetectado = imageDataBase64.substring(0, 30) + '...'; // Muestra los primeros 30 caracteres de la base64
            throw new Error('Formato de imagen no soportado');
        }

        console.log('Formato detectado:', formatoDetectado);

        // Normalizar el nombre del archivo (quitar espacios, acentos, etc.)
        let nombreArchivo = normalizeString(fileName) + extension;
        let filePath = path.posix.join(imagesDir, nombreArchivo);

        // Verificar si el archivo ya existe y añadir "_duplicate" si es necesario
        let counter = 1;
        while (await fs.pathExists(filePath)) {
            console.log(`El archivo ${nombreArchivo} ya existe, creando un duplicado...`);
            nombreArchivo = `${fileName}_duplicate${counter}${extension}`;
            filePath = path.posix.join(imagesDir, nombreArchivo);
            counter++;
        }

        console.log('Directorio donde se guardará la imagen:', imagesDir);
        console.log('Ruta del archivo a guardar:', filePath);

        // Convertir la imagen a buffer
        const buffer = Buffer.from(base64Data, 'base64');

        if (!buffer || buffer.length === 0) {
            throw new Error('El buffer de la imagen es inválido o está vacío');
        }

        console.log('Buffer creado correctamente, procediendo a guardar imagen...');

        // Guardar la imagen usando sharp
        await sharp(buffer).toFile(filePath);
        console.log(`Imagen guardada en: ${filePath}`);

        // Retornar la ruta relativa en lugar de la ruta completa
        const relativePath = path.posix.relative('public', filePath);
        return `../../${relativePath}`;
    } catch (error) {
        console.error('Error al guardar la imagen:', error.message);
        return null;
    }
}

async function saveImagesInProject(project) {
    const imagesDir = path.join('src', 'assets', 'images');

    try {
        console.log('Iniciando el proceso de guardado de imágenes en el proyecto.');

        for (const minijuego of project.minijuegos) {
            const minigameName = minijuego.nombre.toLowerCase().replace(/\s+/g, '_');
            console.log(`Procesando minijuego: ${minijuego.nombre}`);

            for (const [index_pagina, pagina] of minijuego.paginas.entries()) {
                console.log(`  Procesando página ${index_pagina + 1} de ${minijuego.nombre}, con tipo ${minijuego.tipo}`);

                // Chequeo en caso de que 'paginas' o 'minijuego' no tengan los datos necesarios
                if (!pagina) {
                    console.error(`Página no encontrada para el minijuego: ${minijuego.nombre}`);
                    continue;
                }

                if (minijuego.tipo === "Emparejar") {
                    for (const [index_pareja, pareja] of pagina.parejas.entries()) {
                        try {
                            console.log(`    Procesando pareja ${index_pareja + 1}`);
                            if (pareja && pareja.imagenIzquierda) {
                                console.log(`      Guardando imagen izquierda de pareja ${index_pareja + 1}`);
                                pareja.imagenIzquierda = await saveImage(pareja.imagenIzquierda, `${minijuego.nombre}_pagina_${index_pagina + 1}_pareja_${index_pareja + 1}`);
                            } else {
                                console.error(`Imagen izquierda no encontrada en pareja ${index_pareja + 1}`);
                            }

                            if (pareja && pareja.imagenDerecha) {
                                console.log(`      Guardando imagen derecha de pareja ${index_pareja + 1}`);
                                pareja.imagenDerecha = await saveImage(pareja.imagenDerecha, `${minijuego.nombre}_pagina_${index_pagina + 1}_pareja_${index_pareja + 1}`);
                            } else {
                                console.error(`Imagen derecha no encontrada en pareja ${index_pareja + 1}`);
                            }
                        } catch (error) {
                            console.error(`Error al guardar imágenes de pareja en página ${index_pagina + 1}:`, error);
                        }
                    }
                }

                if (minijuego.tipo === "Ordenar") {
                    for (const [index_concepto, concepto] of pagina.conceptos.entries()) {
                        try {
                            console.log(`    Procesando concepto ${index_concepto + 1}`);
                            if (concepto) {
                                console.log(`      Guardando imagen de concepto ${index_concepto + 1}`);
                                concepto.imagen = await saveImage(concepto.imagen, `${minijuego.nombre}_pagina_${index_pagina + 1}_concepto_${index_concepto + 1}`);
                            } else {
                                console.error(`Concepto no encontrado en la página ${index_pagina + 1}`);
                            }
                        } catch (error) {
                            console.error(`Error al guardar imagen de concepto en página ${index_pagina + 1}:`, error);
                        }
                    }
                }

                if (minijuego.tipo === "Trivia") {
                    try {
                        console.log(`    Guardando imagen para página ${index_pagina + 1} de tipo trivia`);
                        pagina.imagen = await saveImage(pagina.imagen, `${minijuego.nombre}_pagina_${index_pagina + 1}`);
                    } catch (error) {
                        console.error(`Error al guardar imagen en página ${index_pagina + 1} del tipo trivia:`, error);
                    }
                }
            }
        }

        console.log('Proceso completado con éxito.');
    } catch (error) {
        console.error('Error al procesar el proyecto:', error);
    }
}


async function editMinigames(copyPath) {
    console.log('Inicio de la función editMinigames');
    const templatesDir = path.join(copyPath, 'src', 'assets', 'minigameTemplates');
    const minigamesDir = path.join(copyPath, 'src', 'pages', 'minigames');

    try {
        console.log('Verificando si data y data.minijuegos están definidos');
        if (!data) {
            throw new Error('El objeto data no está definido');
        }
        if (!data.minijuegos) {
            throw new Error('El objeto data.minijuegos no está definido');
        }

        console.log('Recorriendo los minijuegos');
        for (const minijuego of data.minijuegos) {
            console.log(`Procesando minijuego: ${minijuego.nombre}`);

            const templateFilePath = path.join(templatesDir, `${minijuego.tipo}.js`);
            const formattedName = minijuego.nombre
                .toLowerCase()
                .replace(/\s+/g, '_')
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
            let newFilePath = path.join(minigamesDir, `${formattedName}.js`);
            let counter = 1;

            while (await fs.pathExists(newFilePath)) {
                console.log(`El archivo ${newFilePath} ya existe, creando un nuevo nombre`);
                newFilePath = path.join(minigamesDir, `${formattedName}_(${counter}).js`);
                counter++;
            }

            console.log(`Copiando plantilla de ${templateFilePath} a ${newFilePath}`);
            await fs.copy(templateFilePath, newFilePath);
            let content = await fs.readFile(newFilePath, 'utf8');
            content = content.replace(/DATOS/g, JSON.stringify(minijuego));
            console.log(`Escribiendo datos en el archivo ${newFilePath}`);
            await fs.writeFile(newFilePath, content, 'utf8');
            console.log(`Archivo creado: ${newFilePath}`);
        }
    } catch (err) {
        console.error('Error al crear archivos personalizados para los minijuegos:', err);
    }
}


// Función principal para ejecutar las operaciones
async function buildProject() {
    try {
        const copyPath = path.join(__dirname, '..');;  // Cambiar la ruta aquí
        await saveImagesInProject(data);
        await editMenu(copyPath);
        await editMap(copyPath);
        await editMarkers(copyPath);
        await editList(copyPath);
        await editMinigames(copyPath);
        console.log('Proyecto construido con éxito.');
    } catch (err) {
        console.error('Error al construir el proyecto:', err);
    }
}

buildProject();
