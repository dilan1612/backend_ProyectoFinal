const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'El correo electrónico es obligatorio'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, 'El correo electrónico no tiene un formato válido']
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
        },
    },
    { timestamps: true }
);

// Middleware para cifrar la contraseña antes de guardar o actualizar
userSchema.pre('save', async function (next) {
    // Si la contraseña no se modifica, pasa al siguiente middleware
    if (!this.isModified('password')) return next();

    try {
        // Generar el salt y cifrar la contraseña
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
