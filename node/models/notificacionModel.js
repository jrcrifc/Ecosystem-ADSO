import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const NotificacionModel = sequelize.define('notificaciones', {
  id_notificacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_usuario_destino: { type: DataTypes.INTEGER, allowNull: false },
  id_usuario_origen: { type: DataTypes.INTEGER, allowNull: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  tipo: {
    type: DataTypes.ENUM('solicitud_acceso', 'aprobado', 'rechazado', 'general'),
    defaultValue: 'general'
  },
  leida: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

export default NotificacionModel;