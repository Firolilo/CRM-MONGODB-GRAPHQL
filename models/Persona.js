const mongoose = require('mongoose');

const PersonaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    nivel: {
        type: Number,
        required: false,
        trim: true
    },
    arcano: {
        type: String,
        required: true,
        trim: true
    },
    registrado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Persona', PersonaSchema);