const express = require('express');
const { createActivity, getActivitiesByDepartment } = require('../controllers/activityController');
const router = express.Router();

// Ruta para crear una actividad
router.post('/', createActivity);

// Ruta para obtener actividades de un departamento específico
router.get('/:departmentId', getActivitiesByDepartment);

module.exports = router;
