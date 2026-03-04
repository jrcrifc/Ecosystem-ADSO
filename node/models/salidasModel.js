import db from '../database/db.js'
import { DataTypes } from 'sequelize'

const salidasModel = db.define('salidas_reactivos', {
  id_salida: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_reactivo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad_salida: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  motivo_salida: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_salida: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default salidasModel
