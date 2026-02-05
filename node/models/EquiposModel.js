import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const EquiposModel = db.define('equipos', {
    id_equipo: {type:DataTypes.NUMBER, primaryKey: true, autoIncrement: true},
    fech_inventario: {type:DataTypes.DATE},
    grupo_equipo: {type:DataTypes.ENUM('Equipo de Laboratorio', 'Maquinaria, Equipos y Herramientas')},
    nom_equipo: {type:DataTypes.STRING},
    marca_equipo: {type:DataTypes.STRING},
    cantidad_equipo: {type:DataTypes.NUMBER},
    no_placa: {type:DataTypes.STRING},
    nom_cuentadante: {type:DataTypes.STRING},
    observaciones: {type:DataTypes.STRING},
    foto_equipo: {type:DataTypes.STRING, allowNull: true},
}, {
    freezeTableName: true,
});

export default EquiposModel;
