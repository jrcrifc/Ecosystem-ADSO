import db from "../database/db.js";
import { DataTypes } from "sequelize";

const responsableModel = db.define('responsable',{
    id_responsable:{type:DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    documento: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.CHAR },
    apellido: { type: DataTypes.CHAR },
    numero_telefono: { type: DataTypes.INTEGER },
    correo_responsable: { type: DataTypes.CHAR },
    
    

    }, {
        freezeTableName: true
    })

    export default responsableModel;
