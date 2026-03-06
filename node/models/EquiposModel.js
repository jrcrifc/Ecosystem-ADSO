import db from '../database/db.js';
import { DataTypes } from 'sequelize';

const EquiposModel = db.define('equipos', {
  id_equipo: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  grupo_equipo: { 
    type: DataTypes.ENUM('Equipo de Laboratorio', 'Maquinaria, Equipos y Herramientas'),
    allowNull: false
  },
  nom_equipo: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  marca_equipo: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  no_placa: { 
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  id_usuario_cuentadante: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',          // nombre de la tabla (tal como está en la BD)
      key: 'id_usuario'           // campo PK de usuarios
    },
    onDelete: 'SET NULL',         // si borran usuario → null
    onUpdate: 'CASCADE'
  },
  observaciones: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  foto_equipo: { 
  type: DataTypes.STRING(1000),  // ← Cambia a 255 (o más si quieres)
  allowNull: true,
  defaultValue: null
  },
  estado: { 
    type: DataTypes.TINYINT,
    defaultValue: 1,
    allowNull: false
  },
}, {
  freezeTableName: true,
  timestamps: true,
});

export default EquiposModel;