const {ApolloServer} = require("apollo-server");

const conectarDB = require('./config/db');
const typeDefs = require("./db/schemas");
const resolvers = require('./db/resolvers');

conectarDB();

const servidor = new ApolloServer(
    {
        typeDefs,
        resolvers,
    }
);


servidor.listen().then(({url}) => {
    console.log(`Base de datos conectada en la URL: ${url}`)
})

