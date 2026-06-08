// ============================================================
// 🏢 CONTROLADOR DE PROVEEDORES (proveedoresController)
// Maneja las peticiones HTTP asociadas con la gestión de
// proveedores (CRUD completo y cambio de estado).
// ============================================================

// Importa el servicio de proveedores para la lógica de negocio
import proveedoresService from '../service/proveedoresService.js';

// Controlador para cambiar el estado (activo/inactivo) de un proveedor
export const cambiarEstadoProveedor = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para cambiar el estado del proveedor
        await proveedoresService.cambiarEstado(req.params.id, req.body.estado);
        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: 'Estado del proveedor actualizado' });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para obtener todos los proveedores registrados
export const getAllProveedores = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todos los proveedores
        const proveedores = await proveedoresService.getAll();
        // Responde con estado 200 y la lista de proveedores
        res.status(200).json(proveedores);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener un proveedor específico por su ID
export const getProveedores = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar el proveedor por su ID
        const proveedor = await proveedoresService.getById(req.params.id);
        // Responde con estado 200 y los datos del proveedor
        res.status(200).json(proveedor);
    } catch (error) {
        // Si no se encuentra, responde con estado 404 y el mensaje de error
        res.status(404).json({ message: error.message });
    }
};

// Controlador para registrar un nuevo proveedor en el sistema
export const createProveedores = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para crear el proveedor con los datos proporcionados
        const proveedor = await proveedoresService.create(req.body);
        // Responde con estado 201 y los datos del proveedor creado
        res.status(201).json({ message: 'Proveedor Creado', proveedor });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar los datos de un proveedor existente
export const updateProveedores = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para actualizar el proveedor con los nuevos datos
        await proveedoresService.update(req.params.id, req.body);
        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: 'Proveedor Actualizado' });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar un proveedor del sistema
export const deleteProveedores = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para eliminar el proveedor por su ID
        await proveedoresService.delete(req.params.id);
        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: 'Proveedor Eliminado' });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};