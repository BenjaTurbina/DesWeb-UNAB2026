// Cuando se llama sin "{}" se importa el objeto o función completa que exporta el módulo
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")

// Cuando se usan "{}" (destructuración), se extraen solo funciones o propiedades específicas de ese módulo
const {ApolloServer, gql} = require("apollo-server-express");

const Juego = require("./models/juegos");

mongoose.connect("mongodb://localhost:27017/Videojuegos");
// Para concetar con la bd atravez de un modelo este require 3 cosas
const typeDefs = gql`
    type Juego{
        id: ID!
        nombre: String!
        desarollador: String!
        editor: String!
        fecha: String!
        precio: Float!
        claveAct: String!
    }
    input JuegoInput{
        nombre: String!
        desarollador: String
        editor: String
        fecha: String!
        precio: Float!
        claveAct: String!
    }
    input DevInput {
        desarrollador: String!
    }
    type Alert {
        message: String
    }
    type Query{
        getJuegos: [Juego]
        getJuegoById(id: ID!): Juego
        getJuegoByDev(desarollador: String!): [Juego]
    }
    type Mutation{
        addJuego(input: JuegoInput) : Juego
        updJuego(id: ID!, input: JuegoInput): Juego
        delJuego(id: ID!): Alert
    }`
;

const resolvers = {
    // Se escriben las funciones a utilizar en gql
    Query: {
        // Funcion asicrona no espera una respuesta, pero no significa dentro de esta llamada no existan cosas que esperan respuestas
        async getJuegos(obj){
            // Espera para evaluar que encuentre el valor indicado
            const juegos = await Juego.find()
            return juegos;
        },
        async getJuegoById(obj,{id}){
            const juegoBuscado = await Juego.findById(id);
            if (juegoBuscado == null){
                return null;
            } else {
                return juegoBuscado;
            }
        },
        async getJuegoByDev(obj,{dev}){
            const juegoBuscado = await Juego.find({ desarollador: dev });
            return juegoBuscado
        }
    },
    Mutation: {
        async addJuego(obj,{input}){
            const juego = new Juego(input);
            await juego.save();
            return juego;
        },
        async updJuego(obj,{id,input}){
            const juego = await Juego.findByIdAndUpdate(id,input);
            return juego;
        },
        async delJuego(obj,{id}){
            const juegoBorrado = await Juego.findByIdAndDelete(id);
            if (!juegoBorrado){
                return {
                    message:"Error: El juego no existe o ya fue eliminado"
                };
            }
            return {
                message: `Juego ${juegoBorrado.nombre} eliminado`
            };
        },
    }
};

let apolloServer = null;
const corsOption = {
    origin: "https://localhost:8090",
    credentials: false
};

const app = express();
app.use(cors());

async function startServer(){
    apolloServer = new ApolloServer({typeDefs, resolvers,corsOption});
    await apolloServer.start();
    apolloServer.applyMiddleware({app, cors: false});
}

startServer();

app.listen(8090, function(){
    console.log("Graphql Iniciado en http://localhost:8090/graphql");
});