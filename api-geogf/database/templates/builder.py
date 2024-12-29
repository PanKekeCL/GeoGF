import os
import json
import re
import unicodedata

# Variables Globales
palette_path = "paletas.json"
output_folder = "data"  # Cambié la ruta para que esté en la carpeta 'data'

# Función que normaliza los nombres de los archivos (minúsculas, guiones bajos, sin tildes)
def normalize_filename(name):
    # Convertir a minúsculas
    name = name.lower()
    # Eliminar acentos
    name = ''.join(
        c for c in unicodedata.normalize('NFD', name)
        if unicodedata.category(c) != 'Mn'
    )
    # Reemplazar espacios por guiones bajos
    name = re.sub(r'\s+', '_', name)
    # Eliminar caracteres no permitidos
    name = re.sub(r'[^\w.-]', '', name)
    return name

# Función que evita nombres repetidos
def get_unique_filename(folder_path, base_name, extension=".js"):
    # Crear la carpeta si no existe
    os.makedirs(folder_path, exist_ok=True)

    # Construir el nombre base normalizado
    base_name = normalize_filename(base_name)
    output_path = os.path.join(folder_path, base_name + extension)

    # Agregar un sufijo si el archivo ya existe
    counter = 1
    while os.path.exists(output_path):
        output_path = os.path.join(folder_path, f"{base_name}_{counter}{extension}")
        counter += 1

    return output_path

# Función para generar el archivo JavaScript
def generate_js_file(data):
    # Usar la carpeta "data" para guardar los archivos generados
    folder_path = output_folder

    # Elegir la paleta
    palette_name = data.get('paleta', 'Predeterminado')  # Usar "Predeterminado" si no se especifica la paleta
    with open(palette_path, 'r') as file:
        palettes = json.load(file)  # Cargar todas las paletas como diccionario
    palette = palettes.get(palette_name, palettes.get("Predeterminado"))  # Usar "Predeterminado" si no existe la paleta

    # Elegir el tipo de minijuego
    template_path = data['tipo'] + ".js"
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"No se encontró el archivo de plantilla: {template_path}")
    with open(template_path, 'r') as file:
        template = file.read()  # Cargar el template específico como archivo JS

    # Reemplazar con la data y paleta escogidas
    content = template.replace('{DATA}', json.dumps(data)).replace('{PALETA}', json.dumps(palette))

    # Generar un nombre único para el archivo
    file_name = get_unique_filename(folder_path, data['nombre'])

    # Guardar el archivo generado
    with open(file_name, 'w') as file:
        file.write(content)

    print(f"Archivo generado en {file_name}")

