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
    const { estado } = req.body;
    const newItem = await EstadoSolicitud.create({ estado });
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
