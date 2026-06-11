import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const AprendizModel = sequelize.define('aprendices', {
  id_aprendiz: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  documento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombres_apellidos: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  id_ficha: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

export default AprendizModel;
