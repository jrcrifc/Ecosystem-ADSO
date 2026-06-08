// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from 'sequelize';
// Importa la conexión a la base de datos
import sequelize from '../database/db.js';

// Define el modelo de la tabla 'solicitudes_acceso' en la base de datos
const SolicitudAccesoModel = sequelize.define('solicitudes_acceso', {
  // Campo ID - clave primaria autoincrementable
  id_solicitud_acceso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  
  // Campo id_usuario - clave foránea que referencia al usuario solicitante
  id_usuario: { type: DataTypes.INTEGER, allowNull: false },
  
  // Campo ficha - número de la ficha SENA del usuario
  ficha: { type: DataTypes.STRING, allowNull: false },
  
  // Campo grupo - grupo o programa de formación del usuario
  grupo: { type: DataTypes.STRING, allowNull: false },
  
  // Campo motivo - justificación detallada del acceso solicitado
  motivo: { type: DataTypes.TEXT, allowNull: false },
  
  // Campo estado - estado de la revisión por parte del administrador
  estado: {
    type: DataTypes.ENUM('pendiente', 'aprobado', 'rechazado'),
    defaultValue: 'pendiente'
  }
}, { 
  // Evita la pluralización automática del nombre de la tabla
  freezeTableName: true 
});

// Exporta el modelo de solicitudes de acceso
export default SolicitudAccesoModel;