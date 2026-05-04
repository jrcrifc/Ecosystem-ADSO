import reactivoModel from "../models/reactivosModel.js";
import equipoModel from "../models/EquiposModel.js";
import solicitudModel from "../models/solicitudModel.js";
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
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
        },
        cantidad_salida: 0 // Solo entradas que aún están en stock (aproximadamente)
      },
      include: [{ model: reactivoModel, as: 'reactivo', attributes: ['nom_reactivo'] }],
      limit: 5
    });

    // 3. Conteo de solicitudes por estado
    // Asumiendo que solicitudModel tiene un campo 'estado' o similar. 
    // Si no, lo sacamos de estadoxsolicitud (pero simplifiquemos por ahora si existe el campo)
    // Revisando App.jsx, parece que la gestión es compleja. 
    // Vamos a contar directamente de la tabla solicitud si tiene el estado.
    const solicitudesStats = await solicitudModel.findAll({
      attributes: ['estado_solicitud', [solicitudModel.sequelize.fn('COUNT', solicitudModel.sequelize.col('id_solicitud')), 'count']],
      group: ['estado_solicitud']
    });

    // 4. Conteo de equipos por estado
    const equiposStats = await equipoModel.findAll({
      attributes: ['estado_equipo', [equipoModel.sequelize.fn('COUNT', equipoModel.sequelize.col('id_equipo')), 'count']],
      group: ['estado_equipo']
    });

    res.json({
      totals: {
        reactivos: totalReactivos,
        equipos: totalEquipos
      },
      vencimientos: reactivosVencimiento,
      solicitudes: solicitudesStats,
      equiposDistribucion: equiposStats
    });
  } catch (error) {
    console.error("Error en dashboard stats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
