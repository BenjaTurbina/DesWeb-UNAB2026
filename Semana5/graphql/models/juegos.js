const mongoose = require("mongoose")
const juegosSchema = mongoose.Schema({
    nombre: String,
    desarollador: String,
    editor: String,
    fecha: String,
    precio: Number,
    claveAct: String
});

module.exports = mongoose.model("Juego", juegosSchema,"videojuegos");