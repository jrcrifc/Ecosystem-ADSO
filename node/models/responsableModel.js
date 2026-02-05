import db from '../database/db.js'

import { DataTypes } from "sequelize";


const responsableModel = db.define('responsable', {

    id_responsable: {type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    nombre: {type: DataTypes.STRING},
    apellido: {type: DataTypes.STRING},
    correo: {type: DataTypes.STRING},
    numero_telefono: {type: DataTypes.STRING},
    cargo:{type: DataTypes.ENUM('instructor', 'pasante', 'gestor')},
    id_usuario: {type: DataTypes.INTEGER},

}, {
    freezeTableName: true,
});

export default responsableModel;