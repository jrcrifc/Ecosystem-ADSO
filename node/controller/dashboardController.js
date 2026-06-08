// ============================================================
// 📊 CONTROLADOR DEL DASHBOARD (dashboardController)
// Reúne y consolida estadísticas generales de uso del laboratorio:
// conteos de reactivos/equipos, alertas de reactivos próximos a vencer
// en 30 días, y estado de las solicitudes. Filtra por privilegios del rol.
// ============================================================

// Importa el modelo de reactivos para contar registros en la base de datos
import reactivoModel from "../models/reactivosModel.js";
// Importa el modelo de equipos para contar registros en la base de datos
import equipoModel from "../models/EquiposModel.js";
// Importa el modelo de solicitudes para obtener estadísticas agrupadas
import solicitudModel from "../models/solicitudModel.js";
// Importa el modelo de movimientos de reactivos para consultar vencimientos
import movimientoreactivoModel from "../models/movimientoreactivosModel.js";
// Importa el operador Op de Sequelize para consultas con rangos de fechas
import { Op } from "sequelize";

// Controlador para retornar las estadísticas del dashboard
export const getDashboardStats = async (req, res) => {
  // Ejecuta el bloque en try-catch para manejar errores
  try {
    // Obtiene el rol del usuario autenticado y lo convierte a minúsculas
    const userRol = req.user.rol.toLowerCase();
    // Determina si el usuario tiene permisos administrativos
    const esAdminGestorPasante = ['administrador', 'admin', 'gestor', 'pasante'].includes(userRol);

    // Lógica para usuarios con rol de Aprendiz o Instructor (sin permisos globales)
    if (!esAdminGestorPasante) {
      // Obtiene las solicitudes del usuario agrupadas por estado con su respectivo conteo
      const solicitudesStats = await solicitudModel.findAll({
        where: { id_usuario: req.user.id },
        attributes: ['estado', [solicitudModel.sequelize.fn('COUNT', solicitudModel.sequelize.col('id_solicitud')), 'count']],
        group: ['estado']
      });

      // Responde con datos limitados a las solicitudes personales del usuario
      return res.json({
        totals: {
          reactivos: 0,
          equipos: 0
        },
        vencimientos: [],
        solicitudes: solicitudesStats,
        equiposDistribucion: [],
        soloPersonal: true
      });
    }

    // Lógica de panel administrativo global

    // Obtiene el conteo total de reactivos registrados
    const totalReactivos = await reactivoModel.count();
    // Obtiene el conteo total de equipos registrados
    const totalEquipos = await equipoModel.count();

    // Calcula la fecha actual y la fecha dentro de 30 días para filtrar vencimientos
    const hoy = new Date();
    const proximaFecha = new Date();
    proximaFecha.setDate(hoy.getDate() + 30);

    // Consulta los movimientos de reactivos que vencen en los próximos 30 días
    const reactivosVencimiento = await movimientoreactivoModel.findAll({
      where: {
        fecha_vencimiento: {
          [Op.between]: [hoy, proximaFecha]
        },
        cantidad_salida: 0
      },
      include: [{ model: reactivoModel, as: 'reactivo', attributes: ['nom_reactivo'] }],
      limit: 5
    });

    // Obtiene el conteo de solicitudes agrupadas por estado
    const solicitudesStats = await solicitudModel.findAll({
      attributes: ['estado', [solicitudModel.sequelize.fn('COUNT', solicitudModel.sequelize.col('id_solicitud')), 'count']],
      group: ['estado']
    });

    // Obtiene el conteo de equipos agrupados por su estado físico
    const equiposStats = await equipoModel.findAll({
      attributes: ['estado', [equipoModel.sequelize.fn('COUNT', equipoModel.sequelize.col('id_equipo')), 'count']],
      group: ['estado']
    });

    // Responde con todas las estadísticas globales del dashboard
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
    // Registra el error en consola para depuración
    console.error("Error en dashboard stats:", error);
    // Responde con estado 500 y un mensaje genérico
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
