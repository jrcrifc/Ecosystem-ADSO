// ============================================================
// 🧪 CONTROLADOR DE MOVIMIENTOS DE REACTIVOS (movimientoreactivosController)
// Maneja los endpoints HTTP correspondientes al control de movimientos
// (entradas, adquisiciones de lotes, salidas automatizadas).
// ============================================================

// Importa el servicio de movimientos de reactivos para la lógica de negocio
import movimientoreactivoService from "../service/movimientoreactivosService.js";

// Controlador para obtener todos los movimientos activos registrados
export const getAllmovimientoreactivo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para obtener todos los movimientos
        const movimientoreactivo = await movimientoreactivoService.getAll();
        // Responde con estado 200 y la lista de movimientos
        res.status(200).json(movimientoreactivo);
    } catch (error) {
        // Si ocurre un error, responde con estado 500 y el mensaje de error
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener un movimiento de inventario por su ID
export const getmovimientoreactivo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para buscar el movimiento por su ID
        const movimientoreactivo = await movimientoreactivoService.getById(req.params.id);
        // Responde con estado 200 y los datos del movimiento
        res.status(200).json(movimientoreactivo);
    } catch (error) {
        // Si no se encuentra, responde con estado 404 y el mensaje de error
        res.status(404).json({ message: error.message });
    }
};

// Controlador para crear un movimiento de entrada o salida de reactivos
export const createmovimientoreactivo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para crear el movimiento con los datos proporcionados
        const resultado = await movimientoreactivoService.create(req.body);

        // Verifica si el resultado es un array (salida dividida en múltiples lotes por FEFO)
        if (Array.isArray(resultado)) {
            // Responde con estado 201 y los detalles de la división en lotes
            res.status(201).json({
                message: `✅ Salida registrada correctamente y dividida automáticamente en ${resultado.length} lotes`,
                movimientos: resultado,
                cantidad_lotes: resultado.length
            });
        } else {
            // Caso normal: entrada de lote o salida directa en lote especificado
            res.status(201).json({
                message: "✅ El movimiento del reactivo ha sido creado correctamente",
                movimientoreactivo: resultado
            });
        }
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para actualizar la información de un movimiento del inventario
export const updatemovimientoreactivo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para actualizar el movimiento con los nuevos datos
        await movimientoreactivoService.update(req.params.id, req.body);
        // Responde con estado 200 y mensaje de éxito
        res.status(200).json({ message: "el movimiento del reactivo ha sido actualizada correctamente" });
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};

// Controlador para inactivar lógicamente un movimiento en el sistema (soft-delete)
export const deletemovimientoreactivo = async (req, res) => {
    // Ejecuta el bloque en try-catch para manejar errores
    try {
        // Llama al servicio para eliminar el movimiento por su ID
        await movimientoreactivoService.delete(req.params.id);
        // Responde con estado 204 sin contenido (eliminación exitosa)
        res.status(204).send();
    } catch (error) {
        // Si ocurre un error, responde con estado 400 y el mensaje de error
        res.status(400).json({ message: error.message });
    }
};
