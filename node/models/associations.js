// Importa el modelo de equipos para definir sus relaciones
import equipoModel from "./EquiposModel.js";
// Importa el modelo de movimientos de reactivos para definir sus relaciones
import movimientoreactivoModel from "./movimientoreactivosModel.js";
// Importa el modelo de reactivos para definir sus relaciones
import reactivoModel from "./reactivosModel.js";
// Importa el modelo de proveedores para definir sus relaciones
import proveedorModel from "./proveedoresModel.js";
// Importa el modelo de historial de estados de solicitud
import estadoxsolicitudModel from "./estadoxsolicitudModel.js";
// Importa el modelo de solicitudes de préstamo
import solicitudModel from "./solicitudModel.js";
// Importa el modelo de historial de estados de equipo
import estadoxEquipoModel from "./estadoxequipoModel.js";
// Importa el modelo de relación solicitud-equipo
import solicitudxequipoModel from "./solicitudxequipoModel.js";
// Importa el modelo de salidas de reactivos
import salidasModel from "./salidasModel.js";
// Importa el modelo de usuarios
import userModel from "./userModel.js";
// Importa el modelo de estados de equipo
import estadoEquipoModel from "./Estado_equipoModel.js";
// Importa el modelo de estados de solicitud
import estadoSolicitudModel from "./Estado_solicitudModel.js";
// Importa el modelo de notificaciones
import NotificacionModel from "./notificacionModel.js";
// Importa el modelo de solicitudes de acceso
import SolicitudAccesoModel from "./solicitudAccesoModel.js";
// Importa el modelo de logs de auditoría
import LogModel from "./logModel.js";
// Importa el modelo de configuración del sistema
import ConfigModel from "./configModel.js";
// Importa nuevos modelos
import programaModel from "./programaModel.js";
import fichaModel from "./fichaModel.js";
import aprendizModel from "./aprendizModel.js";
import instructorModel from "./instructorModel.js";

// Define la relación: un equipo pertenece a un usuario (instructor)
equipoModel.belongsTo(userModel, { foreignKey: 'id_usuario', as: 'instructor' });
// Define la relación: un usuario tiene muchos equipos (como instructor)
userModel.hasMany(equipoModel,   { foreignKey: 'id_usuario', as: 'equipos_asignados' });

// Relaciones Programa - Ficha
programaModel.hasMany(fichaModel, { foreignKey: 'id_programa', as: 'fichas' });
fichaModel.belongsTo(programaModel, { foreignKey: 'id_programa', as: 'programa' });

// Relaciones Ficha - Aprendiz
fichaModel.hasMany(aprendizModel, { foreignKey: 'id_ficha', as: 'aprendices' });
aprendizModel.belongsTo(fichaModel, { foreignKey: 'id_ficha', as: 'ficha' });

// Relaciones Ficha - Usuario (Pasantes/Gestores)
fichaModel.hasMany(userModel, { foreignKey: 'id_ficha', as: 'usuarios' });
userModel.belongsTo(fichaModel, { foreignKey: 'id_ficha', as: 'ficha' });

// Relaciones Programa - Usuario (Pasantes/Gestores)
programaModel.hasMany(userModel, { foreignKey: 'id_programa', as: 'usuarios' });
userModel.belongsTo(programaModel, { foreignKey: 'id_programa', as: 'programa' });

// Relación Aprendiz - Usuario
aprendizModel.belongsTo(userModel, { foreignKey: 'id_usuario', as: 'usuario' });
userModel.hasOne(aprendizModel, { foreignKey: 'id_usuario', as: 'aprendiz' });

// Relación Instructor - Usuario
instructorModel.belongsTo(userModel, { foreignKey: 'id_usuario', as: 'usuario' });
userModel.hasOne(instructorModel, { foreignKey: 'id_usuario', as: 'instructor_info' });

// Define la relación: un movimiento pertenece a un reactivo
movimientoreactivoModel.belongsTo(reactivoModel,  { foreignKey: 'id_reactivo',  as: 'reactivo' });
// Define la relación: un reactivo tiene muchos movimientos
reactivoModel.hasMany(movimientoreactivoModel,     { foreignKey: 'id_reactivo',  as: 'movimientos' });
// Define la relación: un movimiento pertenece a un proveedor
movimientoreactivoModel.belongsTo(proveedorModel, { foreignKey: 'id_proveedor', as: 'proveedor' });
// Define la relación: un proveedor tiene muchos movimientos
proveedorModel.hasMany(movimientoreactivoModel,   { foreignKey: 'id_proveedor', as: 'movimientos' });

