// ============================================================
// 📋 CONTROLADOR DE ESTADOS DE SOLICITUD (EstadosolicitudController)
// Expone las acciones CRUD para controlar los estados permitidos
// de las solicitudes de préstamo.
// ============================================================

// Importa el servicio de estados de solicitud para la lógica de negocio
import estadoSolicitudService from "../service/EstadosolicitudService.js";

// Controlador para listar todos los estados de solicitud configurados
export const getAllEstadoSolicitud = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todos los registros
        const registros = await estadoSolicitudService.findAll();
        // Responde con la lista de estados en formato JSON
        res.json(registros);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener un estado de solicitud por su clave primaria
export const getEstadoSolicitud = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar el registro por su ID
        const registro = await estadoSolicitudService.findByPk(req.params.id);
        // Verifica si el registro existe
        if (!registro) {
            // Responde con error 404 si no se encuentra
            return res.status(404).json({ message: "Registro no encontrado" });
        }
        // Responde con los datos del registro encontrado
        res.json(registro);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para registrar un nuevo estado para las solicitudes
export const createEstadoSolicitud = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para crear el registro con los datos proporcionados
        await estadoSolicitudService.create(req.body);
        // Responde con estado 201 y mensaje de éxito
        res.status(201).json({ message: "Registro creado correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para modificar los datos de un estado de solicitud por su ID
export const updateEstadoSolicitud = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Busca el registro por su ID
        const registro = await estadoSolicitudService.findByPk(req.params.id);
        // Verifica si el registro existe
        if (!registro) {
            // Responde con error 404 si no se encuentra
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        // Actualiza el registro con los nuevos datos del cuerpo
        await registro.update(req.body);
        // Responde con mensaje de éxito
        res.json({ message: "Registro actualizado correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar físicamente un estado de solicitud
export const deleteEstadoSolicitud = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Busca el registro por su ID
        const registro = await estadoSolicitudService.findByPk(req.params.id);
        // Verifica si el registro existe
        if (!registro) {
            // Responde con error 404 si no se encuentra
            return res.status(404).json({ message: "Registro no encontrado" });
        }

        // Elimina el registro de la base de datos
        await registro.destroy();
        // Responde con mensaje de éxito
        res.json({ message: "Registro eliminado correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};