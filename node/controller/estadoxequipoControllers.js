import Estadoxequipo from '../models/estadoxequipoModel.js';

export const getAllEstadoxequipo = async (req, res) => {
  try {
    const rows = await Estadoxequipo.findAll();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEstadoxequipo = async (req, res) => {
  try {
    const row = await Estadoxequipo.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEstadoxequipo = async (req, res) => {
  try {
    const created = await Estadoxequipo.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateEstadoxequipo = async (req, res) => {
  try {
    const row = await Estadoxequipo.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    await row.update(req.body);
    res.json({ message: 'Actualizado' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEstadoxequipo = async (req, res) => {
  try {
    const row = await Estadoxequipo.findByPk(req.params.id);
    if (!row) return res.status(404).json({ message: 'No encontrado' });
    await row.destroy();
    res.json({ message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
