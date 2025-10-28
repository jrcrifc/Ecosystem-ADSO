import db from "../database/db.js";
import { DataTypes } from "sequelize";

const personaSolicitanteModel = db.define('persona-solicitante',{
    id_persona_solicitante:{type:DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    Documento: { type: DataTypes.NUMBER },
    Nombres: { type: DataTypes.STRING },
    Correo: { type: DataTypes.CHAR },
    Telefono: { type: DataTypes.CHAR },
    Direccion: { type: DataTypes.CHAR }

    }, {
        freezeTableName: true
    })

    export default personaSolicitanteModel;
