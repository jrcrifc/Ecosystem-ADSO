import Responsable from '../models/Responsable.js';

export const getResponsables = async (req, res) => {
  try {
    const data = await Responsable.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createResponsable = async (req, res) => {
  try {
    const nuevo = await Responsable.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
