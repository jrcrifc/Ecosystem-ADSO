import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const ProgramaModel = sequelize.define('programas', {
  id_programa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_programa: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nombre_programa: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default ProgramaModel;
