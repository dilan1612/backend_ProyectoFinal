const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del departamento es obligatorio'],
        trim: true, // Elimina espacios en blanco al inicio y al final
        unique: true, // Evita nombres duplicados
    },
    totalBudget: {
        type: Number,
        required: [true, 'El presupuesto total es obligatorio'],
        min: [0, 'El presupuesto total no puede ser negativo'], // Evita valores negativos
    },
    remainingBudget: {
        type: Number,
        required: [true, 'El presupuesto disponible es obligatorio'],
        min: [0, 'El presupuesto disponible no puede ser negativo'], // Valida que no sea negativo
    },
}, {
    timestamps: true // Agrega campos automáticos: createdAt y updatedAt
});

// Middleware para asegurar que `remainingBudget` nunca sea mayor que `totalBudget`
departmentSchema.pre('save', function (next) {
    if (this.remainingBudget > this.totalBudget) {
        return next(new Error('El presupuesto disponible no puede ser mayor que el presupuesto total'));
    }
    next();
});

module.exports = mongoose.model('Department', departmentSchema);
