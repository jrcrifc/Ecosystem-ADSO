import db from "../database/db.js";
import { DataTypes } from "sequelize";

const equipoModel = db.define(
  "equipo",
  {
    id_equipo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fech_inventario: { type: DataTypes.DATEONLY },
    grupo_equipo: { type: DataTypes.STRING },
    nom_equipo: { type: DataTypes.STRING },
    marca_equipo: { type: DataTypes.STRING },
    cantidad_equipo: { type: DataTypes.INTEGER },
    no_placa: { type: DataTypes.STRING },
    nom_cuentadante: { type: DataTypes.STRING },
    observaciones: { type: DataTypes.STRING },
    foto_equipo: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "createdat",
    updatedAt: "updatedat",
  }
);

export default equipoModel;
