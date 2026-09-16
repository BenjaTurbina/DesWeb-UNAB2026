from typing import List, Optional, Literal
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from contextlib import asynccontextmanager

MONGODB_URI = "mongodb://localhost:27017"
DB_NAME = "Discos"
COLL_NAME = "Discos"

client: AsyncIOMotorClient | None = None
db = None
coll = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db, coll
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]
    coll = db[COLL_NAME]
    yield 
    client.close()

app = FastAPI(title="Tienda de Discos API", version="1.0.0", lifespan=lifespan)

class Disco(BaseModel):
    titulo: str = Field(min_length=1, description="Título del disco")
    artista: str = Field(min_length=1, description="Nombre del artista o banda")
    genero: str = Field(min_length=1, description="Género musical")
    formato: Literal["CD", "Vinilo"] = Field(description="Formato del disco")
    precio: float = Field(gt=0, description="Precio > 0")
    tags: List[str] = Field(default_factory=list)
    disponible: bool = True

class DiscoIn(BaseModel):
    titulo: str = Field(min_length=1, description="Título del disco")
    artista: str = Field(min_length=1, description="Nombre del artista o banda")
    genero: str = Field(min_length=1, description="Género musical")
    formato: Literal["CD", "Vinilo"] = Field(description="Formato del disco")
    precio: float = Field(gt=0, description="Precio > 0")
    tags: List[str] = Field(default_factory=list)
    disponible: bool = True

class DiscoOut(Disco):
    id: str

def doc_to_disco(doc) -> DiscoOut:
    return DiscoOut(
        id=str(doc["_id"]),
        titulo=doc["titulo"],
        artista=doc["artista"],
        genero=doc["genero"],
        formato=doc["formato"],
        precio=doc["precio"],
        tags=doc.get("tags", []),
        disponible=doc.get("disponible", True)
    )

@app.get("/health", tags=["sistema"])
def health():
    return {"status": "ok"}

@app.get("/discos", response_model=List[DiscoOut], tags=["discos"])
async def listar_discos(
    q: Optional[str] = Query(None, description="Filtro por título que contenga q"),
    artista: Optional[str] = Query(None, description="Filtro por artista"),
    genero: Optional[str] = Query(None, description="Filtro por género"),
    formato: Optional[Literal["CD", "Vinilo"]] = Query(None, description="Filtro por formato"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
):
    query = {}
    if q:
        query["titulo"] = {"$regex": q, "$options": "i"}
    if artista:
        query["artista"] = {"$regex": artista, "$options": "i"}
    if genero:
        query["genero"] = {"$regex": genero, "$options": "i"}
    if formato:
        query["formato"] = formato

    cursor = coll.find(query).skip(skip).limit(limit)
    discos: List[DiscoOut] = []
    async for doc in cursor:
        discos.append(doc_to_disco(doc))
    return discos

@app.post("/discos", response_model=DiscoOut, status_code=201, tags=["discos"])
async def crear_disco(disco: DiscoIn):
    res = await coll.insert_one(disco.model_dump())
    doc = await coll.find_one({"_id": res.inserted_id})
    return doc_to_disco(doc)

@app.get("/discos/{disco_id}", response_model=DiscoOut, status_code=200, tags=["discos"])
async def obtener_disco(disco_id: str):
    if not ObjectId.is_valid(disco_id):
        raise HTTPException(400, "id invalido")
    doc = await coll.find_one({"_id": ObjectId(disco_id)})
    if not doc:
        raise HTTPException(404, "Disco no encontrado")
    return doc_to_disco(doc)

@app.put("/discos/{disco_id}", response_model=DiscoOut, tags=["discos"])
async def actualizar_disco(disco_id: str, disco: DiscoIn):
    if not ObjectId.is_valid(disco_id):
        raise HTTPException(400, "id invalido")
    res = await coll.update_one(
        {"_id": ObjectId(disco_id)},
        {"$set": disco.model_dump()}
    )
    if res.matched_count == 0:
        raise HTTPException(404, "Disco no encontrado")
    doc = await coll.find_one({"_id": ObjectId(disco_id)})
    return doc_to_disco(doc)

@app.delete("/discos/{disco_id}", status_code=204, tags=["discos"])
async def eliminar_disco(disco_id: str):
    if not ObjectId.is_valid(disco_id):
        raise HTTPException(400, "id invalido")
    res = await coll.delete_one({"_id": ObjectId(disco_id)})
    if res.deleted_count == 0:
        raise HTTPException(404, "Disco no encontrado")
    return None