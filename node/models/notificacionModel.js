// Importa Sequelize y DataTypes para definir los tipos de datos de los campos
import { DataTypes } from 'sequelize';
// Importa la conexión a la base de datos
import sequelize from '../database/db.js';

// Define el modelo de la tabla 'notificaciones' en la base de datos
const NotificacionModel = sequelize.define('notificaciones', {
  // Campo ID - clave primaria autoincrementable
  id_notificacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  
  // Campo id_usuario_destino - clave foránea del usuario destinatario
  id_usuario_destino: { type: DataTypes.INTEGER, allowNull: false },
  
  // Campo id_usuario_origen - clave foránea del usuario emisor (opcional)
  id_usuario_origen: { type: DataTypes.INTEGER, allowNull: true },
  
  // Campo titulo - título breve de la notificación
  titulo: { type: DataTypes.STRING, allowNull: false },
  
  // Campo mensaje - contenido detallado de la notificación
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  
  // Campo tipo - clasificación de la notificación para renderizado condicional
  tipo: {
    type: DataTypes.ENUM('solicitud_acceso', 'aprobado', 'rechazado', 'general'),
    defaultValue: 'general'
  },
  
  // Campo leida - estado de lectura de la notificación
  leida: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { 
  // Evita la pluralización automática del nombre de la tabla
  freezeTableName: true 
});

// Exporta el modelo de notificaciones para ser usado en la aplicación
export default NotificacionModel;