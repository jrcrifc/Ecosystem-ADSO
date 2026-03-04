import db from '../database/db.js'
import { DataTypes } from 'sequelize'

const solicitudxequipoModel = db.define('solicitudxequipo', {
  id_solicitudxequipo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad_solicitada: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default solicitudxequipoModel
