import { DataTypes } from "sequelize";
import db from "../database/db.js";

const AuditLogModel = db.define("audit_logs", {
  id_log: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: true, // Por si es el sistema o alguien no logueado
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detalle: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: "audit_logs",
  timestamps: true,
});

export default AuditLogModel;
