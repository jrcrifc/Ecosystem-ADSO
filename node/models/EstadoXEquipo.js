import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import Equipo from './Equipo.js';
import EstadoEquipo from './EstadoEquipo.js';

const EstadoXEquipo = db.define('estadoxequipo', {
  id_estadoxequipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_equipo: { type: DataTypes.INTEGER },
  id_estado_equipo: { type: DataTypes.INTEGER }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'estadoxequipo'
});

Equipo.hasMany(EstadoXEquipo, { foreignKey: 'id_equipo' });
EstadoXEquipo.belongsTo(Equipo, { foreignKey: 'id_equipo' });

EstadoEquipo.hasMany(EstadoXEquipo, { foreignKey: 'id_estado_equipo' });
EstadoXEquipo.belongsTo(EstadoEquipo, { foreignKey: 'id_estado_equipo' });

export default EstadoXEquipo;