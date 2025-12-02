import db from "../database/db.js";
import { DataTypes } from "sequelize";

const solicitudxequipoModel = db.define('solicitudxequipo',{
    id_solicitudxequipo:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    id_solicitud: { type: DataTypes.INTEGER },
    id_equipo: { type: DataTypes.INTEGER },
    estado: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,   // ACTIVO por defecto
        allowNull: false 
    },
    }, {
        freezeTableName: true
    })

    export default solicitudxequipoModel;
