import db from "../database/db.js";
import { DataTypes } from "sequelize";

const estadoEquipoModel = db.define(
  "Estado_equipo",
  {
    id_estado_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estado: { type: DataTypes.ENUM('disponible','no disponible','mantenimiento') },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "createdat",
    updatedAt: "updatedat",
  }
);

export default estadoEquipoModel;