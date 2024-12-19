from . import schemas
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from fastapi import APIRouter, HTTPException, Request, status
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import logging
import os
from typing import List

def compare_hashed_passwords(password1, password2):
    return password1 == password2; # bcrypt.checkpw(password1.encode('utf-8'), password2.encode('utf-8'))

def serialize_mongo_document(document):
    if document:
        document["_id"] = str(document["_id"])
    return document

# Variables de Entorno
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_NAME = os.getenv("DATABASE_NAME")
"""
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
EMAIL = os.getenv("EMAIL")
EMAIL_PASS = os.getenv("EMAIL_PASS")
"""
# Conexion MongoDB
client = AsyncIOMotorClient(DATABASE_HOST)
db = client[DATABASE_NAME]

administradores_collection = db.get_collection("administradores")
minijuegos_collection = db.get_collection("minijuegos")
proyectos_collection = db.get_collection("proyectos")
"""
users_collection = db.get_collection('users')
logs_collection = db.get_collection('logs')
infocards_collection = db.get_collection('infoCards')
treecards_collection = db.get_collection('treeCards')
trees_collection = db.get_collection('trees')
beacons_collection = db.get_collection('beacons')
"""

# Inicialización de sistema de Loggin
logger = logging.getLogger("API_GEOGF")
logger.setLevel(logging.INFO)
file_handler = logging.FileHandler("./app/logs/log")
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Inicialización de la aplicación FastAPI
router = APIRouter()

# Ruta para registrar un nuevo administrador
@router.post("/signup")
async def signup_administrador(administrador: schemas.AdministradorSignup, request: Request):

    try: # Verificar si el correo ya está registrado
        existing_admin = await administradores_collection.find_one({"correo": administrador.correo})
        # Si ya existe, retorna ERROR 400
        if existing_admin: 
            raise HTTPException( 
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El correo ya está registrado."
            )
        # Si no existe, inserta el nuevo Admin en la DB
        result = await administradores_collection.insert_one(administrador.dict())
        logger.info(f"/signup, FROM: {request.client.host}, DETAIL: Nuevo administrador registrado {administrador.correo}")
        # Retorna todos los datos sin la contraseña
        created_admin = administrador.dict(exclude={"contrasena"})
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
async def login_administrador(administrador: schemas.AdministradorLogin, request: Request):
    try: # Buscar correo en la base de datos
        found_admin = await administradores_collection.find_one({"correo": administrador.correo})
        # Si no existe, retorna ERROR 404
        if not found_admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Correo no encontrado."
            )
        print("Voy a comparar", found_admin['contrasena'], " con ", administrador.contrasena)
        if (not compare_hashed_passwords(found_admin['contrasena'], administrador.contrasena)):
            # Si el usuario no existe o la contraseña es incorrecta, devolver 404
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contraseña invalida."
            )
        found_admin = {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in found_admin.items()}
        # Si existe, se obtienen los datos.
        logger.info(f"../login, FROM: {request.client.host}, DETAIL: Successful login for {administrador.correo}")
        return {
            "mensaje": "Administrador logeado exitosamente",
            "data": {key: value for key, value in found_admin.items() if key != "contrasena"}
        }
        
    except HTTPException as e:
        logger.error(f"../login, FROM: {request.client.host}, STATUS: {e.status_code}, DETAL: {e.detail}")
        raise

# Crear un nuevo minijuego.
@router.post("/minijuegos", response_model=dict)
async def crear_minijuego(minijuego: schemas.Minijuego, request: Request):
    """
    Ruta para insertar un nuevo minijuego en la base de datos.
    """
    try:
        minijuego_dict = minijuego.dict()
        minijuego_dict["id_administrador"] = ObjectId(minijuego.id_administrador)

        # Insertar el minijuego en la colección
        result = await minijuegos_collection.insert_one(minijuego_dict)
        
        # Loggear la inserción exitosa
        logger.info(f"/minijuegos, FROM: {request.client.host}, DETAIL: Nuevo minijuego creado con ID {result.inserted_id}")

        # Obtener id insertada
        minijuego_ingresado = minijuego.dict()
        minijuego_ingresado["_id"] = str(result.inserted_id)

        return minijuego_ingresado

    except HTTPException as e:
        logger.error(f"/minijuegos, FROM: {request.client.host}, ERROR: {e.detail}")
        raise e

    except Exception as e:
        logger.error(f"/minijuegos, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al crear el minijuego."
        )

