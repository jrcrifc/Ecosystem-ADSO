import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import Solicitud from './Solicitud.js';
import EstadoSolicitud from './EstadoSolicitud.js';

const EstadoXSolicitud = db.define('estadoxsolicitud', {
  id_estadoxsolicitud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Id_solicitud: { type: DataTypes.INTEGER },
  id_estado_solicitud: { type: DataTypes.INTEGER }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'estadoxsolicitud'
});

Solicitud.hasMany(EstadoXSolicitud, { foreignKey: 'Id_solicitud' });
EstadoXSolicitud.belongsTo(Solicitud, { foreignKey: 'Id_solicitud' });

EstadoSolicitud.hasMany(EstadoXSolicitud, { foreignKey: 'id_estado_solicitud' });
EstadoXSolicitud.belongsTo(EstadoSolicitud, { foreignKey: 'id_estado_solicitud' });

export default EstadoXSolicitud;
