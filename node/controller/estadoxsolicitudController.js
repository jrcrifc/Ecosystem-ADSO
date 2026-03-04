import Estadoxsolicitud from '../models/estadoxsolicitudModel.js';

export const getAllEstadoxsolicitud = async (req, res) => {
	try {
		const rows = await Estadoxsolicitud.findAll();
		res.json(rows);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getEstadoxsolicitud = async (req, res) => {
	try {
		const row = await Estadoxsolicitud.findByPk(req.params.id);
		if (!row) return res.status(404).json({ message: 'No encontrado' });
		res.json(row);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const createEstadoxsolicitud = async (req, res) => {
	try {
		const created = await Estadoxsolicitud.create(req.body);
		res.status(201).json(created);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const updateEstadoxsolicitud = async (req, res) => {
	try {
		const row = await Estadoxsolicitud.findByPk(req.params.id);
		if (!row) return res.status(404).json({ message: 'No encontrado' });
		await row.update(req.body);
		res.json({ message: 'Actualizado' });
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
};

export const deleteEstadoxsolicitud = async (req, res) => {
	try {
		const row = await Estadoxsolicitud.findByPk(req.params.id);
		if (!row) return res.status(404).json({ message: 'No encontrado' });
		await row.destroy();
		res.json({ message: 'Eliminado' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

