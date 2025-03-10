import shutil
import os
import subprocess
import json
import sys

def copy_template(template_path, copy_path):
    try:
        # Eliminar template_copy si ya existe
        if os.path.exists(copy_path):
            print(f"Deleting already existing copy...")
            shutil.rmtree(copy_path)
            print("SUCCESS.")

        # Copiar la plantilla
        print(f"Copying folder...")
        shutil.copytree(template_path, copy_path)
        print("SUCCESS.")
    except Exception as e:
        print(f"Error while copying: {e}")
        raise

def run_npm(copy_path, input_data):
    try:
        if not os.path.exists(copy_path):
            raise Exception(f"El directorio {copy_path} no existe.")
        print(f"Ejecutando comandos en directorio {copy_path}")

        print(f"Path: {copy_path}")
        input_json = json.dumps(input_data)

        # Escribir input_data en el archivo .env
        env_path = os.path.join(copy_path, '.env')
        with open(env_path, 'w') as env_file:
            env_file.write(f"INPUT_JSON='{input_json}'\n")

        # Imprimir contenido del archivo .env para verificar
        with open(env_path, 'r') as env_file:
            print(f"Contenido de .env:\n{env_file.read()}")

        # Ejecutar comandos npm
        command = ['npm', 'install']
        print(f"Ejecutando: {command}")
        result = subprocess.run(command, cwd=copy_path, text=True, shell=True, capture_output=True)

        command = ['npm', 'i', 'sharp']
        print(f"Ejecutando: {command}")
        result = subprocess.run(command, cwd=copy_path, text=True, shell=True, capture_output=True)

        command = ['npm', 'i', 'fs-extra']
        print(f"Ejecutando: {command}")
        result = subprocess.run(command, cwd=copy_path, text=True, shell=True, capture_output=True)

        command = ['npm', 'install', '-D', 'tailwindcss', 'postcss', 'autoprefixer']
        print(f"Ejecutando: {command}")
        result = subprocess.run(command, cwd=copy_path, text=True, shell=True, capture_output=True)

        command = ['npx', 'tailwindcss', 'init', '--full']
        print(f"Ejecutando: {command}")
        result = subprocess.run(command, cwd=copy_path, text=True, shell=True, capture_output=True)

        tailwind_config_path = os.path.join(copy_path, 'tailwind.config.js')

        if os.path.exists(tailwind_config_path):
            with open(tailwind_config_path, 'r') as file:
                config_content = file.read()
            
            # Reemplazar la sección 'content' y agregar 'safelist' al archivo
            config_content = config_content.replace(
                'content: []', 
                '''content: [
                    "./src/**/*.{js,jsx,ts,tsx}"
                ],\n        safelist: [
                    // Aseguramos que todos los colores de fondo, borde y texto estén disponibles.
                    // bg-{color}, border-{color}, text-{color}
                    // Para cada color base y sus tonos:

                    // Colores base y tonos para fondo (bg), borde (border) y texto (text)
                    ...['blue', 'green', 'red', 'yellow', 'pink', 'purple', 'indigo', 'teal', 'orange', 'lime', 'emerald', 'rose', 'gray', 'amber', 'brown', 'cyan', 'sky', 'violet', 'fuchsia', 'neutral']
                    .map(color => [
                        `bg-${color}-100`, `bg-${color}-200`, `bg-${color}-300`, `bg-${color}-400`, `bg-${color}-500`, `bg-${color}-600`, `bg-${color}-700`, `bg-${color}-800`, `bg-${color}-900`,
                        `border-${color}-100`, `border-${color}-200`, `border-${color}-300`, `border-${color}-400`, `border-${color}-500`, `border-${color}-600`, `border-${color}-700`, `border-${color}-800`, `border-${color}-900`,
                        `text-${color}-100`, `text-${color}-200`, `text-${color}-300`, `text-${color}-400`, `text-${color}-500`, `text-${color}-600`, `text-${color}-700`, `text-${color}-800`, `text-${color}-900`
                    ])
                    .flat(),
                    
                    // Si utilizas colores personalizados, asegúrate de agregar los de tus paletas aquí:
                    "bg-white", "text-white", "border-white", "bg-black", "text-black", "border-black",
                    "bg-transparent", "text-transparent", "border-transparent"
                ]'''
            )

            # Escribir el contenido modificado en el archivo
            with open(tailwind_config_path, 'w') as file:
                file.write(config_content)

        command = ['npm', 'run', 'build']
        print(f"Ejecutando: {command}")
        result = subprocess.run(command, cwd=copy_path, text=True, shell=True, capture_output=True)
        
        print(f"STDOUT:\n{result.stdout}")
        print(f"STDERR:\n{result.stderr}")

        if result.returncode != 0:
            print(f"Error al ejecutar npm build: {result.stderr}")
            raise Exception(result.stderr)

        print(f"npm build completado:\n{result.stdout}")
    except Exception as e:
        print(f"Error al ejecutar npm build: {e}")
        raise

def prebuild_project(input_data, template_path, copy_path):
    try:
        copy_template(template_path, copy_path)
        run_npm(copy_path, input_data)
    except Exception as e:
        print(f"Error durante la ejecución del proceso de prebuild: {e}")

if __name__ == "__main__":
    # Obtener el archivo JSON como argumento
    if len(sys.argv) < 2:
        print("Falta el argumento de entrada (ruta del archivo JSON).")
        sys.exit(1)

    try:
        # Leer el JSON desde el archivo pasado como argumento
        input_file = sys.argv[1]
        with open(input_file, 'r', encoding="utf-8") as f:
            input_data = json.load(f)  # Leer el JSON desde el archivo
    except json.JSONDecodeError as e:
        print(f"Error al parsear el JSON del archivo: {e}")
        sys.exit(1)
    except FileNotFoundError as e:
        print(f"Archivo no encontrado: {e}")
        sys.exit(1)

    # Imprimir el directorio actual
    print(f"El código se está ejecutando en el directorio: {os.getcwd()}")

    # Rutas para la plantilla y la copia
    template_path = os.path.join(os.getcwd(), 'data', 'template')  # Ruta de la plantilla
    copy_path = os.path.abspath(os.path.join(os.getcwd(), '..', 'your_project')) # Ruta del proyecto construido

    # Ejecutar el proceso de prebuild con el input proporcionado
    prebuild_project(input_data, template_path, copy_path)
