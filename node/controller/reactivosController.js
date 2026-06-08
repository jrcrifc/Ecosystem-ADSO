// ============================================================
// 🧪 CONTROLADOR DE REACTIVOS (reactivosController)
// Maneja las peticiones HTTP relacionadas con la gestión
// de reactivos de laboratorio (CRUD completo + auditoría).
// ============================================================

// Importa el servicio de reactivos para la lógica de negocio
import reactivosService from "../service/reactivosService.js";
// Importa la función registrarLog para auditoría de acciones
import { registrarLog } from "../service/logService.js";

// Controlador para obtener todos los reactivos registrados en la base de datos
export const getAllreactivos = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todos los reactivos
        const reactivos = await reactivosService.getAll();
        // Responde con estado 200 y la lista de reactivos
        res.status(200).json(reactivos);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener un reactivo específico por su ID
export const getreactivos = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar el reactivo por su ID
        const reactivos = await reactivosService.getById(req.params.id);
        // Responde con estado 200 y los datos del reactivo
        res.status(200).json(reactivos);
    } catch (error) {
        // Si no se encuentra, responde con estado 404 y el mensaje de error
        res.status(404).json({ message: error.message });
    }
};

// Controlador para crear un nuevo reactivo en el inventario
export const createreactivos = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Imprime el cuerpo recibido para depuración
        console.log("📥 Body recibido:", JSON.stringify(req.body, null, 2));
        // Llama al servicio para crear el reactivo con los datos proporcionados
        const reactivos = await reactivosService.create(req.body);
        
        // Registra la acción de creación en el log de auditoría
        await registrarLog(req.user?.email || 'SISTEMA', 'CREAR', 'REACTIVOS', `Creado reactivo: ${req.body.nom_reactivo}`);
        
        // Responde con estado 201 y los datos del reactivo creado
        res.status(201).json({ message: "reactivo creado correctamente", reactivos });
    } catch (error) {
        // Imprime el error completo para depuración
        console.error("❌ Error completo:", JSON.stringify(error, null, 2));
        console.error("❌ Mensaje:", error.message);
        // Responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar la información de un reactivo existente
export const updatereactivos = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para actualizar el reactivo con los nuevos datos
        await reactivosService.update(req.params.id, req.body);

        // Registra la acción de edición en el log de auditoría
        await registrarLog(req.user?.email || 'SISTEMA', 'EDITAR', 'REACTIVOS', `Editado reactivo ID: ${req.params.id}`);

        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: "reactivo actualizado correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar o desactivar lógicamente un reactivo del sistema
export const deletereactivos = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para eliminar el reactivo por su ID
        await reactivosService.delete(req.params.id);

        // Registra la acción de eliminación en el log de auditoría
        await registrarLog(req.user?.email || 'SISTEMA', 'ELIMINAR', 'REACTIVOS', `Eliminado reactivo ID: ${req.params.id}`);

        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: "reactivo eliminado correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};
