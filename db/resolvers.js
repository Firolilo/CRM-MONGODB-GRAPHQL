const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const Persona = require('../models/persona');
const Empleado = require('../models/empleado');
const Cliente = require('../models/cliente');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Crear la funcion que me crea el Token
const crearToken = (usuario, palabrasecreta, expiresIn) => {
    const {id, nombre, apellido, email, creado} = usuario;
    return jwt.sign({id, nombre, apellido, email, creado}, palabrasecreta, {expiresIn});
}

require('dotenv').config({path:'variables.env'});


const resolvers = {
    Query: {
        obtenerUsuario:async (_, {token}) => {
            return jwt.verify(token, process.env.FIRMA_SECRETA);
        },
        obtenerProducto: async () => {
            try {
                const productos = await Producto.find({});
                return productos;
            } catch (error){
                console.log(error);
            }

        },
        obtenerProductoPorID: async (_, { id })=>{
            //Verificar que el producto existe
            const producto = await Producto.findById(id);
            if(!producto){
                throw new Error(`El producto con ese ID: ${id},  no existe.`);
            }
            return producto;
        },
        obtenerPersona: async () =>
        {
            try{
                const personas = await Persona.find({});
                return personas;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerPersonaPorID: async (_, { id }) => {
            const persona = await Persona.findById(id);
            if(!persona){
                throw new Error(`La persona con ese ID: ${id}, no existe.`);
            }
            return persona;
        },
        obtenerEmpleado: async () => {
            try {
                const emps = await Empleado.find({});
                return emps;
            } catch (e) {
                console.log(e);
            }
        },
        obtenerEmpleadoPorID: async () => {
            const emp = await Empleado.findById(id);
            if(!emp)
            {
                throw new Error(`El empleado con ese ID: ${id}, no existe`);
            }
            return emp;
        },
        obtenerCliente: async (_, __, ctx) => {
            try {
                const clientes = await Cliente.find({ vendedor: ctx.usuario.id });
                return clientes;
            } catch (error) {
                console.log(error);
                throw new Error("Hubo un error al obtener los clientes");
            }
        },
        obtenerClientePorID: async (_, { id }, ctx) => {
            try {
                const cliente = await Cliente.findById(id);
                if (!cliente) {
                    throw new Error("El cliente no existe");
                }

                // Verificar que el cliente pertenece al vendedor autenticado
                if (cliente.vendedor.toString() !== ctx.usuario.id) {
                    throw new Error("No tienes las credenciales para ver este cliente");
                }

                return cliente;
            } catch (error) {
                console.log(error);
                throw new Error("Hubo un error al obtener el cliente");
            }
        }
    },
    Mutation: {
        nuevoUsuario:async (_,{input}) => {
            //console.log(input);
            const {email, password} = input;

            //Verificar si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            if (existeUsuario) {
                throw new Error('Usuario already exist');
            }

            //Hashear el password
            const salt = await bcrypt.genSalt(10)
            input.password = await bcrypt.hash(password, salt);

            //Guardarlo en la Base de Datos
            try {
                const usuario = new Usuario(input);
                await usuario.save();
                return usuario;
            } catch (error)
            {
                console.error(error);
            }
        },
        autenticarUsuario: async (_, {input}) => {
            const {email, password} = input;
            const existeUsuario = await Usuario.findOne({email});
            if(!existeUsuario){
                throw new Error(`Usuario with email: ${email} already exist`);
            }
            //Verificar si el password es correcto
            const passwordCorrecto = await bcrypt.compare(password, existeUsuario.password);
            if(!passwordCorrecto){
                throw new Error(`Password incorrecto`);
            }

            //Crear el token
            return {
                token:crearToken(existeUsuario, process.env.FIRMA_SECRETA, '360000000000000000000000000000000'),
            }
        },
        nuevoProducto: async (_, { input })=> {
            try {
                const producto = new Producto(input);

                //Grabar en la Base de Datos
                const  resultado = await producto.save();

                return resultado;

            } catch (error) {
                console.log(error);
            }
        },
        actualizarProducto: async (_, { id, input }) => {
            //Verificar que el producto existe
            let producto = await Producto.findById(id);
            if(!producto){
                throw new Error(`El producto con ese ID: ${id},  no existe.`);
            }
            //Guardarlo en la Base de Datos
            producto = await Producto.findOneAndUpdate({_id: id},input,{new: true});

            return producto;
        },
        eliminarProducto: async (_, { id } ) => {
            //Verificar que el producto existe
            let producto = await Producto.findById(id);
            if(!producto){
                throw new Error(`El producto con ese ID: ${id},  no existe.`);
            }
            //Eliminarlo de la Base de Datos
            await  Producto.findOneAndDelete({_id: id});
            return 'Producto Eliminado!!!'
        },
        nuevaPersona: async (_, { input }) => {
            try{
                const persona = new Persona(input);
                const resultado  = await persona.save();
                return resultado;
            } catch (error)
            {
                console.error(error);
            }
        },
        actualizarPersona: async (_, {id, input}) => {
            let persona = await Persona.findById(id);
            if(!persona){
                throw new Error(`La persona con ese ID: ${id},  no existe.`);
            }
            //Guardarlo en la Base de Datos
            persona = await Persona.findOneAndUpdate({_id: id},input,{new: true});

            return persona;
        },
        eliminarPersona: async (_, { id } ) => {
            //Verificar que el producto existe
            let persona = await Persona.findById(id);
            if(!persona){
                throw new Error(`El producto con ese ID: ${id},  no existe.`);
            }
            //Eliminarlo de la Base de Datos
            await  Persona.findOneAndDelete({_id: id});
            return 'Producto Eliminado!!!'
        },
        nuevoEmpleado: async (_, { input }) => {
            const {email, ci} = input;

            if(input.bono < 0)
            {
                throw new Error(`El bono no puede ser negativo`);
            }
            if(input.salario < 0)
            {
                throw new Error(`El salario no puede ser negativo`);
            }
            if(input.salario <= input.bono)
            {
                throw new Error(`El bono no puede ser mayor o igual que el salario`);
            }
            const existeEmpe = await Empleado.findOne({email});
            if (existeEmpe) {
                throw new Error('El empleado con ese email existe');
            }
            const existeEmpc = await Empleado.findOne({ci});
            if (existeEmpc) {
                throw new Error('El empleado con ese ci existe');
            }

            try{
                const emp = new Empleado(input);

                const resultado  = await emp.save();
                return resultado;
            } catch (error)
            {
                console.error(error);
            }
        },
        actualizarEmpleado: async (_, {id,input}) => {
            let emp = await Empleado.findById(id);
            if(!emp){
                throw new Error(`La empleado con ese ID: ${id},  no existe.`);
            }


            if(input.bono < 0)
            {
                throw new Error(`El bono no puede ser negativo`);
            }
            if(input.salario < 0)
            {
                throw new Error(`El salario no puede ser negativo`);
            }
            if(input.salario <= input.bono)
            {
                throw new Error(`El bono no puede ser mayor o igual que el salario`);
            }
            try {
                emp = await Empleado.findOneAndUpdate({_id: id}, input, {new: true});
                return emp;
            } catch (e)
            {
                console.log(e);
            }

        },
        eliminarEmpleado: async (_, { id } ) => {
            //Verificar que el producto existe
            let emp = await Empleado.findById(id);
            if(!emp){
                throw new Error(`El empleado con ese ID: ${id},  no existe.`);
            }

            //Eliminarlo de la Base de Datos
            await  Empleado.findOneAndDelete({_id: id});
            return 'Empleado Eliminado!!!'
        },
        nuevoCliente: async (_,{input}, ctx) => {
            const {email, apellido, nombre} = input;
            const existeCliente = await Cliente.findOne({email});
            if(existeCliente){
                throw new Error('El cliente ya esiste');
            }
            //Asignar un vendedor a ese cliente (Necesito registrar a que vendedor pertenece este cliente)
            const nuevoCliente = new Cliente(input)
            nuevoCliente.vendedor = ctx.usuario.id;
            try{
                return await nuevoCliente.save();
            } catch (e) {
                console.log(e);
            }
        },
        actualizarCliente: async (_, {id,input}, ctx) => {
            let cliente = await Cliente.findById(id);
            if(!cliente){
                throw new Error(`El cliente con ese ID: ${id},  no existe.`);
            }
            const actCliente = new Cliente(input);
            actCliente.vendedor = ctx.usuario.id;
            //Guardarlo en la Base de Datos
            cliente = await Persona.findOneAndUpdate({_id: id},actCliente,{new: true});

            return cliente;
        },
        eliminarCliente: async (_, { id }, ctx) => {
            // Verificar si el cliente existe
            let cliente = await Cliente.findById(id);
            if (!cliente) {
                throw new Error(`El cliente con ID: ${id}, no existe.`);
            }

            // Verificar que el usuario que intenta eliminar el cliente sea el mismo que lo creó
            if (cliente.vendedor.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para eliminar este cliente');
            }

            // Proceder a eliminar el cliente
            try {
                await Cliente.findByIdAndDelete(id);
                return "Cliente eliminado correctamente";
            } catch (error) {
                console.log(error);
            }
        }
    }
}
module.exports = resolvers;