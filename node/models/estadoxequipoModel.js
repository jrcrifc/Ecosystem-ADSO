import db from "../database/db.js";
import { DataTypes } from "sequelize";

const estadoxEquipoModel = db.define('estadoxequipo', {
  id_estadoxequipo: { 
    type: DataTypes.INTEGER, 
    primaryKey: true,
    autoIncrement: true,
    allowNull: false   // buena práctica para PK
  },

  id_equipo: { 
    type: DataTypes.INTEGER,
    allowNull: false,          // casi siempre es requerido en este tipo de tablas
    // references: {
    //   model: 'equipos',        // descomenta y ajusta si tienes el modelo de equipos
    //   key: 'id'
    // }
  },

  id_estado_equipo: {   
    type: DataTypes.INTEGER,
    allowNull: false,          // lo mismo, casi siempre requerido
    // references: {
    //   model: 'estado_equipo',  // ajusta el nombre real de la tabla de estados
    //   key: 'id'
    // }
  },
}, {
  freezeTableName: true,       // tabla se llama exactamente 'estadoxequipo' (sin plural)
  timestamps: true             // crea createdAt y updatedAt automáticamente
});

export default estadoxEquipoModel;