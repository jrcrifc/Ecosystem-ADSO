import db from "../database/db.js";
import { DataTypes } from "sequelize";

const ingresoreactivoModel = db.define('ingreso_reactivo',{
    id_ingreso_reactivo:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fech_ingreso: { type: DataTypes.DATE },
    cantidad_ingreso: { type: DataTypes.DECIMAL(10,2) },
    id_responsable: { type: DataTypes.INTEGER },
    id_lote: { type: DataTypes.INTEGER },
    id_reactivo: { type: DataTypes.INTEGER },
    estado: { 
    type: DataTypes.TINYINT, 
    defaultValue: 1,   // ACTIVO por defecto
    allowNull: false 
},
    }, {
        freezeTableName: true
    })

    export default ingresoreactivoModel;
