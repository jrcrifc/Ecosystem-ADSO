import db from "../database/db.js";
import { DataTypes } from "sequelize";

const estadosolicitudModel = db.define('estado_solicitud', {
    id_estado_solicitud: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    estado: { 
        type: DataTypes.ENUM("generado","aceptado","prestado","entregado","cancelado"),
        allowNull: false
    },
    
}, {
    freezeTableName: true,
    timestamps: true       // ← si no tienes createdAt/updatedAt
});

export default estadosolicitudModel;