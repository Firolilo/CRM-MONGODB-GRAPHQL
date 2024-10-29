const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');

const resolvers = {
    Query: {
        obtenerCurso:()=>'Bienvenido Estudiante de Base de Datos III',
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
        }
    }
}
module.exports = resolvers;