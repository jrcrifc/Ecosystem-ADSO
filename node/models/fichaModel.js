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
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  freezeTableName: true,
  timestamps: true,
});

export default FichaModel;
