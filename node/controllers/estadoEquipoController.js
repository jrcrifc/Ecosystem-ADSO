import EstadoEquipo from '../models/EstadoEquipo.js';

export const getEstadosEquipo = async (req, res) => {
  try {
    const data = await EstadoEquipo.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEstadoEquipo = async (req, res) => {
  try {
    console.log(" Datos recibidos en POST /estado-equipo:", req.body);
    const { estado } = req.body;
    const newItem = await EstadoEquipo.create({ estado });
    console.log("Estado equipo guardado:", newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.log(" Error al guardar estado equipo:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateEstadoEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await EstadoEquipo.findByPk(id);
    if (!item) return res.status(404).json({ error: 'EstadoEquipo not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEstadoEquipo = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await EstadoEquipo.findByPk(id);
    if (!item) return res.status(404).json({ error: 'EstadoEquipo not found' });
    await item.destroy();
    res.json({ message: 'EstadoEquipo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};