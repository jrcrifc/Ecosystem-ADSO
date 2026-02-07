import db from "../database/db.js";
import { DataTypes } from "sequelize";

const solicitudModel = db.define('solicitud_prestamos',{
    id_solicitud:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fecha_inicio: { type: DataTypes.DATE },
    fecha_fin: { type: DataTypes.DATE },
    id_persona_solicitante: { type: DataTypes.INTEGER },
    estado: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,   // ACTIVO por defecto
        allowNull: false 
    },
    }, {
        freezeTableName: true
    })

    export default solicitudModel;
