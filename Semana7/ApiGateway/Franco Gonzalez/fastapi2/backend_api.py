from fastapi import FastAPI

app = FastAPI(
    title= "Backend API espanol",
    description= "API ubicada en localhost enrutada por API gateway"
)

@app.get("/health")
def health():
    return {
        "status": "OK",
        "service": "Backend API"
    }
@app.get("/productos")
def productos():
    return {
        "productos": [
            {"id": 1, "nombre": "Nintendo Switch", "precio": 900000},
            {"id": 2, "nombre": "Ps5", "precio": 250000}
        ]
    }

@app.get("ordenes")
def ordenes():
    return {
        "ordenes": [
            {"id": 1001, "estado": "paid"},
            {"id": 1002, "estado": "pending"}
        ]
    }

