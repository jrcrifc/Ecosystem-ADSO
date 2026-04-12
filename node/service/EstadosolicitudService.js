import estadoSolicitud from "../models/estado_SolicitudModel.js";

const estadoSolicitudService = {

    // 🔹 Obtener todos
    async findAll() {
        return await estadoSolicitud.findAll();
    },

    // 🔹 Obtener por ID
    async findByPk(id) {
        const registro = await estadoSolicitud.findByPk(id);
        if (!registro) {
            throw new Error("Registro no encontrado");
        }
        return registro;
    },

    // 🔹 Crear
    async create(data) {

        if (data.cantidad_inicial - (data.cantidad_salida || 0) <= 0) {
            data.estado_inventario = "agotado";
        } else {
            data.estado_inventario = "en stock";
        }

        return await estadoSolicitud.create(data);
    },

    // 🔹 Actualizar
    async update(id, data) {

        const registro = await estadoSolicitud.findByPk(id);
        if (!registro) {
            throw new Error("Registro no encontrado");
        }

        if (data.cantidad_inicial - (data.cantidad_salida || 0) <= 0) {
            data.estado_inventario = "agotado";
        } else {
            data.estado_inventario = "en stock";
        }

        await registro.update(data);
        return registro;
    },

    // 🔹 Eliminar
    async remove(id) {
        const registro = await estadoSolicitud.findByPk(id);
        if (!registro) {
            throw new Error("Registro no encontrado");
        }

        await registro.destroy();
        return true;
    }
};

export default estadoSolicitudService;