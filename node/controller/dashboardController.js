import reactivoModel from "../models/reactivosModel.js";
import equipoModel from "../models/EquiposModel.js";
import solicitudModel from "../models/solicitudModel.js";
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import estadoxsolicitudModel from "../models/estadoxsolicitudModel.js";
import estadoSolicitudModel from "../models/Estado_solicitudModel.js";
import { Op } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    // 1. Conteo total de reactivos y equipos
    const totalReactivos = await reactivoModel.count();
    const totalEquipos = await equipoModel.count();

    // 2. Reactivos próximos a vencer (próximos 30 días)
    const hoy = new Date();
    const proximaFecha = new Date();
    proximaFecha.setDate(hoy.getDate() + 30);

    const reactivosVencimiento = await movimientoreactivoModel.findAll({
      where: {
        fecha_vencimiento: {
          [Op.between]: [hoy, proximaFecha]
        }
      },
      include: [{ model: reactivoModel, as: 'reactivo', attributes: ['nom_reactivo'] }],
      limit: 5
    });

    // 3. Conteo de solicitudes por estado (simplificado para evitar errores de campos inexistentes)
    // Buscamos los estados actuales más recientes de cada solicitud
    const solicitudesStats = await estadoxsolicitudModel.findAll({
        attributes: [
            [estadoxsolicitudModel.sequelize.col('estadoSolicitud.estado'), 'estado_nombre'],
            [estadoxsolicitudModel.sequelize.fn('COUNT', estadoxsolicitudModel.sequelize.col('estadoxsolicitud.Id_solicitud')), 'count']
        ],
        include: [{
            model: estadoSolicitudModel,
            as: 'estadoSolicitud',
            attributes: []
        }],
        group: ['estadoSolicitud.estado'],
        raw: true
    });

    // 4. Conteo de equipos totales por su campo 'estado' (activo/inactivo)
    const equiposStats = await equipoModel.findAll({
      attributes: [
          ['estado', 'estado_valor'],
          [equipoModel.sequelize.fn('COUNT', equipoModel.sequelize.col('id_equipo')), 'count']
      ],
      group: ['estado'],
      raw: true
    });

    res.json({
      totals: {
        reactivos: totalReactivos,
        equipos: totalEquipos
      },
      vencimientos: reactivosVencimiento,
      solicitudes: solicitudesStats.map(s => ({
          estado_solicitud: s.estado_nombre,
          count: s.count
      })),
      equiposDistribucion: equiposStats.map(e => ({
          estado_equipo: e.estado_valor === 1 ? 'Activo' : 'Inactivo',
          count: e.count
      }))
    });
  } catch (error) {
    console.error("Error en dashboard stats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas", details: error.message });
  }
};
