const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const budgetRoutes = require('./routes/budgetRoutes');
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const activityRoutes = require('./routes/activityRoutes');

// Cargar variables de entorno
dotenv.config();

const app = express(); // Inicializar aplicación Express

// Middlewares globales
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON en las solicitudes

// Conexión a la base de datos
mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Base de datos conectada correctamente'))
    .catch((error) => console.error('Error al conectar la base de datos:', error));

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/budgets', budgetRoutes); // Rutas relacionadas con presupuestos
app.use('/departments', departmentRoutes); // Rutas de departamentos
app.use('/activities', activityRoutes); // Rutas de actividades

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
