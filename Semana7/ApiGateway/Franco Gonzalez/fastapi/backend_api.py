from fastapi import FastAPI

app = FastAPI(
    title= "Backend API ingles",
    description= "API ubicada en localhost enrutada por API gateway"
)

@app.get("/health")
def health():
    return {
        "status": "OK",
        "service": "Backend API"
    }
@app.get("/products")
def products():
    return {
        "products": [
            {"id": 1, "name": "GTA 6", "price": 100000},
            {"id": 2, "name": "ZELDA ocarina of time", "price": 70000}
        ]
    }

@app.get("orders")
def orders():
    return {
        "orders": [
            {"id": 1001, "status": "paid"},
            {"id": 1002, "status": "pending"}
        ]
    }

