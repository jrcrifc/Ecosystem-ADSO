import EstadoSolicitud from '../models/EstadoSolicitud.js';

export const getEstados = async (req, res) => {
  try {
    const data = await EstadoSolicitud.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEstado = async (req, res) => {
  try {
    console.log("📨 Datos recibidos en POST /estado-solicitud:", req.body);
    const { estado } = req.body;
    const newItem = await EstadoSolicitud.create({ estado });
    console.log("✅ Estado guardado:", newItem);
    res.status(201).json(newItem);
  } catch (err) {
    console.log("❌ Error al guardar estado:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const estadoItem = await EstadoSolicitud.findByPk(id);
    if (!estadoItem) return res.status(404).json({ error: 'Estado not found' });
    await estadoItem.update(req.body);
    res.json(estadoItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const estadoItem = await EstadoSolicitud.findByPk(id);
    if (!estadoItem) return res.status(404).json({ error: 'Estado not found' });
    await estadoItem.destroy();
    res.json({ message: 'Estado deleted' });
  } catch (err) {
    console.log("❌ Error al eliminar estado:", err.message);
    res.status(500).json({ error: err.message });
  }
};
