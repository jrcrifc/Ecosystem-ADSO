import db from "../database/db.js";
import { DataTypes } from "sequelize";

const devolucionModel = db.define('devolucion',{
    id_devolucion:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    fecha_entrega: { type: DataTypes.DATE },
    estado_equipo: { 
        type: DataTypes.ENUM('disponible', 'no disponible') 
    },
    id_solicitud: { type: DataTypes.INTEGER },
    

    }, {
        freezeTableName: true
    })

    export default devolucionModel;
