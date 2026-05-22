import reactivoModel from "../models/reactivosModel.js";
import equipoModel from "../models/EquiposModel.js";
import solicitudModel from "../models/solicitudModel.js";
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
import { Op } from "sequelize";

export const getDashboardStats = async (req, res) => {
  try {
    const userRol = req.user.rol.toLowerCase();
    const esAdminGestorPasante = ['administrador', 'admin', 'gestor', 'pasante'].includes(userRol);

    if (!esAdminGestorPasante) {
      // 📊 Si es aprendiz o instructor, solo mostramos sus propias solicitudes
      const solicitudesStats = await solicitudModel.findAll({
        where: { id_usuario: req.user.id },
        attributes: ['estado', [solicitudModel.sequelize.fn('COUNT', solicitudModel.sequelize.col('id_solicitud')), 'count']],
        group: ['estado']
      });

      return res.json({
        totals: {
          reactivos: 0,
          equipos: 0
        },
        vencimientos: [],
        solicitudes: solicitudesStats,
        equiposDistribucion: [],
        soloPersonal: true // Indicador para el frontend
      });
    }

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

    // 3. Conteo de solicitudes por estado (usando el campo 'estado' de la tabla solicitud_prestamos)
    const solicitudesStats = await solicitudModel.findAll({
      attributes: ['estado', [solicitudModel.sequelize.fn('COUNT', solicitudModel.sequelize.col('id_solicitud')), 'count']],
      group: ['estado']
    });

    // 4. Conteo de equipos por estado
    const equiposStats = await equipoModel.findAll({
      attributes: ['estado', [equipoModel.sequelize.fn('COUNT', equipoModel.sequelize.col('id_equipo')), 'count']],
      group: ['estado']
    });

    res.json({
      totals: {
        reactivos: totalReactivos,
        equipos: totalEquipos
      },
      vencimientos: reactivosVencimiento,
      solicitudes: solicitudesStats,
      equiposDistribucion: equiposStats,
      soloPersonal: false
    });
  } catch (error) {
    console.error("Error en dashboard stats:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
