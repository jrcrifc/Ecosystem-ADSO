// ============================================================
// 📋 SERVICIO DE ESTADOS DE SOLICITUD (EstadosolicitudService)
// Este servicio administra los valores del catálogo de estados
// que puede tener una solicitud de préstamo: generado, aceptado,
// prestado, devuelto, cancelado, etc.
// ============================================================

// Importa el modelo de estado de solicitud para acceder a la tabla de catálogo
import estadoSolicitud from "../models/Estado_solicitudModel.js";

// Define el objeto de servicio para estados de solicitud con métodos de catálogo
const estadoSolicitudService = {

    // Obtiene todos los estados de solicitud disponibles en el catálogo
    async findAll() {
        return await estadoSolicitud.findAll();
    },

    // Obtiene un estado de solicitud por su ID
    async findByPk(id) {
        // Busca el registro por su clave primaria
        const registro = await estadoSolicitud.findByPk(id);
        // Si no existe, lanza un error
        if (!registro) {
            throw new Error("Registro no encontrado");
        }
        // Retorna el registro encontrado
        return registro;
    },

    // Crea un nuevo estado de solicitud y calcula el estado de inventario automáticamente
    async create(data) {
        // Calcula el estado de inventario según las cantidades disponibles
        if (data.cantidad_inicial - (data.cantidad_salida || 0) <= 0) {
            data.estado_inventario = "agotado";
        } else {
            data.estado_inventario = "en stock";
        }
        // Crea el registro en la base de datos
        return await estadoSolicitud.create(data);
    },

    // Actualiza un estado de solicitud existente y recalcula el inventario
    async update(id, data) {
        // Busca el registro por su clave primaria
        const registro = await estadoSolicitud.findByPk(id);
        // Si no existe, lanza un error
        if (!registro) {
            throw new Error("Registro no encontrado");
        }
        // Recalcula el estado de inventario según las nuevas cantidades
        if (data.cantidad_inicial - (data.cantidad_salida || 0) <= 0) {
            data.estado_inventario = "agotado";
        } else {
            data.estado_inventario = "en stock";
        }
        // Aplica los cambios en la base de datos
        await registro.update(data);
        // Retorna el registro actualizado
        return registro;
    },

    // Elimina físicamente un estado de solicitud
    async remove(id) {
        // Busca el registro por su clave primaria
        const registro = await estadoSolicitud.findByPk(id);
        // Si no existe, lanza un error
        if (!registro) {
            throw new Error("Registro no encontrado");
        }
        // Elimina el registro de la base de datos
        await registro.destroy();
        // Retorna true indicando que la eliminación fue exitosa
        return true;
    }
};

// Exporta el objeto de servicio para usar en toda la aplicación
export default estadoSolicitudService;
