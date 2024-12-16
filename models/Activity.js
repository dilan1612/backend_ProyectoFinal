const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nombre de la actividad
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true }, // Referencia al departamento
    budget: { type: Number, required: true }, // Presupuesto asignado
    description: { type: String }, // Descripción opcional
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
