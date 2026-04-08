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
    type: DataTypes.STRING(255),
    allowNull: false
  },
  marca_equipo: { 
    type: DataTypes.STRING(100),
    allowNull: true
  },
  no_placa: { 
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  id_usuario_cuentadante: { 
    type: DataTypes.INTEGER, 
    allowNull: true
  },
  observaciones: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  // --- CONFIGURACIÓN PARA EL FRONTEND ---
  foto_equipo: { 
    type: DataTypes.STRING(255), 
    allowNull: true,
    defaultValue: null,
    // Este campo guardará el nombre del archivo (ej: imagen-123.jpg)
  },
  // ---------------------------------------
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