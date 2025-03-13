const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Función para copiar la carpeta "template"
async function copyTemplate(templatePath, copyPath) {
    try {
        console.log(`Creando copia de la carpeta desde "${templatePath}" hacia "${copyPath}"...`);
        await fs.copy(templatePath, copyPath);
        console.log('Copia creada exitosamente.');
    } catch (err) {
        console.error('Error al copiar la carpeta template:', err);
        throw err;
    }
}

// Función para ejecutar "npm build" dentro de la copia
async function runNPM(copyPath, input) {
    return new Promise((resolve, reject) => {
        console.log('Ejecutando npm build en template_copy...');
        const command = `npm run build -- "${JSON.stringify(input)}"`;
        exec(command, { cwd: copyPath }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al ejecutar npm build: ${error.message}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Error en npm build: ${stderr}`);
                reject(new Error(stderr));
                return;
            }
            console.log(`npm build completado:\n${stdout}`);
            resolve(stdout);
        });
    });
}

// Función principal para ejecutar las operaciones
async function prebuildProject(input, templatePath, copyPath) {
    try {
        await copyTemplate(templatePath, copyPath);
        // await runNPM(copyPath, input);
    } catch (err) {
        console.error('Error durante la ejecución de prebuild.js:', err);
    }
}

// Obtener los argumentos de la línea de comandos
const args = process.argv.slice(2);
let input = null;

try {
    // Suponemos que el input se pasa como un string JSON en la línea de comandos
    input = JSON.parse(args[0]); // El primer argumento es el JSON del proyecto
} catch (err) {
    console.error('Error al parsear el argumento del input:', err);
    process.exit(1);
}

// Rutas para la plantilla y la copia
const templatePath = path.join(__dirname, 'template'); // Ruta de origen
const copyPath = path.join(__dirname, 'template_copy'); // Ruta de destino

// Ejecutar prebuild con el input proporcionado
if (input) {
    prebuildProject(input, templatePath, copyPath);
}
