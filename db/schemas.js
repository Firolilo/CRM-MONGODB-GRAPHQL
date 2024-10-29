const {gql} = require('apollo-server');
const {Query} = require("mongoose");

const typeDefs = gql`
type Query {
    obtenerCurso:String
}

type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
}

input inputUsuario{
    nombre: String
    apellido: String
    email: String
    password: String
}

type Mutation {
    nuevoUsuario(input:inputUsuario) : Usuario
}
`;
module.exports = typeDefs;