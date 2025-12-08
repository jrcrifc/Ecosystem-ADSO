import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const EstadoSolicitud = db.define('estado_solicitud', {
  id_estado_solicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  estado: { type: DataTypes.STRING }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'estado_solicitud'
});

export default EstadoSolicitud;
