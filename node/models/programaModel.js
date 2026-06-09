import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const ProgramaModel = sequelize.define('programas', {
  id_programa: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_programa: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

export default ProgramaModel;