# Actualiza un minijuego con la misma ID.
@router.put("/minijuegos/{minijuego_id}", response_model=dict)
async def actualizar_minijuego(minijuego_id: str, minijuego: schemas.Minijuego, request: Request):
    """
    Ruta para actualizar un minijuego existente en la base de datos.
    """
    try:
        # Convierte el objeto de entrada a un diccionario
        minijuego_dict = minijuego.dict()
        minijuego_dict["id_administrador"] = ObjectId(minijuego.id_administrador)
        minijuego_dict["_id"] = ObjectId(minijuego_id)

        print(f"Minijuego a actualizar: {minijuego_dict}")
        # Actualizar el minijuego en la base de datos
        result = await minijuegos_collection.update_one(
            {"_id": ObjectId(minijuego_id)},
            {"$set": minijuego_dict}
        )
        
        # Verificar si el minijuego fue encontrado y actualizado
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Minijuego con ID {minijuego_id} no encontrado."
            )
        
        # Loggear la actualización exitosa
        logger.info(f"/minijuegos/{minijuego_id}, FROM: {request.client.host}, DETAIL: Minijuego actualizado con ID {minijuego_id}")

        # Obtener id insertada
        minijuego_actualizado = minijuego.dict()
        minijuego_actualizado["_id"] = minijuego_id

        return minijuego_actualizado
    
    except Exception as e:
        logger.error(f"/minijuegos/{minijuego_id}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al actualizar el minijuego."
        )

# Buscar la data de un minijuego segun su _id
@router.get("/minijuego/{id_minijuego}")
async def get_minijuego_by_id(id_minijuego: str):
    print("Me llego: ", id_minijuego)
    try:
        # Convertir el ID a ObjectId
        object_id = ObjectId(id_minijuego)
        # Buscar el minijuego en la base de datos
        found_minigame = await minijuegos_collection.find_one({"_id": object_id})

        if not found_minigame:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Minijuego no encontrado"
            )
        
        # Convertir los ObjectId a string antes de devolverlo
        minigame = {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in found_minigame.items()}
        
        return minigame
        """{
            "mensaje": "Minijuego encontrado",
            "data": minigame
        }"""

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener el minijuego"
        )


@router.get("/minijuegos/administrador/{id_administrador}", response_model=List[dict])
async def obtener_minijuegos_por_admin(id_administrador: str, request: Request):
    """
    Ruta para obtener todos los minijuegos creados por un administrador específico.
    
    Parámetros:
    - id_administrador: ID del administrador cuyos minijuegos se desean buscar.
    """
    try:
        # Convertir el ID a ObjectId
        object_id = ObjectId(id_administrador)

        # Realizar la búsqueda en la base de datos
        minijuegos = await minijuegos_collection.find({"id_administrador": object_id}).to_list(length=None)

        if not minijuegos:
            logger.info(f"/minijuegos/administrador/{id_administrador}, FROM: {request.client.host}, DETAIL: No se encontraron minijuegos para este administrador.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron minijuegos para este administrador."
            )

        # Cambiar los atributos '_id' y 'id_administrador' a str
        for minijuego in minijuegos:
            minijuego["_id"] = str(minijuego["_id"])  # Convertir ObjectId a str
            minijuego["id_administrador"] = str(minijuego["id_administrador"])  # Convertir ObjectId a str

        # Loggear el éxito
        logger.info(f"/minijuegos/administrador/{id_administrador}, FROM: {request.client.host}, DETAIL: {len(minijuegos)} minijuego(s) encontrado(s).")

        return minijuegos

    except Exception as e:
        logger.error(f"/minijuegos/administrador/{id_administrador}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al buscar los minijuegos."
        )

# Ruta para eliminar un minijuego por ID
@router.delete("/minijuegos/{id}", status_code=200)
async def delete_minijuego(id: str):
    try:
        result = await minijuegos_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Minijuego no encontrado")
        return {"message": "Minijuego eliminado con éxito"}
    except Exception as e:
        print(f"Error al eliminar minijuego: {e}")
        raise HTTPException(status_code=500, detail="Error al eliminar el minijuego")
    
