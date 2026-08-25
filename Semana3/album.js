// CREACION DE API DE EJEMPLO 
const ApiAlbum = {
    "status": 200,
    "message" : "TablaAlbums",
    "data": [
        {
            "id": 1,
            "artista": "Lorde",
            "album": "Solar Power",
            "year": "2021",
            "Genero": "Alternativo"
        },
        {
            "id": 2,
            "artista": "Charli xcx",
            "album": "Pop 2",
            "year": "2017",
            "Genero": "Pop"
        },
        {
            "id": 3,
            "artista": "Tyler, the creator",
            "album": "Igor",
            "year": "2019",
            "Genero": "Hip-hop"
        },
        {
            "id": 4,
            "artista": "Clairo",
            "album": "Diary 001",
            "year": "2017",
            "Genero": "Alternativo"
        },
        {
            "id": 5,
            "artista": "Frank Ocean",
            "album": "Blonde",
            "year": "2016",
            "Genero": "Hip-hop"
        },
        {
            "id": 6,
            "artista": "Kevin Abstract",
            "album": "Arizona baby",
            "year": "2019",
            "Genero": "Hip-hop"
        },
        {
            "id": 7,
            "artista": "Lorde",
            "album": "Melodrama",
            "year": "2017",
            "Genero": "Alternativo"
        },

    ]
};

// FUNCION PARA CARGAR ELEMENTOS EN UN FORMATO DE TABLA 
function cargarProducto(){
    let datos = document.getElementById("TablaAlbums");
    ApiAlbum.data.forEach((info) => {
        let fila = document.createElement("tr");

        let infoID = document.createElement("td");
        infoID.innerText = info.id;

        let infoArtista = document.createElement("td");
        infoArtista.innerText = info.artista;

        let infoAlbum = document.createElement("td");
        infoAlbum.innerText = info.album;

        let infoyear = document.createElement("td");
        infoyear.innerText = info.year;

        let infoGenero = document.createElement("td");
        infoGenero.innerText = info.Genero;
        
        fila.appendChild(infoID);
        fila.appendChild(infoArtista);
        fila.appendChild(infoAlbum);
        fila.appendChild(infoyear);
        fila.appendChild(infoGenero);

        datos.appendChild(fila);
    })
}