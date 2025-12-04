import { DataTypes } from "sequelize";
import db from "../database/db.js";

const estadoEquipoModel = db.define(
  "estadoequipo",
  {
    id_estado_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_estado: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "estadoequipo",
    timestamps: true,
    createdAt: "createdat",
    updatedAt: "updatedat",
  }
);

export default estadoEquipoModel;
