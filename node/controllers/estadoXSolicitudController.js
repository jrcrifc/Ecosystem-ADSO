import EstadoXSolicitud from '../models/EstadoXSolicitud.js';
import EstadoSolicitud from '../models/EstadoSolicitud.js';

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
    const { Id_solicitud, id_estado_solicitud } = req.body;
    const item = await EstadoXSolicitud.create({ Id_solicitud, id_estado_solicitud });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
