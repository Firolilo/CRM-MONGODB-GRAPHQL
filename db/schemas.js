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
    
    # -- Persona -- #
    obtenerPersona: [Persona]
    obtenerPersonaPorID (id: ID!): Persona
    
    # -- Empleado -- #
    obtenerEmpleado: [Empleado]
    obtenerEmpleadoPorID(id: ID!): Empleado
    
    # -- Cliente -- #
    obtenerCliente: [Cliente]
    obtenerClientePorID(id: ID!): Cliente
    
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

type Persona {
    id: ID
    nombre: String
    nivel: Int
    arcano: String
    registrado: String
}

type Empleado {
    id: ID
    nombre: String
    apellido: String
    ci: String
    email: String
    salario: Float
    bono: Float
    creado: String
}

type Cliente {
    id: ID
    nombre: String!
    apellido: String!
    email: String!
    empresa: String
    telefono: String
    vendedor: ID
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

input PersonaInput {
    nombre: String!
    nivel: Int!
    arcano: String!
}

input EmpleadoInput {
    nombre: String!
    apellido: String!
    ci: String!
    email: String!
    salario: Float!
    bono: Float!
}

input inputAutenticarPersona{
    nombre: String
    arcano: String
}

input inputCliente{
    nombre: String!
    apellido: String!
    email: String!
    empresa: String
    telefono: String
}


# -- Mutation -- #

type Mutation {
    # -- Usuario -- #
    nuevoUsuario(input:inputUsuario) : Usuario
    autenticarUsuario(input:inputAutenticar) : Token
    
    # -- Producto -- #
    nuevoProducto(input: ProductoInput ): Producto
    actualizarProducto(id: ID!, input: ProductoInput): Producto
    eliminarProducto (id: ID!): String
    
    # -- Persona -- #
    nuevaPersona(input: PersonaInput): Persona
    actualizarPersona(id: ID!, input: PersonaInput): Persona
    eliminarPersona (id: ID!): String
    autenticarPersona(input:inputAutenticar) : Token
    
    # -- Empleado -- #
    nuevoEmpleado(input: EmpleadoInput): Empleado
    actualizarEmpleado(id: ID!, input: EmpleadoInput): Empleado
    eliminarEmpleado(id: ID!): String
    
    # -- Clientes -- #
    nuevoCliente(input:inputCliente): Cliente
    actualizarCliente(id: ID!, input: inputCliente): Cliente
    eliminarCliente(id: ID!): String
}
`;
module.exports = typeDefs;