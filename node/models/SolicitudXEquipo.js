import { DataTypes } from 'sequelize';
import db from '../database/db.js';
import Solicitud from './Solicitud.js';
import Equipo from './Equipo.js';

const SolicitudXEquipo = db.define('solicitudxequipo', {
  id_solicitudxequipo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Id_solicitud: { type: DataTypes.INTEGER },
  id_equipo: { type: DataTypes.INTEGER }
}, {
  timestamps: true,
  createdAt: 'createdat',
  updatedAt: 'updatedat',
  tableName: 'solicitudxequipo'
});

Solicitud.hasMany(SolicitudXEquipo, { foreignKey: 'Id_solicitud' });
SolicitudXEquipo.belongsTo(Solicitud, { foreignKey: 'Id_solicitud' });

Equipo.hasMany(SolicitudXEquipo, { foreignKey: 'id_equipo' });
SolicitudXEquipo.belongsTo(Equipo, { foreignKey: 'id_equipo' });

export default SolicitudXEquipo;
