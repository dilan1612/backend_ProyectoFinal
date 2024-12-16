const Department = require('../models/Department'); // Modelo de departamento

// Crear un nuevo departamento
const createDepartment = async (req, res) => {
    const { name, totalBudget } = req.body;

    // Validación de campos requeridos
    if (!name || !totalBudget) {
        return res.status(400).json({ error: 'El nombre y el presupuesto total son obligatorios' });
    }

    try {
        // Crear el nuevo departamento
        const newDepartment = new Department({
            name,
            totalBudget: parseFloat(totalBudget),
            remainingBudget: parseFloat(totalBudget), // Inicialmente, el presupuesto disponible es igual al total
        });

        await newDepartment.save();
        res.status(201).json(newDepartment);
    } catch (error) {
        console.error('Error al crear el departamento:', error);
        res.status(500).json({ error: 'Error al crear el departamento' });
    }
};

// Obtener todos los departamentos
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find(); // Recuperar todos los departamentos
        res.status(200).json(departments); // Responder con la lista de departamentos
    } catch (error) {
        console.error('Error al obtener los departamentos:', error);
        res.status(500).json({ error: 'Error al obtener los departamentos' });
    }
};

// Obtener un departamento por ID
const getDepartmentById = async (req, res) => {
    const { id } = req.params; // Capturar el ID desde los parámetros

    try {
        const department = await Department.findById(id); // Busca el departamento por su ID
        if (!department) {
            return res.status(404).json({ error: 'Departamento no encontrado' }); // Devuelve error si no existe
        }
        res.status(200).json(department); // Devuelve el departamento encontrado
    } catch (error) {
        console.error('Error al obtener el departamento:', error);
        res.status(500).json({ error: 'Error al obtener el departamento' }); // Devuelve error interno si algo falla
    }
};

// Actualizar el presupuesto de un departamento
const updateBudget = async (req, res) => {
    const { departmentId } = req.params; // ID del departamento desde la URL
    const { amount } = req.body; // Monto a ajustar desde el cuerpo de la solicitud

    // Validación básica
    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Se debe proporcionar un monto válido para ajustar el presupuesto' });
    }

    try {
        const department = await Department.findById(departmentId); // Buscar el departamento
        if (!department) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }

        // Actualizar los presupuestos
        department.totalBudget += parseFloat(amount);
        department.remainingBudget += parseFloat(amount);

        // Validación del presupuesto disponible
        if (department.remainingBudget < 0) {
            return res.status(400).json({ error: 'El presupuesto disponible no puede ser negativo' });
        }

        await department.save(); // Guardar los cambios
        res.status(200).json(department); // Responder con los datos actualizados
    } catch (error) {
        console.error('Error al actualizar el presupuesto:', error);
        res.status(500).json({ error: 'Error al actualizar el presupuesto' });
    }
};

// Eliminar un departamento
const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ error: 'Departamento no encontrado' });
        }

        await department.deleteOne(); // Eliminar el departamento
        res.status(200).json({ message: 'Departamento eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el departamento:', error);
        res.status(500).json({ error: 'Error al eliminar el departamento' });
    }
};

// Exportar los métodos
module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById, // Exportar el nuevo método
    updateBudget,
    deleteDepartment,
};

