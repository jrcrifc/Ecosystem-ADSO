import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const Solicitud = db.define('solicitudes', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING },
  descripcion: { type: DataTypes.TEXT }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'solicitudes'
});

export default Solicitud;
