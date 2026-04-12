import db from "../database/db.js";
import { DataTypes } from "sequelize";

const estadoEquipoModel = db.define('estado_equipo', {
    id_estado_equipo: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },

    estado: { 
        type: DataTypes.ENUM("disponible","no disponible","mantenimiento"),
        allowNull: false
    },
    
}, {
    freezeTableName: true,
    timestamps: true       // ← si no tienes createdAt/updatedAt
});

export default estadoEquipoModel;