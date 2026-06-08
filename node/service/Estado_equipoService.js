// ============================================================
// 📊 SERVICIO DE ESTADOS DE EQUIPO (Estado_equipoService)
// Este servicio administra los valores del catálogo de estados
// físicos que puede tener un equipo del laboratorio:
// disponible, no disponible, mantenimiento.
// ============================================================

// Importa el modelo de estado de equipo para acceder a la tabla de catálogo
import EstadoEquipo from "../models/Estado_equipoModel.js";

// Obtiene todos los estados de equipo disponibles
export const getAll = async () => {
  try {
    // Consulta todos los estados ordenados alfabéticamente
    return await EstadoEquipo.findAll({
      order: [['estado', 'ASC']]
    });
  } catch (error) {
    // Lanza un error si falla la consulta
    throw new Error(`Error al obtener estados: ${error.message}`);
  }
};

// Obtiene un estado de equipo por su ID
export const getById = async (id) => {
  try {
    // Busca el registro por su clave primaria
    const registro = await EstadoEquipo.findByPk(id);
    // Si no existe, lanza un error
    if (!registro) {
      throw new Error("Estado de equipo no encontrado");
    }
    // Retorna el registro encontrado
    return registro;
  } catch (error) {
    // Lanza un error si falla la búsqueda
    throw new Error(`Error al buscar estado: ${error.message}`);
  }
};

// Crea un nuevo estado de equipo validando que sea un valor permitido
export const create = async (data) => {
  try {
    // Valida que el estado sea uno de los valores permitidos
    if (!data.estado || !["disponible", "no disponible", "mantenimiento"].includes(data.estado)) {
      throw new Error("Estado inválido. Usa: disponible, no disponible o mantenimiento");
    }
    // Crea el registro en la base de datos
    const nuevo = await EstadoEquipo.create({
      estado: data.estado
    });
    // Retorna el nuevo estado creado
    return nuevo;
  } catch (error) {
    // Lanza un error si falla la creación
    throw new Error(`Error al crear estado: ${error.message}`);
  }
};

// Actualiza un estado de equipo existente
export const update = async (id, data) => {
  try {
    // Obtiene el registro existente por su ID
    const registro = await getById(id);
    // Si se envía un nuevo estado, valida que sea permitido
    if (data.estado) {
      if (!["disponible", "no disponible", "mantenimiento"].includes(data.estado)) {
        throw new Error("Estado inválido");
      }
    }
    // Aplica la actualización en la base de datos
    await registro.update({
      estado: data.estado
    });
    // Retorna el registro actualizado
    return registro;
  } catch (error) {
    // Lanza un error si falla la actualización
    throw new Error(`Error al actualizar: ${error.message}`);
  }
};

// Elimina físicamente un estado de equipo
export const remove = async (id) => {
  try {
    // Obtiene el registro existente por su ID
    const registro = await getById(id);
    // Elimina el registro de la base de datos
    await registro.destroy();
    // Retorna true indicando que la eliminación fue exitosa
    return true;
  } catch (error) {
    // Lanza un error si falla la eliminación
    throw new Error(`Error al eliminar: ${error.message}`);
  }
};
