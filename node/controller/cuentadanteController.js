// ============================================================
// 👤 CONTROLADOR DE CUENTADANTES (cuentadanteController)
// Maneja las peticiones HTTP CRUD del registro de cuentadantes.
// Permite registrar responsables de los equipos e inactivar sus perfiles.
// ============================================================

// Importa el servicio de cuentadantes para la lógica de negocio
import cuentadanteService from "../service/cuentadanteService.js";

// Controlador para obtener todos los cuentadantes activos en el sistema
export const getAllcuentadante = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todos los cuentadantes
        const registro = await cuentadanteService.getAllcuentadante();
        // Responde con la lista de cuentadantes en formato JSON
        res.json(registro);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener un cuentadante por su ID
export const getcuentadante = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar el cuentadante por su ID
        const registro = await cuentadanteService.getcuentadante(req.params.id);
        // Responde con los datos del cuentadante
        res.json(registro);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para registrar un nuevo cuentadante
export const createcuentadante = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para crear el cuentadante con los datos proporcionados
        await cuentadanteService.createcuentadante(req.body);
        // Responde con estado 201 y mensaje de éxito
        res.status(201).json({ message: "Registro creado correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar los datos de un cuentadante existente
export const updatecuentadante = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para actualizar el cuentadante con los nuevos datos
        await cuentadanteService.updatecuentadante(req.params.id, req.body);
        // Responde con mensaje de éxito
        res.json({ message: "Registro actualizado correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para activar o inactivar un cuentadante (toggle)
export const toggleEstadoCuentadante = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para cambiar el estado activo/inactivo del cuentadante
        const nuevoEstado = await cuentadanteService.toggleEstadoCuentadante(req.params.id);
        // Responde con mensaje dinámico según el nuevo estado
        res.json({ message: `Cuentadante ${nuevoEstado === 'activo' ? 'activado' : 'inactivado'} correctamente`, estado: nuevoEstado });
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};