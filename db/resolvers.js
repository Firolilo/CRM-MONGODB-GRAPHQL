const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
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
                token:crearToken(existeUsuario, process.env.FIRMA_SECRETA, '360000'),
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
        }
    }
}
module.exports = resolvers;