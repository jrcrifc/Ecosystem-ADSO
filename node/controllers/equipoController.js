import Equipo from '../models/Equipo.js';

export const getEquipos = async (req, res) => {
  try {
    const data = await Equipo.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEquipo = async (req, res) => {
  try {
    const nuevo = await Equipo.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
