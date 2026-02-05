import db from '../database/db.js'

import { DataTypes } from "sequelize";

const personaSolicitanteModel = db.define('persona_solicitante', {
    id_persona_solicitante: { type: DataTypes.NUMBER, primaryKey: true, autoIncrement: true },
    Nombre: { type: DataTypes.STRING },
    Correo: { type: DataTypes.STRING },
    Telefono: { type: DataTypes.STRING },
    Direccion: { type: DataTypes.STRING },
    nom_programa: { type: DataTypes.STRING },
    num_ficha: { type: DataTypes.STRING },
    id_usuario: { type: DataTypes.INTEGER },
    
}, {
    freezeTableName: true,
});

export default personaSolicitanteModel;