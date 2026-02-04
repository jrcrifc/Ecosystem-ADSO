import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const EstadoEquipo = db.define('estado_equipo', {
  id_estado_equipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  estado: { type: DataTypes.STRING }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'estado_equipo'
});

export default EstadoEquipo;