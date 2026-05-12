import LogModel from '../models/logModel.js';

export const registrarLog = async (usuario, accion, modulo, detalles = '') => {
  try {
    await LogModel.create({
      usuario,
      accion,
      modulo,
      detalles
    });
  } catch (error) {
    console.error('Error al registrar log:', error);
  }
};
