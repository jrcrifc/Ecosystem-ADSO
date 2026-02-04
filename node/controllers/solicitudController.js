import Solicitud from '../models/Solicitud.js';
import EstadoXSolicitud from '../models/EstadoXSolicitud.js';
import EstadoSolicitud from '../models/EstadoSolicitud.js';

export const getSolicitudes = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      include: [{
        model: EstadoXSolicitud,
        include: [EstadoSolicitud]
      }]
    });
    res.json(solicitudes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSolicitudWithHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByPk(id, {
      include: [{
        model: EstadoXSolicitud,
        include: [EstadoSolicitud],
        order: [['id_estadoxsolicitud', 'ASC']]
      }]
    });
    if (!solicitud) return res.status(404).json({ error: 'Solicitud not found' });
    res.json(solicitud);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSolicitud = async (req, res) => {
  try {
    console.log("Datos recibidos en POST /solicitudes:", req.body);

    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ error: 'titulo y descripcion son obligatorios' });
    }

    const solicitud = await Solicitud.create({ titulo, descripcion });

    console.log("Solicitud guardada:", solicitud);
    res.status(201).json(solicitud);

  } catch (err) {
    console.error("Error al guardar solicitud:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) return res.status(404).json({ error: 'Solicitud not found' });
    await solicitud.update(req.body);
    res.json(solicitud);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByPk(id);
    if (!solicitud) return res.status(404).json({ error: 'Solicitud not found' });
    await solicitud.destroy();
    res.json({ message: 'Solicitud deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
