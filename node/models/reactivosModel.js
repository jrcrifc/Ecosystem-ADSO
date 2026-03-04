import db from '../database/db.js'
import { DataTypes } from 'sequelize'

const reactivosModel = db.define('reactivos', {
  id_reactivo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_reactivo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  cantidad_total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unidad_medida: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: true
})

export default reactivosModel
