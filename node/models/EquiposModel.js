// Importa la conexión a la base de datos
import db from '../database/db.js';
// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from 'sequelize';

// Define el modelo de la tabla 'equipos' en la base de datos
const EquiposModel = db.define('equipos', {
  // Campo ID - clave primaria autoincrementable
  id_equipo: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  
  // Campo grupo_equipo - clasificación del grupo al que pertenece el equipo
  grupo_equipo: { 
    type: DataTypes.ENUM('Equipo de Laboratorio', 'Maquinaria, Equipos y Herramientas'),
    allowNull: false
  },
  
  // Campo nom_equipo - nombre comercial del equipo
  nom_equipo: { 
    type: DataTypes.STRING,
    allowNull: false
  },
  
  // Campo marca_equipo - marca del fabricante del equipo
  marca_equipo: { 
    type: DataTypes.STRING,
    allowNull: true
  },
  
  // Campo no_placa - número de placa de inventario oficial del SENA
  no_placa: { 
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  
  // Campo id_usuario - clave foránea que referencia al instructor responsable
  id_usuario: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'id_usuario'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  
  // Campo observaciones - notas sobre el estado físico o técnico del equipo
  observaciones: { 
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Campo foto_equipo - URL de la fotografía del equipo en Cloudinary
  foto_equipo: { 
    type: DataTypes.STRING(1000),
    allowNull: true,
    defaultValue: null
  },
  
  // Campo estado - estado lógico de activación del equipo
  estado: { 
    type: DataTypes.TINYINT,
    defaultValue: 1,
    allowNull: false
  },
}, {
  // Evita la pluralización automática del nombre de la tabla
  freezeTableName: true,
  // Activa los campos createdAt y updatedAt
  timestamps: true,
});

// Exporta el modelo de equipos para ser usado en la aplicación
export default EquiposModel;