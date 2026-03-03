import db from "../database/db.js";
import { DataTypes } from "sequelize";

const estadoSolicitudModel = db.define(
  "estado_solicitud",
  {
    id_estado_solicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    estado: { type: DataTypes.ENUM('generado','aceptado','prestado','cancelado','entregado') },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "createdat",
    updatedAt: "updatedat",
  }
);

export default estadoSolicitudModel;