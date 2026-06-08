// ============================================================
// 🔗 SERVICIO DE RELACIÓN SOLICITUD-EQUIPO (solicitudxequipoService)
// Este servicio administra la relación muchos-a-muchos entre
// solicitudes de préstamo y los equipos solicitados en cada una.
// Permite asociar equipos a solicitudes y consultar la carga
// de equipos por solicitud.
// ============================================================

// Importa el modelo de relación solicitud-equipo para la tabla pivote
import solicitudxequipoModel from "../models/solicitudxequipoModel.js";
// Importa el modelo de solicitudes para las relaciones
import solicitudModel from "../models/solicitudModel.js";
// Importa el modelo de equipos para incluir datos del equipo
import EquiposModel from "../models/EquiposModel.js";
// Importa el modelo de usuarios para incluir datos del solicitante
import userModel from "../models/userModel.js";

// Define la clase de servicio para la relación solicitud-equipo
class solicitudxequipoService {
    // Obtiene todas las relaciones solicitud-equipo registradas
    async getAll() {
        // Consulta todos los registros incluyendo solicitud con usuario y equipo
        return await solicitudxequipoModel.findAll({
            include: [
                {
                    // Incluye los datos de la solicitud asociada
                    model: solicitudModel,
                    as: 'solicitud',
                    attributes: ['id_solicitud', 'fecha_inicio', 'fecha_fin'],
                    include: [{
                        // Incluye los datos del usuario que creó la solicitud
                        model: userModel,
                        as: 'usuario',
                        attributes: ['nombres_apellidos']
                    }]
                },
                {
                    // Incluye los datos del equipo asociado
                    model: EquiposModel,
                    as: 'equipo',
                    attributes: ['id_equipo', 'nom_equipo', 'marca_equipo', 'no_placa']
                }
            ]
        });
    }

    // Obtiene una relación solicitud-equipo por su ID
    async getById(id) {
        // Busca el registro por su clave primaria incluyendo solicitud y equipo
        const reg = await solicitudxequipoModel.findByPk(id, {
            include: [
                { model: solicitudModel, as: 'solicitud' },
                { model: EquiposModel, as: 'equipo' }
            ]
        });
        // Si no existe, lanza un error
        if (!reg) throw new Error('Relación no encontrada');
        // Retorna la relación encontrada
        return reg;
    }

    // Crea una nueva relación entre una solicitud y un equipo
    async create(data) {
        return await solicitudxequipoModel.create(data);
    }

    // Actualiza los datos de una relación solicitud-equipo existente
    async update(id, data) {
        // Ejecuta la actualización filtrando por ID
        const result = await solicitudxequipoModel.update(data, { where: { id_solicitudxequipo: id } });
        // Si no se actualizó ningún registro, lanza un error
        if (result[0] === 0) throw new Error('Registro no encontrado');
        // Retorna true indicando que la actualización fue exitosa
        return true;
    }

    // Elimina físicamente una relación solicitud-equipo
    async delete(id) {
        // Ejecuta la eliminación filtrando por ID
        const deleted = await solicitudxequipoModel.destroy({ where: { id_solicitudxequipo: id } });
        // Si no se eliminó ningún registro, lanza un error
        if (!deleted) throw new Error('Registro no encontrado');
        // Retorna true indicando que la eliminación fue exitosa
        return true;
    }
}

// Exporta una instancia única del servicio para usar como singleton
export default new solicitudxequipoService();
