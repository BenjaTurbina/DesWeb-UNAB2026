
// CREACION DE API DE EJEMPLO 
const ApiJuegosFav = {
    "status": 200,
    "message" : "Juegos obtenidos correctamente",
    "data": [
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

    ]
};

// FUNCION PARA CARGAR ELEMENTOS EN UN FORMATO DE TABLA 
function cargarProducto(){
    let datos = document.getElementById("InfoJuego");
    ApiJuegosFav.data.forEach((info) => {
        let fila = document.createElement("tr");

        let infoID = document.createElement("td");
        infoID.innerText = info.id;

        let infoNombre = document.createElement("td");
        infoNombre.innerText = info.nombre;

        let infoDev = document.createElement("td");
        infoDev.innerText = info.desarollador;

        let infoEditor = document.createElement("td");
        infoEditor.innerText = info.editor;

        let infoFecha = document.createElement("td");
        infoFecha.innerText = info.fecha;

        let infoPrecio = document.createElement("td");
        infoPrecio.innerText = info.precio;
        
        fila.appendChild(infoID);
        fila.appendChild(infoNombre);
        fila.appendChild(infoDev);
        fila.appendChild(infoEditor);
        fila.appendChild(infoFecha);
        fila.appendChild(infoPrecio);

        datos.appendChild(fila);
    })
}

