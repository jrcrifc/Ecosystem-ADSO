import EstadoXSolicitud from '../models/EstadoXSolicitud.js';
import Solicitud from '../models/Solicitud.js';
import EstadoSolicitud from '../models/EstadoSolicitud.js';

export const getAll = async (req, res) => {
  try {
    const items = await EstadoXSolicitud.findAll({
      include: [Solicitud, EstadoSolicitud],
      order: [['id_estadoxsolicitud', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHistorialBySolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const historial = await EstadoXSolicitud.findAll({
      where: { Id_solicitud: id },
      include: [EstadoSolicitud],
      order: [['id_estadoxsolicitud','ASC']]
    });
    res.json(historial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEstadoToSolicitud = async (req, res) => {
  try {
    console.log("📨 Datos recibidos en POST /estadoxsolicitud:", req.body);
    const { Id_solicitud, id_estado_solicitud } = req.body;
    const item = await EstadoXSolicitud.create({ Id_solicitud, id_estado_solicitud });
    console.log("✅ Relación guardada:", item);
    res.status(201).json(item);
  } catch (err) {
    console.log("❌ Error al guardar relación:", err.message);
    res.status(500).json({ error: err.message });
  }
};
