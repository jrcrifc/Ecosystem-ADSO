import db from "../database/db.js";
import { DataTypes } from "sequelize";

const cuentadanteModel = db.define('cuentadantes', {

    id_cuentadante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nom_cuentadante: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    apell_cuentadante: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    tel_cuentadante: {
        type: DataTypes.INTEGER
    },

    estado: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'activo'
    }

}, {
    freezeTableName: true,
    timestamps: false
});

export default cuentadanteModel;