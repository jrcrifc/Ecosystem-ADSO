import db from "../database/db.js";
import { DataTypes } from "sequelize";

const estadoSolicitudModel = db.define('estado_solicitud', {
    id_estado_solicitud: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    estado: { 
        type: DataTypes.ENUM("generado","aceptado","prestado","cancelado","entregado"),
        allowNull: false
    },
    estados: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,
        allowNull: false 
    },
}, {
    freezeTableName: true,
    tableName: 'estado_solicitud',   // ← ESTO ES LO QUE FALTABA
    timestamps: true                // ← si no tienes createdAt/updatedAt
});

export default estadoSolicitudModel;