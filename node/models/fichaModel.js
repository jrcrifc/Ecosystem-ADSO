import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const FichaModel = sequelize.define('fichas', {
  id_ficha: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numero_ficha: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  id_programa: { 
    type: DataTypes.INTEGER,
    allowNull: true
  },
  jornada: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

export default FichaModel;
