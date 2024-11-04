const {gql} = require('apollo-server');
const {Query} = require("mongoose");

const typeDefs = gql`
type Query {
    obtenerUsuario(token:String): Usuario
}

type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
}

type Token {
    token: String
}

input inputUsuario{
    nombre: String
    apellido: String
    email: String
    password: String
}

input inputAutenticar{
    email: String
    password: String
}

type Mutation {
    nuevoUsuario(input:inputUsuario) : Usuario
    autenticarUsuario(input:inputAutenticar) : Token
}
`;
module.exports = typeDefs;