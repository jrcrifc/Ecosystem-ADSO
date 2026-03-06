import EstadoEquipo from "../models/Estado_equipoModel.js";

// 🔹 Obtener todos
export const getAll = async () => {
  try {
    return await EstadoEquipo.findAll({
      order: [['estado', 'ASC']]
    });
  } catch (error) {
    throw new Error(`Error al obtener estados: ${error.message}`);
  }
};

// 🔹 Obtener por ID
export const getById = async (id) => {
  try {
    const registro = await EstadoEquipo.findByPk(id);

    if (!registro) {
      throw new Error("Estado de equipo no encontrado");
    }

    return registro;

  } catch (error) {
    throw new Error(`Error al buscar estado: ${error.message}`);
  }
};

// 🔹 Crear
export const create = async (data) => {
  try {

    if (!data.estado || !["disponible", "no disponible", "mantenimiento"].includes(data.estado)) {
      throw new Error("Estado inválido. Usa: disponible, no disponible o mantenimiento");
    }

    const nuevo = await EstadoEquipo.create({
      estado: data.estado
    });

    return nuevo;

  } catch (error) {
    throw new Error(`Error al crear estado: ${error.message}`);
  }
};

// 🔹 Actualizar
export const update = async (id, data) => {
  try {

    const registro = await getById(id);

    if (data.estado) {
      if (!["disponible", "no disponible", "mantenimiento"].includes(data.estado)) {
        throw new Error("Estado inválido");
      }
    }

    await registro.update({
      estado: data.estado
    });

    return registro;

  } catch (error) {
    throw new Error(`Error al actualizar: ${error.message}`);
  }
};

// 🔹 Eliminar
export const remove = async (id) => {
  try {

    const registro = await getById(id);

    await registro.destroy();

    return true;

  } catch (error) {
    throw new Error(`Error al eliminar: ${error.message}`);
  }
};