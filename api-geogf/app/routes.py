from . import schemas
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import APIRouter, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import logging
import os
from typing import List
import tempfile

def compare_hashed_passwords(password1, password2):
    return password1 == password2; # bcrypt.checkpw(password1.encode('utf-8'), password2.encode('utf-8'))

def serialize_mongo_document(document):
    if document:
        document["_id"] = str(document["_id"])
    return document

# Enviroment Variables
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# MongoDB Connection
client = AsyncIOMotorClient(DATABASE_HOST)
db = client[DATABASE_NAME]

admins_collection = db.get_collection("administradores")
minigames_collection = db.get_collection("minijuegos")
projects_collection = db.get_collection("proyectos")

# Logging System Initialization
logger = logging.getLogger("API_GEOGF")
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler("./app/logs/log")
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# FastAPI Application Initialization
router = APIRouter()

# Autentication Routes
@router.post("/signup")
async def signup_admin(admin: schemas.AdministradorSignup, request: Request):
    try:
        existing_admin = await admins_collection.find_one({"correo": admin.correo})
        if existing_admin: 
            raise HTTPException( 
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="That Email is already registered."
            )
        result = await admins_collection.insert_one(admin.dict())
        logger.info(f"/signup, FROM: {request.client.host}, DETAIL: Nuevo administrador registrado {admin.correo}")
        created_admin = admin.dict(exclude={"contrasena"})
        created_admin["_id"] = str(result.inserted_id)
        return created_admin
    
    except HTTPException as e:
        logger.error(f"/signup, FROM: {request.client.host}, STATUS: {e.status_code}, DETAIL: {e.detail}")
        raise
    
    except Exception as e:
        logger.error(f"/signup, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor."
        )

@router.post("/login")
async def login_admin(admin: schemas.AdministradorLogin, request: Request):
    try: # Buscar correo en la base de datos
        found_admin = await admins_collection.find_one({"correo": admin.correo})
        # Si no existe, retorna ERROR 404
        if not found_admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Correo no encontrado."
            )
        print("Voy a comparar", found_admin['contrasena'], " con ", admin.contrasena)
        if (not compare_hashed_passwords(found_admin['contrasena'], admin.contrasena)):
            # Si el usuario no existe o la contraseña es incorrecta, devolver 404
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contraseña invalida."
            )
        found_admin = {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in found_admin.items()}
        # Si existe, se obtienen los datos.
        logger.info(f"../login, FROM: {request.client.host}, DETAIL: Successful login for {admin.correo}")
        return {
            "mensaje": "Administrador logeado exitosamente",
            "data": {key: value for key, value in found_admin.items() if key != "contrasena"}
        }
        
    except HTTPException as e:
        logger.error(f"../login, FROM: {request.client.host}, STATUS: {e.status_code}, DETAL: {e.detail}")
        raise

# Minigame Routes
@router.post("/minigames", response_model=dict)
async def create_minigame(minigame: schemas.Minijuego, request: Request):
    try:
        minigame_dict = minigame.dict()
        minigame_dict["id_administrador"] = ObjectId(minigame.id_administrador)

        # Insertar el minigame en la colección
        result = await minigames_collection.insert_one(minigame_dict)
        
        # Loggear la inserción exitosa
        logger.info(f"/minigames, FROM: {request.client.host}, DETAIL: Nuevo minigame creado con ID {result.inserted_id}")

        # Obtener id insertada
        minigame_ingresado = minigame.dict()
        minigame_ingresado["_id"] = str(result.inserted_id)

        return minigame_ingresado

    except HTTPException as e:
        logger.error(f"/minigames, FROM: {request.client.host}, ERROR: {e.detail}")
        raise e

    except Exception as e:
        logger.error(f"/minigames, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al crear el minigame."
        )

@router.put("/minigames/{minigame_id}", response_model=dict)
async def update_minigame(minigame_id: str, minigame: schemas.Minijuego, request: Request):
    try:
        # Convierte el objeto de entrada a un diccionario
        minigame_dict = minigame.dict()
        minigame_dict["id_administrador"] = ObjectId(minigame.id_administrador)
        minigame_dict["_id"] = ObjectId(minigame_id)

        print(f"minigame a actualizar: {minigame_dict}")
        # Actualizar el minigame en la base de datos
        result = await minigames_collection.update_one(
            {"_id": ObjectId(minigame_id)},
            {"$set": minigame_dict}
        )
        
        # Verificar si el minigame fue encontrado y actualizado
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"minigame con ID {minigame_id} no encontrado."
            )
        
        # Loggear la actualización exitosa
        logger.info(f"/minigames/{minigame_id}, FROM: {request.client.host}, DETAIL: minigame actualizado con ID {minigame_id}")

        # Obtener id insertada
        minigame_actualizado = minigame.dict()
        minigame_actualizado["_id"] = minigame_id

        return minigame_actualizado
    
    except Exception as e:
        logger.error(f"/minigames/{minigame_id}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al actualizar el minigame."
        )

# Buscar la data de un minigame segun su _id
@router.get("/minigames/{minigame_id}")
async def read_minigame_by_id(minigame_id: str):
    try:
        object_id = ObjectId(minigame_id)
        found_minigame = await minigames_collection.find_one({"_id": object_id})
        if not found_minigame:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Minigame not found"
            )
        minigame = {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in found_minigame.items()}
        return minigame
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error when searching minigame"
        )

