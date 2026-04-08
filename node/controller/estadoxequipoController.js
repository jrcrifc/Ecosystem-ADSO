import EstadoxequipoService from '../service/estadoxequipoService.js';

export const getAllEstadoxequipo = async (req, res) => {
  try {
    const data = await EstadoxequipoService.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener estadoxequipo:', error);
    res.status(500).json({ message: 'Error al cargar datos' });
  }
};

export const getEstadoxequipo = async (req, res) => {
  try {
    const data = await EstadoxequipoService.getById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtener estadoxequipo:', error);
    res.status(404).json({ message: error.message || 'Registro no encontrado' });
  }
};

export const createEstadoxequipo = async (req, res) => {
  try {
    const data = await EstadoxequipoService.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error al crear estadoxequipo:', error);
    res.status(400).json({ message: error.message });
  }
};

export const updateEstadoxequipo = async (req, res) => {
  try {
    const data = await EstadoxequipoService.update(req.params.id, req.body);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al actualizar estadoxequipo:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteEstadoxequipo = async (req, res) => {
  try {
    await EstadoxequipoService.delete(req.params.id);
    res.status(200).json({ message: 'Registro eliminado' });
  } catch (error) {
    console.error('Error al eliminar estadoxequipo:', error);
    res.status(400).json({ message: error.message });
  }
};