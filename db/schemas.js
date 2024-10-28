const {gql} = require('apollo-server');
const {Query} = require("mongoose");

const typeDefs = gql`
type Query {
    obtenerCurso:String
}
`;
module.exports = typeDefs;