const resolvers = {
    Query: {
        obtenerCurso:()=>'Bienvenido Estudiante de Base de Datos III',
    },
    Mutation: {
        nuevoUsuario:async (_,{input}) => {
            console.log(input);
        }
    }
}
module.exports = resolvers;