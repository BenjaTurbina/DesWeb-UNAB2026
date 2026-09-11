# --- TIPOS DE DATOS ---
# Ayudan a definir qué tipo de información esperamos (ej. listas, diccionarios, o datos opcionales).
# FastAPI y Pydantic las leen para saber cómo validar la información.
from typing import List, Optional, Dict

# --- UTILIDADES ---
# Genera contadores automáticos (1, 2, 3...). A veces se usa para crear IDs 
# numéricos simples, aunque con MongoDB normalmente usarás ObjectId.
from itertools import count

# --- EL FRAMEWORK WEB ---
# FastAPI: Es el motor principal que crea el servidor y las rutas de tu API.
# HTTPException: Sirve para lanzar errores al usuario (ej. Error 404: No encontrado).
# Query: Sirve para validar los datos que el usuario envía a través de la URL.
from fastapi import FastAPI, HTTPException, Query

# --- VALIDACIÓN DE DATOS ---
# BaseModel: Te permite crear "plantillas" o modelos de cómo deben verse tus datos (ej. un modelo de Usuario).
# Field: Añade reglas extra a esos modelos (ej. "el nombre debe tener máximo 50 caracteres").
from pydantic import BaseModel, Field

# --- BASE DE DATOS (MONGODB) ---
# AsyncIOMotorClient: Es el puente "asíncrono" para hablar con MongoDB. 
# Ser asíncrono significa que tu app no se congela mientras espera que la base de datos responda.
from motor.motor_asyncio import AsyncIOMotorClient

# ObjectId: Entiende y maneja el formato de los IDs únicos que MongoDB genera automáticamente (los famosos campos "_id").
from bson import ObjectId

# --- CICLO DE VIDA DE LA APP ---
# Permite ejecutar tareas justo cuando el servidor se enciende y cuando se apaga.
# Aquí lo usarás para abrir la conexión a MongoDB al arrancar y cerrarla al terminar.
from contextlib import asynccontextmanager


# Configuracion BD mongodb
# La dirección o "puerta de enlace" donde vive tu base de datos de MongoDB.
MONGODB_URI = "mongodb://localhost:27017"
DB_NAME = "Videojuegos"
COLL_NAME = "videojuegos"

client: AsyncIOMotorClient | None = None
db = None
coll = None

# Levantaminento de un servicio API
@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db, coll
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    coll = db[COLL_NAME]
    yield 
    client.close()
                                    # Las versiones son importantes en el README del github
app = FastAPI(title="FastAPI Juegos", version="1.0.0", lifespan=lifespan)

class Juego(BaseModel):
    nombre: str = Field(min_length=1, description="Nombre del juego")
    desarollador: str = Field(min_length=1, description="Desarrollador")
    editor: str = Field(min_length=1, description="Editor")
    fecha: str = Field(min_length=1, description="Fecha de lanzamiento")
    precio: float = Field(ge=0, description="Precio en CLP")
    claveAct: str = Field(min_length=1, description="Clave de activación")

class JuegoUpdate(BaseModel):
    nombre: Optional[str] = None
    desarollador: Optional[str] = None
    editor: Optional[str] = None
    fecha: Optional[str] = None
    precio: Optional[float] = None
    claveAct: Optional[str] = None

# Las entradas pueder ser las mismas tanto para el Item y el JuegoIn, pueden haber diferencias en la entrada de datos como una fecha, que en la otra se procesa de x forma
class JuegoIn(BaseModel):
    nombre: str = Field(min_length=1, description="Nombre del juego")
    desarollador: str = Field(min_length=1, description="Desarrollador")
    editor: str = Field(min_length=1, description="Editor")
    fecha: str = Field(min_length=1, description="Fecha de lanzamiento")
    precio: float = Field(ge=0, description="Precio en CLP")
    claveAct: str = Field(min_length=1, description="Clave de activación")

class JuegoOut(Juego):
    id: str


def doc_to_JuegoOut(doc) -> JuegoOut:
    return JuegoOut(
        id = str(doc["_id"]),
        nombre = doc["nombre"],
        desarollador = doc.get("desarollador", ""),
        editor = doc.get("editor", ""),
        fecha = doc.get("fecha", ""),
        precio = doc.get("precio", 0),
        claveAct = doc.get("claveAct", "")
    )
