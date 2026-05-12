import LogModel from '../models/logModel.js';

export const getLogs = async (req, res) => {
  try {
    const logs = await LogModel.findAll({
      order: [['fecha', 'DESC']],
      limit: 200
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logs' });
  }
};