// Define la relación: una salida pertenece a un movimiento de reactivo
salidasModel.belongsTo(movimientoreactivoModel,  { foreignKey: 'id_movimiento_reactivo', as: 'movimiento' });
// Define la relación: un movimiento tiene muchas salidas
movimientoreactivoModel.hasMany(salidasModel,    { foreignKey: 'id_movimiento_reactivo', as: 'salidas' });

// Define la relación: un registro de historial pertenece a una solicitud
estadoxsolicitudModel.belongsTo(solicitudModel,      { foreignKey: 'id_solicitud',       as: 'solicitud' });
// Define la relación: un registro de historial pertenece a un estado de solicitud
estadoxsolicitudModel.belongsTo(estadoSolicitudModel, { foreignKey: 'id_estado_solicitud', as: 'estadoSolicitud' });
// Define la relación: una solicitud tiene muchos registros de historial
solicitudModel.hasMany(estadoxsolicitudModel,         { foreignKey: 'id_solicitud',       as: 'estados' });
// Define la relación: un estado de solicitud tiene muchos registros
estadoSolicitudModel.hasMany(estadoxsolicitudModel,   { foreignKey: 'id_estado_solicitud', as: 'registros' });

// Define la relación: un registro de historial pertenece a un equipo
estadoxEquipoModel.belongsTo(equipoModel,      { foreignKey: 'id_equipo',        as: 'equipo' });
// Define la relación: un registro de historial pertenece a un estado de equipo
estadoxEquipoModel.belongsTo(estadoEquipoModel, { foreignKey: 'id_estado_equipo', as: 'estadoEquipo' });
// Define la relación: un equipo tiene muchos registros de historial
equipoModel.hasMany(estadoxEquipoModel,         { foreignKey: 'id_equipo',        as: 'estadosEquipo' });
// Define la relación: un estado de equipo tiene muchos registros
estadoEquipoModel.hasMany(estadoxEquipoModel,   { foreignKey: 'id_estado_equipo', as: 'registros' });

// Define la relación: un registro pivote pertenece a una solicitud
solicitudxequipoModel.belongsTo(solicitudModel, { foreignKey: 'id_solicitud', as: 'solicitud' });
// Define la relación: un registro pivote pertenece a un equipo
solicitudxequipoModel.belongsTo(equipoModel,    { foreignKey: 'id_equipo',    as: 'equipo' });
// Define la relación muchos a muchos: una solicitud tiene muchos equipos a través de la tabla pivote
solicitudModel.belongsToMany(equipoModel,       { through: solicitudxequipoModel, foreignKey: 'id_solicitud', as: 'equipos' });
// Define la relación muchos a muchos: un equipo tiene muchas solicitudes a través de la tabla pivote
equipoModel.belongsToMany(solicitudModel,       { through: solicitudxequipoModel, foreignKey: 'id_equipo',    as: 'solicitudes' });

// Define la relación: una solicitud pertenece a un usuario
solicitudModel.belongsTo(userModel, { foreignKey: 'id_usuario', as: 'usuario' });
// Define la relación: un usuario tiene muchas solicitudes
userModel.hasMany(solicitudModel,   { foreignKey: 'id_usuario', as: 'solicitudes' });

// Define la relación: una notificación pertenece a un usuario destino
NotificacionModel.belongsTo(userModel, { foreignKey: 'id_usuario_destino', as: 'usuarioDestino' });
// Define la relación: un usuario tiene muchas notificaciones
userModel.hasMany(NotificacionModel,   { foreignKey: 'id_usuario_destino', as: 'notificaciones' });

// Define la relación: una solicitud de acceso pertenece a un usuario
SolicitudAccesoModel.belongsTo(userModel, { foreignKey: 'id_usuario', as: 'usuario' });
// Define la relación uno a uno: un usuario tiene una solicitud de acceso
userModel.hasOne(SolicitudAccesoModel,    { foreignKey: 'id_usuario', as: 'solicitudAcceso' });