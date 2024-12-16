const express = require('express');
const {
    createDepartment,
    getDepartments,
    getDepartmentById, // Importar la función para obtener un departamento por ID
    updateBudget,
    deleteDepartment,
} = require('../controllers/departmentController');

const router = express.Router();

// Crear un nuevo departamento
router.post('/', createDepartment);

// Obtener todos los departamentos
router.get('/', getDepartments);

// Obtener un departamento por ID
router.get('/:id', getDepartmentById); // Nueva ruta para obtener un departamento específico

// Actualizar el presupuesto de un departamento
router.put('/:id', updateBudget);

// Eliminar un departamento
router.delete('/:id', deleteDepartment);

module.exports = router;
