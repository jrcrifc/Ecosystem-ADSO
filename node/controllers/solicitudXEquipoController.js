import SolicitudXEquipo from '../models/SolicitudXEquipo.js';
import Solicitud from '../models/Solicitud.js';
import Equipo from '../models/Equipo.js';

export const getAll = async (req, res) => {
  try {
    const items = await SolicitudXEquipo.findAll({
      include: [Solicitud, Equipo],
      order: [['id_solicitudxequipo', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createRelation = async (req, res) => {
  try {
    console.log('📨 Datos recibidos en POST /solicitudxequipo:', req.body);
    const { Id_solicitud, id_equipo } = req.body;
    if (!Id_solicitud || !id_equipo) return res.status(400).json({ error: 'Id_solicitud e id_equipo son requeridos' });

    const item = await SolicitudXEquipo.create({ Id_solicitud, id_equipo });
    console.log('✅ Relación guardada:', item);
    res.status(201).json(item);
  } catch (err) {
    console.error('❌ Error al guardar relación:', err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateRelation = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await SolicitudXEquipo.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Relación no encontrada' });

    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteRelation = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await SolicitudXEquipo.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Relación no encontrada' });

    await item.destroy();
    res.json({ message: 'Relación eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
