import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const LogModel = db.define('auditoria', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  detalles: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default LogModel;
