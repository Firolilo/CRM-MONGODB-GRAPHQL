const mongoose = require('mongoose');

const usuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellido:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    creado:{
        type: Date,
        default: Date.now()
    }

})
module.exports = usuarioSchema;