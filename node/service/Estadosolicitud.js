import estadoSolicitud from "../models/estadoSolicitudModel.js";

// 🔹 Obtener todos
export const getAll = async () => {
    return await estadoSolicitud.findAll();
};

// 🔹 Obtener por ID
export const getById = async (id) => {
    const registro = await estadoSolicitud.findByPk(id);
    if (!registro) {
        throw new Error("Registro no encontrado");
    }
    return registro;
};

// 🔹 Crear
export const create = async (data) => {

    // 🔥 lógica automática de estado
    if (data.cantidad_inicial - (data.cantidad_salida || 0) <= 0) {
        data.estado_inventario = "agotado";
    } else {
        data.estado_inventario = "en stock";
    }

    return await estadoSolicitud.create(data);
};

// 🔹 Actualizar
export const update = async (id, data) => {

    const registro = await getById(id);

    // 🔥 recalcular estado automáticamente
    if (data.cantidad_inicial - (data.cantidad_salida || 0) <= 0) {
        data.estado_inventario = "agotado";
    } else {
        data.estado_inventario = "en stock";
    }

    await registro.update(data);
    return registro;
};

// 🔹 Eliminar
export const remove = async (id) => {
    const registro = await getById(id);
    await registro.destroy();
    return true;
};