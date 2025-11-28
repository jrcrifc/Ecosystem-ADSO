import db from "../database/db.js";
import { DataTypes } from "sequelize";

const responsableModel = db.define(
  "responsable",
  {
    id_responsable: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
    apellido: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    numero_telefono: { type: DataTypes.STRING },
    cargo: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "createdat",
    updatedAt: "updatedat",
  }
);

export default responsableModel;
