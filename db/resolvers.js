const Usuario = require('../models/usuario');
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
        }
    }
}
module.exports = resolvers;