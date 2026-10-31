import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const FichaModel = sequelize.define('fichas', {
  id_ficha: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_ficha: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  id_programa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'programas',
      key: 'id_programa'
    }
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default FichaModel;