# EndPoints

@app.get("/health",tags=["sistema"])
def health():
    return {"status": "ok"}
                                                    # Status code 200 es que obtuve algo correctamente 
@app.get("/videojuegos", response_model= List[JuegoOut], status_code= 200)
async def listar_items(
    q: Optional[str] = Query(None, description="Filtro por nombre que contenga q"),
    # Parte desde, pagina 0 ej
    skip: int = Query(0, ge=0),
    # Limit es cuantos datos parten, hasta cuantos se muestran
    limit: int = Query(50, ge=1, le=200),
):
    query={}
    if q:
        query["nombre"] = {"$regex": q, "$options":"i"}
    cursor = coll.find(query).skip(skip).limit(limit)
    items: List[JuegoOut] = []
    async for doc in cursor:
        items.append(doc_to_JuegoOut(doc))
    return items
                                        # Status code 201 es para indicar que algo se agrego correctamente
@app.post("/videojuegos",response_model=JuegoOut, status_code=201, tags=["items"])
async def crear_item(item: JuegoIn):
    res = await coll.insert_one(item.model_dump())
    doc = await coll.find_one({"_id": res.inserted_id})
    return doc_to_JuegoOut(doc)

# Ejemplo es como localhost:8090/items/2, es como decir pasame x objeto, se tiene que verificar que es ese "2"
@app.get("/videojuegos/{item_id}", response_model=JuegoOut, status_code= 200)
async def obtener_item(item_id: str):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(400,"ID invalido")
    doc = await coll.find_one({"_id": ObjectId(item_id)})
    if not doc:
        raise HTTPException(404, "Item no encontrado")
    return doc_to_JuegoOut(doc)

@app.put("/videojuegos/{item_id}", response_model= JuegoOut)
async def actualizar_item(item_id: str, item: JuegoIn):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(400,"ID invalido")
    res = await coll. update_one(
        {"_id": ObjectId(item_id)},
        {"$set": item.model_dump()}
    )
    if res.matched_count == 0:
        raise HTTPException(404,"Item no encontrado")
    doc = await coll.find_one({"_id": ObjectId(item_id)})
    return doc_to_JuegoOut(doc)

@app.delete("/videojuegos/{item_id}", status_code=204, tags=["items"])
async def eliminar_item(item_id: str):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(400,"ID invalido")
    res = await coll.delete_one({"_id": ObjectId(item_id)})
    if res.deleted_count == 0:
        raise HTTPException(404, "Item no encontrado")
    return None

@app.get("/videojuegos/desarollador/{dev_name}", response_model= List[JuegoOut], tags=["juegos"])
async def buscar_por_desarrollador(dev_name:str):
    query = {"desarollador": {"$regex": dev_name, "$options": "i"}}
    cursor = coll.find(query)
    juegos: List[JuegoOut] = []
    async for doc in cursor:
        juegos.append(doc_to_JuegoOut(doc))
    if not juegos:
        raise HTTPException(404, "No se encontraron juegos del desarrollador")
    return juegos

# El metodo patch solo modifica los datos que se le indiquien y que coincidan con la BD
@app.patch("/videojuegos/{item_id}", response_model=JuegoOut, tags=["juegos"])
async def modificar_item_parcialmente(item_id: str, item: JuegoUpdate):
    if not ObjectId.is_valid(item_id):
        raise HTTPException(400, "ID invalido")
    
    # TRUCO MÁGICO: exclude_unset=True hace que Pydantic ignore los campos 
    # que el usuario no envió. Si solo mandó el 'precio', este diccionario 
    # SOLO tendrá la llave 'precio', evitando sobreescribir el resto con 'None'.
    datos_a_actualizar = item.model_dump(exclude_unset=True)
    
    if not datos_a_actualizar:
        raise HTTPException(400, "No se enviaron datos para actualizar")
    
    # $set esolo actualiza las variables que se le pase
    res = await coll.update_one(
        {"_id": ObjectId(item_id)},
        {"$set": datos_a_actualizar}
    )
    
    if res.matched_count == 0:
        raise HTTPException(404, "Item no encontrado")
        
    doc = await coll.find_one({"_id": ObjectId(item_id)})
    return doc_to_JuegoOut(doc)

# Con uvicorn main:app se levanta el servicio de api