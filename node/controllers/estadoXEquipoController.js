import EstadoXEquipo from '../models/EstadoXEquipo.js';
import Equipo from '../models/Equipo.js';
import EstadoEquipo from '../models/EstadoEquipo.js';

export const getAll = async (req, res) => {
  try {
    const items = await EstadoXEquipo.findAll({
      include: [Equipo, EstadoEquipo],
      order: [['id_estadoxequipo', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEstadoXEquipo = async (req, res) => {
  try {
    console.log("📨 Datos recibidos en POST /estadoxequipo:", req.body);
    const { id_equipo, id_estado_equipo } = req.body;
    const item = await EstadoXEquipo.create({ id_equipo, id_estado_equipo });
    console.log(" Relación guardada:", item);
    res.status(201).json(item);
  } catch (err) {
    console.log(" Error al guardar relación:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateEstadoXEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await EstadoXEquipo.findByPk(id);
    if (!item) return res.status(404).json({ error: 'EstadoXEquipo not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEstadoXEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await EstadoXEquipo.findByPk(id);
    if (!item) return res.status(404).json({ error: 'EstadoXEquipo not found' });
    await item.destroy();
    res.json({ message: 'EstadoXEquipo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};