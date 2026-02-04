import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const Responsable = db.define('responsables', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING },
  apellido: { type: DataTypes.STRING },
  correo: { type: DataTypes.STRING },
  telefono: { type: DataTypes.STRING },
  cargo: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING, defaultValue: 'Activo' }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'responsables'
});

export default Responsable;
