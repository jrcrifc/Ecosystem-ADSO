import db from "../database/db.js";
import { DataTypes } from "sequelize";

const cuentadanteModel = db.define('cuentadantes', {
    id_cuentadante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_cuentadante: {
        type: DataTypes.STRING(100),   // ← CORREGIDO
        allowNull: false
    },
    apell_cuentadante: {
        type: DataTypes.STRING(100),   // ← CORREGIDO
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false   // si no tienes createdAt/updatedAt
});

export default cuentadanteModel;