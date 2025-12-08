import Solicitud from '../models/Solicitud.js';
import EstadoXSolicitud from '../models/EstadoXSolicitud.js';

export const getSolicitudes = async (req, res) => {
  try {
    const data = await Solicitud.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSolicitud = async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const s = await Solicitud.create({ titulo, descripcion });
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSolicitudWithHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) return res.status(404).json({ error: 'not found' });
    const historial = await EstadoXSolicitud.findAll({ where: { Id_solicitud: id }, order: [['id_estadoxsolicitud','ASC']] });
    res.json({ solicitud, historial });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
