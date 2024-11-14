const mongoose = require('mongoose');

const empleadoSchema = mongoose.Schema({
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
    ci:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    salario: {
        type: Number,
        required: true
    },
    bono: {
        type: Number,
        required: true
    },
    creado:{
        type: Date,
        default: Date.now()
    }

})
module.exports = mongoose.model("Empleado", empleadoSchema);