@router.get("/minigames/admin_id/{admin_id}", response_model=List[dict])
async def read_minigames_by_admin_id(admin_id: str, request: Request):
    try:
        object_id = ObjectId(admin_id)
        found_minigames = await minigames_collection.find({"id_administrador": object_id}).to_list(length=None)
        if not found_minigames:
            logger.info(f"/minigames/admin_id/{admin_id}, FROM: {request.client.host}, DETAIL: Minigames not found.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Minigames not found."
            )
        for minigame in found_minigames:
            minigame["_id"] = str(minigame["_id"])
            minigame["id_administrador"] = str(minigame["id_administrador"])
        logger.info(f"/minigames/admin_id/{admin_id}, FROM: {request.client.host}, DETAIL: Found {len(found_minigames)} minigames.")
        return found_minigames
    except Exception as e:
        logger.error(f"/minigames/administrador/{admin_id}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )

# Delete
@router.delete("/minigames/{id}", status_code=200)
async def delete_minigame(id: str):
    try:
        object_id = ObjectId(id)
        result = await minigames_collection.delete_one({"_id": object_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Minigame not found.")
        return {"message": "minigame eliminado con éxito"}
    except Exception as e:
        print(f"Error al eliminar minigame: {e}")
        raise HTTPException(status_code=500, detail="Error al eliminar el minigame")

# PROJECT ROUTES

# Create
@router.post("/projects", response_model=dict)
async def create_project(project: schemas.Proyecto, request: Request):
    try:
        project_dict = project.dict()
        project_dict["id_administrador"] = ObjectId(project.id_administrador)
        result = await projects_collection.insert_one(project_dict)
        logger.info(f"/projects, FROM: {request.client.host}, DETAIL: Project created with ID: {result.inserted_id} .")
        project_ingresado = project.dict()
        project_ingresado["_id"] = str(result.inserted_id)
        return project_ingresado
    except HTTPException as e:
        logger.error(f"/proyectos, FROM: {request.client.host}, ERROR: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"/proyectos, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al crear el proyecto."
        )

# Read
@router.get("/projects/{id}")
async def read_project_by_id(id: str):
    try:
        object_id = ObjectId(id)
        found_project = await projects_collection.find_one({"_id": object_id})
        if not found_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found."
            )
        project = {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in found_project.items()}
        return project
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )

@router.get("/projects/admin_id/{admin_id}", response_model=List[dict])
async def read_projects_by_admin_id(admin_id: str, request: Request):
    try:
        object_id = ObjectId(admin_id)
        found_projects = await projects_collection.find({"id_administrador": object_id}).to_list(length=None)
        if not found_projects:
            logger.info(f"/projects/admin_id/{admin_id}, FROM: {request.client.host}, DETAIL: Projects not found.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Projects not found."
            )
        for project in found_projects:
            project["_id"] = str(project["_id"])  # Convertir ObjectId a str
            project["id_administrador"] = str(project["id_administrador"])  # Convertir ObjectId a str
        logger.info(f"/projects/administrador/{admin_id}, FROM: {request.client.host}, DETAIL: Found {len(found_projects)} projects.")
        return found_projects
    except Exception as e:
        logger.error(f"/projects/administrador/{admin_id}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )

# Update
@router.put("/projects/{project_id}", response_model=dict)
async def update_project(project_id: str, project: schemas.Proyecto, request: Request):
    try:
        # Convierte el objeto de entrada a un diccionario
        project_dict = project.dict()
        project_dict["id_administrador"] = ObjectId(project.id_administrador)
        project_dict["_id"] = ObjectId(project_id)
        result = await projects_collection.update_one(
            {"_id": project_dict["_id"]},
            {"$set": project_dict}
        )
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Project not found."
            )
        logger.info(f"/projects/{project_id}, FROM: {request.client.host}, DETAIL: Project updated with ID: {id}")
        updated_project = project.dict()
        updated_project["_id"] = project_id
        return updated_project
    except Exception as e:
        logger.error(f"/projects/{id}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error."
        )

# Delete
@router.delete("/projects/{id}", status_code=200)
async def delete_project(id: str):
    try:
        object_id = ObjectId(id)
        result = await projects_collection.delete_one({"_id": object_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found.")
        return {"message": "Project deleted."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error.")

import subprocess
import json
import os

# BUILDING ROUTES

@router.post("/build", status_code=200)
async def build_project(project: schemas.Proyecto, request: Request):
    try:
        project_data = project.dict()
        script_path = os.path.join(os.getcwd(), 'data', 'scripts', 'beforeBuilding.py')

        # Crear un archivo temporal para almacenar el JSON
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json", mode="w", encoding="utf-8") as temp_file:
            json.dump(project_data, temp_file)
            temp_file_path = temp_file.name  # Guardar la ruta del archivo

        # Ejecutar el script pasando el archivo en vez del JSON directamente
        print("BUILD: Ejecutando script...")
        result = subprocess.run(
            ['python', script_path, temp_file_path],  # Pasar la ruta del archivo temporal aquí
            text=True, shell=True, capture_output=True
        )
        print("BUILD: Script ejecutado.")
        # Eliminar el archivo temporal después de ejecutarlo
        os.remove(temp_file_path)

        # Verificar si el script tuvo un error
        if result.returncode != 0:
            logging.error(f"Error en beforeBuilding.py | Código: {result.returncode} | STDERR: {result.stderr}")
            raise HTTPException(
                status_code=500, 
                detail={
                    "error": "Error while running script",
                    "code": result.returncode,
                    "stderr": result.stderr.strip()
                }
            )

        return {
            "message": "Project build initiated successfully",
            "output": result.stdout.strip()
        }

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON input")
    
    except FileNotFoundError as e:
        logging.error(f"File not found: {e}")
        raise HTTPException(status_code=500, detail="Script file not found. Ensure beforeBuilding.py exists.")
    
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")