@router.get("/proyectos/administrador/{id_administrador}", response_model=List[dict])
async def obtener_proyectos_por_admin(id_administrador: str, request: Request):
    """
    Ruta para obtener todos los proyectos creados por un administrador específico.
    
    Parámetros:
    - id_administrador: ID del administrador cuyos proyectos se desean buscar.
    """
    try:
        # Convertir el ID a ObjectId
        object_id = ObjectId(id_administrador)

        # Realizar la búsqueda en la base de datos
        proyectos = await proyectos_collection.find({"id_administrador": object_id}).to_list(length=None)

        if not proyectos:
            logger.info(f"/proyectos/administrador/{id_administrador}, FROM: {request.client.host}, DETAIL: No se encontraron proyectos para este administrador.")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontraron proyectos para este administrador."
            )

        # Cambiar los atributos '_id' y 'id_administrador' a str
        for proyecto in proyectos:
            proyecto["_id"] = str(proyecto["_id"])  # Convertir ObjectId a str
            proyecto["id_administrador"] = str(proyecto["id_administrador"])  # Convertir ObjectId a str

        # Loggear el éxito
        logger.info(f"/proyectos/administrador/{id_administrador}, FROM: {request.client.host}, DETAIL: {len(proyectos)} minijuego(s) encontrado(s).")

        return proyectos

    except Exception as e:
        logger.error(f"/proyectos/administrador/{id_administrador}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al buscar los proyectos."
        )

# Crear un nuevo minijuego.
@router.post("/proyectos", response_model=dict)
async def crear_proyecto(proyecto: schemas.Proyecto, request: Request):
    """
    Ruta para insertar un nuevo proyecto en la base de datos.
    """
    try:
        proyecto_dict = proyecto.dict()
        proyecto_dict["id_administrador"] = ObjectId(proyecto.id_administrador)

        # Insertar el proyecto en la colección
        result = await proyectos_collection.insert_one(proyecto_dict)
        
        # Loggear la inserción exitosa
        logger.info(f"/proyectos, FROM: {request.client.host}, DETAIL: Nuevo proyecto creado con ID {result.inserted_id}")

        # Obtener id insertada
        proyecto_ingresado = proyecto.dict()
        proyecto_ingresado["_id"] = str(result.inserted_id)

        return proyecto_ingresado

    except HTTPException as e:
        logger.error(f"/proyectos, FROM: {request.client.host}, ERROR: {e.detail}")
        raise e

    except Exception as e:
        logger.error(f"/proyectos, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al crear el proyecto."
        )

# Actualiza un proyecto con la misma ID.
@router.put("/proyectos/{proyecto_id}", response_model=dict)
async def actualizar_proyecto(proyecto_id: str, proyecto: schemas.Proyecto, request: Request):
    """
    Ruta para actualizar un proyecto existente en la base de datos.
    """
    try:
        # Convierte el objeto de entrada a un diccionario
        proyecto_dict = proyecto.dict()
        proyecto_dict["id_administrador"] = ObjectId(proyecto.id_administrador)
        proyecto_dict["_id"] = ObjectId(proyecto_id)

        print(f"proyecto a actualizar: {proyecto_dict}")
        # Actualizar el proyecto en la base de datos
        result = await proyectos_collection.update_one(
            {"_id": ObjectId(proyecto_id)},
            {"$set": proyecto_dict}
        )
        
        # Verificar si el proyecto fue encontrado y actualizado
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"proyecto con ID {proyecto_id} no encontrado."
            )
        
        # Loggear la actualización exitosa
        logger.info(f"/proyectos/{proyecto_id}, FROM: {request.client.host}, DETAIL: proyecto actualizado con ID {proyecto_id}")

        # Obtener id insertada
        proyecto_actualizado = proyecto.dict()
        proyecto_actualizado["_id"] = proyecto_id

        return proyecto_actualizado
    
    except Exception as e:
        logger.error(f"/proyectos/{proyecto_id}, FROM: {request.client.host}, ERROR: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error interno del servidor al actualizar el proyecto."
        )

# Buscar la data de un proyecto segun su _id
@router.get("/proyecto/{id_proyecto}")
async def get_proyecto_by_id(id_proyecto: str):
    try:
        # Convertir el ID a ObjectId
        object_id = ObjectId(id_proyecto)
        # Buscar el proyecto en la base de datos
        found_project = await proyectos_collection.find_one({"_id": object_id})

        if not found_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Proyecto no encontrado"
            )
        
        # Convertir los ObjectId a string antes de devolverlo
        project = {key: (str(value) if isinstance(value, ObjectId) else value) for key, value in found_project.items()}
        
        return project

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al obtener el proyecto"
        )