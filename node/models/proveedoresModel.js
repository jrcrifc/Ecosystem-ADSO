import db from '../database/db.js'

import { DataTypes } from "sequelize";


const proveedoresModel = db.define('proveedor', {
    id_proveedor: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    nom_proveedor: {type: DataTypes.STRING},
    apel_proveedor: {type: DataTypes.STRING},
    tel_proveedor: {type: DataTypes.STRING},
    dir_proveedor: {type: DataTypes.STRING},
    estado: { 
        type: DataTypes.TINYINT, 
        defaultValue: 1,
        allowNull: false 
    },
}, {
    freezeTableName: true,
});

export default proveedoresModel;