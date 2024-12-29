from pydantic import BaseModel, Field
from typing import Optional, List, Union, Any, Dict
from datetime import datetime
from fastapi import UploadFile

# Cuentas de Administrador
class AdministradorLogin (BaseModel):
    correo: str
    contrasena: str

class AdministradorSignup(BaseModel):
    nombre: str
    apellido: Optional[str]
    correo: str
    contrasena: str
    organizacion: Optional[str] = None
    imagen: Optional[UploadFile] = None

# Minijuegos creados por Administradores

class Minijuego(BaseModel):
    nombre: Optional[str] = ""
    descripcion: Optional[str] = ""
    tipo: Optional[str] = ""
    mezclarPaginas: Optional[bool] = False
    paleta: Optional[str] = ""
    paginas: Optional[List[Dict[str, Any]]] = []
    ultimaModificacion: str
    id_administrador: str

class Proyecto(BaseModel):
    nombre: Optional[str] = ""
    descripcion: Optional[str] = ""
    minijuegos: Optional[List[Dict[str, Any]]] = []
    ultimaModificacion: str
    id_administrador: str

class Diseños(BaseModel):
    minijuegos: Optional[List] = []
    proyectos: Optional[List] = []