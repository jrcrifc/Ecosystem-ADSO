// ============================================================
// 📤 CONTROLADOR DE SALIDAS DE REACTIVOS (salidasController)
// Gestiona los endpoints de la API HTTP relacionados con el egreso
// físico de reactivos bajo el control de existencias FEFO.
// ============================================================

// Importa el servicio de salidas para la lógica de negocio
import salidasService from "../service/salidasService.js";

// Controlador para listar todos los registros de salidas creadas
export const getAllsalidas = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todas las salidas
        const salidas = await salidasService.getAll();
        // Responde con estado 200 y la lista de salidas
        res.status(200).json(salidas);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener un registro de salida individual por su ID
export const getsalidas = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar la salida por su ID
        const salidas = await salidasService.getById(req.params.id);
        // Responde con estado 200 y los datos de la salida
        res.status(200).json(salidas);
    } catch (error) {
        // Si no se encuentra, responde con estado 404 y el mensaje de error
        res.status(404).json({ message: error.message });
    }
};

// Controlador para crear un registro de salida de reactivos
export const createsalidas = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para crear la salida restando de lotes por FEFO
        const salidas = await salidasService.create(req.body);
        // Responde con estado 201 y los datos de la salida creada
        res.status(201).json({ message: "salida del reactivo ha sido creada correctamente", salidas });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar una salida existente
export const updatesalidas = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para actualizar la salida recalculando stocks
        await salidasService.update(req.params.id, req.body);
        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: "salida del reactivo ha sido actualizada correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para eliminar o inactivar una salida, retornando el stock al lote original
export const deletesalidas = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para eliminar la salida por su ID
        await salidasService.delete(req.params.id);
        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: "salida del reactivo ha sido eliminada correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};
