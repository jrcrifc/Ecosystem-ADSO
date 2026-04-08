import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Estadoxequipo = db.define('estadoxequipo', {
  id_estadoxequipo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_estado_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'estadoxequipo',
  timestamps: false
});

export default Estadoxequipo;
