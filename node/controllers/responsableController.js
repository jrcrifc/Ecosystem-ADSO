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


export const updateResponsable = async (req, res) => {
  try {
    const { id } = req.params;
    const responsable = await Responsable.findByPk(id);
    if (!responsable) return res.status(404).json({ error: 'Responsable not found' });
    await responsable.update(req.body);
    res.json(responsable);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteResponsable = async (req, res) => {
  try {
    const { id } = req.params;
    const responsable = await Responsable.findByPk(id);
    if (!responsable) return res.status(404).json({ error: 'Responsable not found' });
    await responsable.destroy();
    res.json({ message: 'Responsable deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

