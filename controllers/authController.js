const User = require('../models/User'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para generar tokens
require('dotenv').config(); // Para acceder a variables de entorno

// Registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Validar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear un nuevo usuario
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado con éxito.', userId: newUser._id });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

// Iniciar sesión
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log('Datos recibidos:', email, password); // Depuración

    try {
        const user = await User.findOne({ email });
        console.log('Usuario encontrado:', user); // Verificar si el usuario existe

        if (!user) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Contraseña correcta:', isMatch); // Verificar coincidencia de contraseña
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
    }
};

module.exports = { registerUser, loginUser };
