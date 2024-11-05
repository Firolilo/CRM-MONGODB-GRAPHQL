const {gql} = require('apollo-server');
const {Query} = require("mongoose");

const typeDefs = gql`
# -- Query -- #

type Query {
    # -- Usuario -- #
    obtenerUsuario(token:String): Usuario
    
    # -- Producto -- #
    obtenerProducto: [Producto]
    obtenerProductoPorID (id: ID!): Producto
}

# -- Types -- #

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

type Producto {
    id: ID
    nombre: String
    existencia: Int
    precio: Float
    creado: String
}

# -- Inputs -- #

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

input ProductoInput {
    nombre: String!
    existencia: Int!
    precio: Float!
}

# -- Mutation -- #

type Mutation {
    # -- Usuario --
    nuevoUsuario(input:inputUsuario) : Usuario
    autenticarUsuario(input:inputAutenticar) : Token
    
    # -- Producto --
    nuevoProducto(input: ProductoInput ): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto (id: ID!): String
}
`;
module.exports = typeDefs;