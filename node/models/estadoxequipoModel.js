import { DataTypes } from "sequelize";
import db from "../database/db.js";

const estadoXEquipoModel = db.define("estadoxequipo", {
  id_estadoxequipo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_estado_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "estadoxequipo",
  timestamps: true,
  createdAt: "createdat",
  updatedAt: "updatedat",
});

export default estadoXEquipoModel;
