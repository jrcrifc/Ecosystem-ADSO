// ============================================================
// 🔗 CONTROLADOR DE SOLICITUD × EQUIPO (solicitudxequipoController)
// Maneja las peticiones HTTP relacionadas con la relación
// entre solicitudes de préstamo y equipos asociados (CRUD).
// ============================================================

// Importa el servicio de relaciones solicitud-equipo para la lógica de negocio
import solicitudxequipoService from "../service/solicitudxequipoService.js";

// Controlador para obtener todas las relaciones solicitud-equipo registradas
export const getAllsolicitudxequipo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todas las relaciones
        const solicitudxequipo = await solicitudxequipoService.getAll();
        // Responde con estado 200 y la lista de relaciones
        res.status(200).json(solicitudxequipo);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener una relación solicitud-equipo por su ID
export const getsolicitudxequipo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar la relación por su ID
        const solicitudxequipo = await solicitudxequipoService.getById(req.params.id);
        // Responde con estado 200 y los datos de la relación
        res.status(200).json(solicitudxequipo);
    } catch (error) {
        // Si no se encuentra, responde con estado 404 y el mensaje de error
        res.status(404).json({ message: error.message });
    }
};

// Controlador para crear una nueva relación entre una solicitud y un equipo
export const createsolicitudxequipo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para crear la relación con los datos proporcionados
        const solicitudxequipo = await solicitudxequipoService.create(req.body);
        // Responde con estado 201 y los datos de la relación creada
        res.status(201).json({ message: "La solicitud x equipo creada correctamente", solicitudxequipo });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar una relación solicitud-equipo existente
export const updatesolicitudxequipo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para actualizar la relación con los nuevos datos
        await solicitudxequipoService.update(req.params.id, req.body);
        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: "La solicitud x equipo actualizada correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar una relación solicitud-equipo del sistema
export const deletesolicitudxequipo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para eliminar la relación por su ID
        await solicitudxequipoService.delete(req.params.id);
        // Responde con estado 204 sin contenido (eliminación exitosa)
        res.status(204).send();
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};
