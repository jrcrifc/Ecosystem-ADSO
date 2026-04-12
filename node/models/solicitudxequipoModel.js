import db from "../database/db.js";
import { DataTypes } from "sequelize";

const solicitudxequipoModel = db.define('solicitudxequipo',{
    id_solicitudxequipo:{type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    id_solicitud: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'solicitud',
      key: 'id_solicitud'
    },
    onDelete: 'CASCADE'
  },
  id_equipo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'equipos',
      key: 'id_equipo'
    },
    onDelete: 'CASCADE'
  },
    }, {
        freezeTableName: true
    })

    export default solicitudxequipoModel;
