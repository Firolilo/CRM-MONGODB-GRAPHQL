const {ApolloServer} = require("apollo-server");
require("dotenv").config({path:'variables.env'});
const conectarDB = require('./config/db');
const typeDefs = require("./db/schemas");
const resolvers = require('./db/resolvers');

const jwt = require("jsonwebtoken");

conectarDB();

const servidor = new ApolloServer(
    {
        typeDefs,
        resolvers,
        context: ({req}) => {
            const token = req.headers['authorization'] || '';
            //verificar que el token del usuario/vendedor es valido
            if(token)
            {
                try{
                    const usuario = jwt.verify(token, process.env.FIRMA_SECRETA);
                    return {
                        usuario
                    }
                } catch (e){
                    console.log(e);
                    console.log("Token no valido");
                }
            }
        }
    }
);


servidor.listen().then(({url}) => {
    console.log(`Base de datos conectada en la URL: ${url}`)
})

