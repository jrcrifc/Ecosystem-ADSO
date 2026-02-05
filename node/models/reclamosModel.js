import db from "../database/db.js";
import { DataTypes } from "sequelize";

const personaSolicitanteModel = db.define('reclamos',{
    id_reclamo:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fec_reclamo: { type: DataTypes.DATE },
    mot_reclamo: { type: DataTypes.TEXT },
    

    }, {
        freezeTableName: true
    })

    export default personaSolicitanteModel;
