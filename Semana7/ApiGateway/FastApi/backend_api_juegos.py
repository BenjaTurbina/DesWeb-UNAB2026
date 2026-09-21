from fastapi import FastAPI

app = FastAPI(
    title= "Backend API juegos",
    description= "API ubicada en localhost enrutada por API Gateway"
)

@app.get("/health")
def health():
    return {
        "status": "OK",
        "services": "Backend API",
    }

@app.get("/productos")
def productos():
    return {
        "products": [
            {
                "id": 1,
                "nombre": "Cairn",
                "desarollador": "The Game Bakers",
                "editor": "The Game Bakers",
                "fecha": "29-01-2026",
                "precio": 15500
            },
            {
                "id": 2,
                "nombre": "Kindom Come Deliverance 2",
                "desarollador": "Warhorse Studios",
                "editor":"Deep Silver",
                "fecha": "04-02-2025",
                "precio": 17995,
            },
            {
                "id": 3,
                "nombre": "Disco Elysium",
                "desarollador": "ZA/UM",
                "editor": "ZA/UM",
                "fecha": "15-09-2019",
                "precio": 21000
            },
            {
                "id": "4",
                "nombre": "World of Warcraft",
                "desarollador": "Blizzard Entertainment",
                "editor": "Blizzard Entertainment",
                "fecha": "04-11-2004",
                "precio": 11500
            },
            {
                "id": 5,
                "nombre": "Crusaders King III",
                "desarollador": "Paradox Development Studio",
                "editor": "Paradox Interactive",
                "fecha": "01-09-2020",
                "precio": 10560
            },
            {
                "id": 6,
                "nombre": "NBA 2K26",
                "desarollador": "Visual Concepts",
                "editor": "2K",
                "fecha": "05-09-2026",
                "precio": 69990
            },
            {
                "id": 7,
                "nombre": "The Alters",
                "desarollador": "11 bit studios",
                "editor": "11 bit studios",
                "fecha": "13-06-2025",
                "precio": 18000
            },
            {
                "id": 8,
                "nombre": "Wow Forever",
                "desarollador": "Blizzard",
                "editor": "Blizzard",
                "fecha": "04-11-2026",
                "precio": 22100
            },
        ]    
    }

@app.get("/pedidos")
def pedidos():
    return {
        "pedidos": [
            {"id": 1001, "status": "paid"},
            {"id": 1002, "stauts": "pending"}
        ]
    }