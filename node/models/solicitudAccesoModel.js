import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const SolicitudAccesoModel = sequelize.define('solicitudes_acceso', {
  id_solicitud_acceso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  ficha: { type: DataTypes.STRING, allowNull: false },
  grupo: { type: DataTypes.STRING, allowNull: false },
  motivo: { type: DataTypes.TEXT, allowNull: false },
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    defaultValue: 'pendiente'
  }
}, { freezeTableName: true });

export default SolicitudAccesoModel;