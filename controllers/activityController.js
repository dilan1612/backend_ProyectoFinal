const Activity = require('../models/Activity');
const Department = require('../models/Department');
const mongoose = require('mongoose');

// Crear una nueva actividad
const createActivity = async (req, res) => {
    const { name, budget, description, departmentId } = req.body; // Recibir datos de la solicitud

    // Validación de campos requeridos
    if (!name || !budget || !departmentId) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Validar que el presupuesto sea un número positivo
    if (isNaN(budget) || budget <= 0) {
        return res.status(400).json({ error: 'El presupuesto debe ser un número positivo' });
    }

    try {
        // Verificar que el departmentId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ error: 'ID de departamento no válido' });
        }

        // Buscar el departamento asociado
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }

        // Verificar que el presupuesto del departamento sea suficiente
        if (department.remainingBudget < budget) {
            return res.status(400).json({ error: 'Presupuesto insuficiente en el departamento' });
        }

        // Crear y guardar la nueva actividad
        const activity = new Activity({
            name,
            budget,
            description,
            department: departmentId, // Asocia la actividad al departamento
        });
        await activity.save();

        // Actualizar el presupuesto disponible del departamento
        department.remainingBudget -= budget;
        await department.save();

        res.status(201).json(activity); // Responder con la actividad creada
    } catch (error) {
        console.error('Error al crear la actividad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Obtener actividades por departamento
const getActivitiesByDepartment = async (req, res) => {
    const { departmentId } = req.params; // Capturar el ID del departamento desde los parámetros

    try {
        // Verificar que el departmentId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ error: 'ID de departamento no válido' });
        }

        // Buscar actividades asociadas al departamento
        const activities = await Activity.find({ department: mongoose.Types.ObjectId(departmentId) });

        // Si no hay actividades, devolver un mensaje
        if (activities.length === 0) {
            return res.status(404).json({ message: 'No se encontraron actividades para este departamento' });
        }

        res.status(200).json(activities); // Responder con las actividades encontradas
    } catch (error) {
        console.error('Error al obtener las actividades:', error);
        res.status(500).json({ error: 'Error al obtener las actividades.' });
    }
};

module.exports = { createActivity, getActivitiesByDepartment };
