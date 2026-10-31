// ============================================================
// 📊 SERVICIO DE HISTORIAL DE ESTADOS DE EQUIPO (estadoxequipoService)
// Este servicio administra el registro histórico de cambios de
// estado físico de los equipos. Cada vez que un equipo cambia de
// estado (disponible, no disponible, mantenimiento) se guarda un
// registro con la fecha del cambio. También determina en tiempo
// real si un equipo está ocupado por una solicitud activa.
// ============================================================

// Importa el modelo de historial de estados de equipo
import Estadoxequipo from '../models/estadoxequipoModel.js';
// Importa el modelo de equipos para consultar datos del equipo
import EquiposModel from '../models/EquiposModel.js';
// Importa el modelo de catálogo de estados de equipo
import estadoEquipoModel from '../models/Estado_equipoModel.js';
// Importa el modelo de solicitudes para verificar ocupación
import SolicitudModel from '../models/solicitudModel.js';
// Importa el modelo de historial de estados de solicitud
import EstadoxsolicitudModel from '../models/estadoxsolicitudModel.js';
// Importa el modelo de catálogo de estados de solicitud
import EstadoSolicitudModel from '../models/Estado_solicitudModel.js';
// Importa función para sumar días hábiles excluyendo festivos y fines de semana
import { sumarDiasHabiles } from '../utils/fechasHabiles.js';
import InstructorModel from '../models/instructorModel.js';
import UserModel from '../models/userModel.js';
import emailService from './emailService.js';
import NotificacionService from './notificacionService.js';
import { getIO } from '../socket.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SUSCRIPCIONES_FILE = path.resolve(__dirname, '../database/suscripciones_revision.json');

const leerSuscripciones = () => {
  try {
    if (!fs.existsSync(SUSCRIPCIONES_FILE)) return [];
    const raw = fs.readFileSync(SUSCRIPCIONES_FILE, 'utf8');
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
};

const guardarSuscripciones = (lista) => {
  try {
    fs.writeFileSync(SUSCRIPCIONES_FILE, JSON.stringify(lista, null, 2), 'utf8');
  } catch (e) {
    console.error('[estadoxequipoService] Error guardando suscripciones de revisión:', e.message);
  }
};

// Define la clase de servicio para el historial de estados de equipo
class EstadoxequipoService {
  // Registra la suscripción de un instructor o administrador para avisarle al correo y campanita cuando el equipo termine revisión
  async suscribirRevision(id_equipo, id_usuario, rol) {
    const equipo = await EquiposModel.findByPk(id_equipo);
    if (!equipo) throw new Error('Equipo no encontrado');

    let email = null;
    let nombres_apellidos = 'Usuario';

    if (String(rol || '').toLowerCase() === 'instructor') {
      const inst = await InstructorModel.findByPk(id_usuario);
      if (inst) {
        email = inst.email;
        nombres_apellidos = inst.nombres_apellidos;
      }
    }
    if (!email) {
      const u = await UserModel.findByPk(id_usuario);
      if (u) {
        email = u.email;
        nombres_apellidos = u.nombres_apellidos;
      } else {
        const instFallback = await InstructorModel.findByPk(id_usuario);
        if (instFallback) {
          email = instFallback.email;
          nombres_apellidos = instFallback.nombres_apellidos;
        }
      }
    }

    const lista = leerSuscripciones();
    const yaExiste = lista.some(
      s => Number(s.id_equipo) === Number(id_equipo) && Number(s.id_usuario) === Number(id_usuario)
    );

    if (!yaExiste) {
      lista.push({
        id_equipo: Number(id_equipo),
        id_usuario: Number(id_usuario),
        rol: rol || 'Instructor',
        email,
        nombres_apellidos,
        createdAt: new Date().toISOString()
      });
      guardarSuscripciones(lista);
    }

    return {
      ok: true,
      yaSuscrito: yaExiste,
      equipo: equipo.nom_equipo,
      email,
      nombres_apellidos
    };
  }

  // Obtiene todo el historial de cambios de estado de equipos
  async getAll() {
    // Consulta todos los registros incluyendo datos del equipo y su estado
    return await Estadoxequipo.findAll({
      include: [
        {
          model: EquiposModel,
          as: 'equipo',
          attributes: ['id_equipo', 'nom_equipo', 'marca_equipo', 'no_placa']
        },
        {
          model: estadoEquipoModel,
          as: 'estadoEquipo',
          attributes: ['estado']
        }
      ],
      order: [['id_estadoxequipo', 'DESC']]
    });
  }

  // Obtiene un registro del historial por su ID
  async getById(id) {
    // Busca el registro por su clave primaria incluyendo equipo y estado
    const data = await Estadoxequipo.findByPk(id, {
      include: [
        { model: EquiposModel, as: 'equipo' },
        { model: estadoEquipoModel, as: 'estadoEquipo' }
      ]
    });
    // Si no existe, lanza un error
    if (!data) throw new Error("Registro no encontrado");
    // Retorna el registro encontrado
    return data;
  }

  // Obtiene el último estado registrado de cada equipo y determina si está ocupado
  async getUltimosEstados() {
    // Consulta todos los equipos con su historial de estados y solicitudes activas
    const equipos = await EquiposModel.findAll({
      include: [
        {
          model: Estadoxequipo,
          as: 'estadosEquipo',
          include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }],
          attributes: ['id_estadoxequipo', 'createdAt']
        },
        {
          model: SolicitudModel,
          as: 'solicitudes',
          where: { estado: 1 },
          required: false,
          include: [{
            model: EstadoxsolicitudModel,
            as: 'estados',
            include: [{ model: EstadoSolicitudModel, as: 'estadoSolicitud', attributes: ['estado'] }],
          }],
          through: { attributes: [] }
        }
      ]
    });
    // Procesa cada equipo para determinar su último estado y si está ocupado
    return equipos.map(e => {
      const eq = e.toJSON();
      // Ordena los estados del equipo del más reciente al más antiguo
      const ordenados = (eq.estadosEquipo || []).sort(
        (a, b) => b.id_estadoxequipo - a.id_estadoxequipo
      );
      // Obtiene el último estado físico base o asume disponible por defecto
      let ultimoEstado = ordenados[0]?.estadoEquipo?.estado || 'disponible';
      // Inicializa banderas de ocupado y fecha disponible
      let estaOcupado = false;
      let fecha_disponible = null;

      // Extrae todas las reservas activas (generado, aceptado o prestado)
      const reservasActivas = (eq.solicitudes || [])
        .filter(s => {
          const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
          const ultimoEstadoSol = estadosSol[0]?.estadoSolicitud?.estado;
          return ['generado', 'aceptado', 'prestado'].includes(ultimoEstadoSol);
        })
        .map(s => {
          const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
          return {
            id_solicitud: s.id_solicitud,
            fecha_inicio: s.fecha_inicio,
            fecha_fin: s.fecha_fin,
            estado: estadosSol[0]?.estadoSolicitud?.estado
          };
        });

      // Extrae la fecha de fin de la solicitud activa o del último estado en revisión
      let fecha_devolucion = null;
      let fecha_disponible_post_revision = null;

      // 1. Si el equipo está físicamente en revisión o mantenimiento, ese estado físico manda y no se sobrescribe
      if (ultimoEstado === 'revision' || ultimoEstado === 'mantenimiento') {
        estaOcupado = true;
        if (ultimoEstado === 'revision' && ordenados[0]?.createdAt) {
          const d = new Date(ordenados[0].createdAt);
          const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
          const fechaInicioRevision = `${y}-${m}-${dd}`;
          fecha_disponible_post_revision = sumarDiasHabiles(fechaInicioRevision, 3);
          fecha_disponible = fecha_disponible_post_revision;
        }
      } else if (reservasActivas.length > 0) {
        estaOcupado = true;
        const esPrestado = reservasActivas.some(r => r.estado === 'prestado') || ultimoEstado === 'prestado';
        ultimoEstado = esPrestado ? 'prestado' : 'solicitado';

        // Ordena por la reserva más reciente/futura
        const reservaPrioritaria = reservasActivas.sort((a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin))[0];
        fecha_devolucion = reservaPrioritaria?.fecha_fin ? new Date(reservaPrioritaria.fecha_fin).toISOString().slice(0, 10) : null;
        fecha_disponible_post_revision = fecha_devolucion ? sumarDiasHabiles(fecha_devolucion, 3) : null;
        fecha_disponible = fecha_disponible_post_revision;
      } else if (ultimoEstado === 'prestado' || ultimoEstado === 'solicitado') {
        estaOcupado = true;
        const solicitudesHistoricas = (eq.solicitudes || []).filter(s => s.fecha_fin).sort((a, b) => new Date(b.fecha_fin) - new Date(a.fecha_fin));
        if (solicitudesHistoricas.length > 0) {
          fecha_devolucion = new Date(solicitudesHistoricas[0].fecha_fin).toISOString().slice(0, 10);
        } else {
          const hoy = new Date();
          fecha_devolucion = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
        }
        fecha_disponible_post_revision = fecha_devolucion ? sumarDiasHabiles(fecha_devolucion, 3) : null;
        fecha_disponible = fecha_disponible_post_revision;
      }
      // Retorna el equipo con los campos calculados, fechas y reservas activas
      return {
        ...eq,
        ultimoEstado,
        estaOcupado,
        fecha_devolucion,
        fecha_disponible_post_revision,
        fecha_disponible,
        reservas_activas: reservasActivas
      };
    });
  }

  // Crea un nuevo registro en el historial de estados de equipo
  async create(data) {
    return await Estadoxequipo.create(data);
  }

  // Notifica al instructor (y al administrador si es inactivo por daño grave) el resultado de la revisión de un equipo (1 o varios equipos)
  async notificarResultadoRevisionEquipo(id_equipo, nuevoEstado) {
    let idUsuarioDevueltoNotificado = null;
    try {
      const equipo = await EquiposModel.findByPk(id_equipo, {
        include: [
          {
            model: SolicitudModel,
            as: 'solicitudes',
            where: { estado: 1 },
            required: false,
            through: { attributes: [] }
          }
        ]
      });
      if (!equipo) return null;

      const ultimaSol = (equipo.solicitudes || []).sort((a, b) => b.id_solicitud - a.id_solicitud)[0];
      if (!ultimaSol || !ultimaSol.id_usuario) return null;

      idUsuarioDevueltoNotificado = Number(ultimaSol.id_usuario);

      // Consultar la solicitud completa con todos sus equipos y sus estados para armar el desglose si tiene 2 o más equipos
      const solicitudCompleta = await SolicitudModel.findByPk(ultimaSol.id_solicitud, {
        include: [
          {
            model: EquiposModel,
            as: 'equipos',
            attributes: ['id_equipo', 'nom_equipo', 'no_placa', 'estado'],
            include: [
              {
                model: Estadoxequipo,
                as: 'estadosEquipo',
                include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }]
              }
            ],
            through: { attributes: [] }
          }
        ]
      });

      const listaEquiposSol = solicitudCompleta?.equipos || [equipo];
      const equiposRevision = listaEquiposSol.map(eqItem => {
        const eqJson = eqItem.toJSON ? eqItem.toJSON() : eqItem;
        let estadoRev = 'disponible';
        if (Number(eqJson.id_equipo) === Number(id_equipo)) {
          estadoRev = nuevoEstado;
        } else if (Number(eqJson.estado) === 0) {
          estadoRev = 'inactivo';
        } else {
          const ord = (eqJson.estadosEquipo || []).sort((a, b) => b.id_estadoxequipo - a.id_estadoxequipo);
          estadoRev = ord[0]?.estadoEquipo?.estado || 'disponible';
        }
        return {
          id_equipo: eqJson.id_equipo,
          nom_equipo: eqJson.nom_equipo,
          no_placa: eqJson.no_placa,
          estadoRevision: estadoRev
        };
      });

      const solicitudDetalle = {
        id_solicitud: ultimaSol.id_solicitud,
        equipos: equiposRevision
      };

      // Resolver datos del instructor solicitante
      let instructor = await InstructorModel.findByPk(ultimaSol.id_usuario);
      let email = instructor?.email;
      let nombre = instructor?.nombres_apellidos;
      if (!email) {
        const u = await UserModel.findByPk(ultimaSol.id_usuario);
        email = u?.email;
        nombre = u?.nombres_apellidos;
      }

      if (email) {
        emailService.sendNotificacionRevisionEmail(
          email,
          nombre || 'Instructor',
          equipo.nom_equipo,
          nuevoEstado,
          solicitudDetalle
        ).catch(err => {
          console.error('[estadoxequipoService] Error enviando correo de revisión:', err?.message);
        });
      }

      const esMultiple = equiposRevision.length > 1;
      const otrosEquipos = equiposRevision.filter(e => Number(e.id_equipo) !== Number(id_equipo));

      // Construir resumen compacto de los demás equipos para la campanita cuando son 2 o más
      const partesOtros = [];
      const otrosDisponibles = otrosEquipos.filter(e => e.estadoRevision === 'disponible').map(e => `"${e.nom_equipo}"`);
      const otrosMantenimiento = otrosEquipos.filter(e => e.estadoRevision === 'mantenimiento').map(e => `"${e.nom_equipo}"`);
      const otrosInactivos = otrosEquipos.filter(e => e.estadoRevision === 'inactivo').map(e => `"${e.nom_equipo}"`);
      const otrosEnRevision = otrosEquipos.filter(e => e.estadoRevision === 'revision').map(e => `"${e.nom_equipo}"`);

      if (otrosDisponibles.length > 0) partesOtros.push(`en buen estado: ${otrosDisponibles.join(', ')}`);
      if (otrosMantenimiento.length > 0) partesOtros.push(`en mantenimiento: ${otrosMantenimiento.join(', ')}`);
      if (otrosInactivos.length > 0) partesOtros.push(`dañado/inactivo: ${otrosInactivos.join(', ')}`);
      if (otrosEnRevision.length > 0) partesOtros.push(`aún en revisión: ${otrosEnRevision.join(', ')}`);
      const resumenOtrosTexto = partesOtros.length > 0 ? partesOtros.join('; ') : '';

      let notifTitulo = '';
      let notifMensaje = '';

      if (!esMultiple) {
        if (nuevoEstado === 'disponible') {
          notifTitulo = `✅ Solicitud #${ultimaSol.id_solicitud}: Revisión Aprobada`;
          notifMensaje = `El equipo "${equipo.nom_equipo}" se recibió en buen estado y ya está Disponible. Tu solicitud #${ultimaSol.id_solicitud} pasó a Entregado.`;
        } else if (nuevoEstado === 'mantenimiento') {
          notifTitulo = `⚠️ Solicitud #${ultimaSol.id_solicitud}: Equipo a Mantenimiento`;
          notifMensaje = `El equipo "${equipo.nom_equipo}" que entregaste pasó a Mantenimiento por mal estado. Por favor comunícate con el administrador o acércate al laboratorio.`;
        } else if (nuevoEstado === 'inactivo') {
          notifTitulo = `🚨 Solicitud #${ultimaSol.id_solicitud}: Equipo Dañado (Inactivo)`;
          notifMensaje = `El equipo "${equipo.nom_equipo}" que devolviste está dañado (Inactivo). Se hará un reporte; acércate al Laboratorio Ambiental.`;
        }
      } else {
        if (nuevoEstado === 'disponible') {
          notifTitulo = `✅ Solicitud #${ultimaSol.id_solicitud}: "${equipo.nom_equipo}" en Buen Estado`;
          notifMensaje = `De tus ${equiposRevision.length} equipos: "${equipo.nom_equipo}" se entregó en buen estado (${resumenOtrosTexto}).`;
        } else if (nuevoEstado === 'mantenimiento') {
          notifTitulo = `⚠️ Solicitud #${ultimaSol.id_solicitud}: "${equipo.nom_equipo}" a Mantenimiento`;
          notifMensaje = `De tus ${equiposRevision.length} equipos: "${equipo.nom_equipo}" pasó a Mantenimiento por mal estado (${resumenOtrosTexto}). Comunícate con el admin o acércate al laboratorio.`;
        } else if (nuevoEstado === 'inactivo') {
          notifTitulo = `🚨 Solicitud #${ultimaSol.id_solicitud}: "${equipo.nom_equipo}" Dañado (Inactivo)`;
          notifMensaje = `De tus ${equiposRevision.length} equipos: "${equipo.nom_equipo}" fue Inactivado por daño grave (${resumenOtrosTexto}). Se hará un reporte; acércate al Laboratorio Ambiental.`;
        }
      }

      if (notifTitulo) {
        await NotificacionService.crearNotificacion({
          id_usuario_destino: ultimaSol.id_usuario,
          id_usuario_origen: null,
          titulo: notifTitulo,
          mensaje: notifMensaje,
          tipo: 'cambio_estado_solicitud'
        });
      }

      // Si el equipo fue colocado en INACTIVO por daño grave, notificar también al Administrador (Campanita y Correo)
      if (nuevoEstado === 'inactivo') {
        const tituloAdmin = `🚨 Daño Grave en Solicitud #${ultimaSol.id_solicitud}`;
        const mensajeAdmin = !esMultiple
          ? `El equipo "${equipo.nom_equipo}" devuelto por ${nombre || 'el instructor'} fue inactivado por daño grave. Se requiere generar reporte; se citó al instructor al Laboratorio Ambiental.`
          : `Solicitud #${ultimaSol.id_solicitud} (${nombre || 'Instructor'}): "${equipo.nom_equipo}" inactivado por daño grave (${resumenOtrosTexto}). Generar reporte en Laboratorio Ambiental.`;

        await NotificacionService.notificarAdmins({
          id_usuario_origen: ultimaSol.id_usuario,
          titulo: tituloAdmin,
          mensaje: mensajeAdmin,
          tipo: 'alerta'
        });

        const admins = await UserModel.findAll({
          where: { rol: 'Administrador', estado: 1 },
          attributes: ['email', 'nombres_apellidos']
        });
        const correosAdmin = new Set(admins.map(a => a.email).filter(Boolean));
        if (process.env.EMAIL_USER) correosAdmin.add(process.env.EMAIL_USER);

        for (const adminEmail of correosAdmin) {
          emailService.sendReporteDanoAdminEmail(
            adminEmail,
            nombre || 'Instructor',
            equipo.nom_equipo,
            ultimaSol.id_solicitud,
            solicitudDetalle
          ).catch(err => {
            console.error('[estadoxequipoService] Error enviando correo de daño grave al admin:', err?.message);
          });
        }
      }
    } catch (errNotif) {
      console.error('[estadoxequipoService] Error en notificarResultadoRevisionEquipo:', errNotif);
    }
    return idUsuarioDevueltoNotificado;
  }

  // Cambia el estado físico de un equipo validando que no esté ocupado
  async cambiarEstado(id_equipo, id_estado_equipo) {
    // Busca el equipo incluyendo solicitudes activas e historial de estados
    const equipo = await EquiposModel.findByPk(id_equipo, {
      include: [
        {
          model: SolicitudModel,
          as: 'solicitudes',
          where: { estado: 1 },
          required: false,
          include: [{
            model: EstadoxsolicitudModel,
            as: 'estados',
            include: [{ model: EstadoSolicitudModel, as: 'estadoSolicitud', attributes: ['estado'] }],
          }],
          through: { attributes: [] }
        },
        {
          model: Estadoxequipo,
          as: 'estadosEquipo',
          include: [{ model: estadoEquipoModel, as: 'estadoEquipo', attributes: ['estado'] }]
        }
      ]
    });
    // Si no existe el equipo, lanza un error
    if (!equipo) throw new Error('Equipo no encontrado');
    // Obtiene el último estado físico del equipo o asume disponible
    const ultimoEstadoEq = equipo.estadosEquipo?.sort((a, b) => b.id_estadoxequipo - a.id_estadoxequipo)[0]?.estadoEquipo?.estado || 'disponible';
    // Inicializa la bandera de ocupado como falsa
    let estaOcupado = false;
    // Solo verifica ocupación si el equipo está disponible físicamente
    if (ultimoEstadoEq === 'disponible') {
      const ahora = new Date();
      // Verifica si alguna solicitud activa tiene estado bloqueante
      estaOcupado = (equipo.solicitudes || []).some(s => {
        // Ordena los estados de la solicitud del más reciente al más antiguo
        const estadosSol = (s.estados || []).sort((a, b) => b.id_estadoxsolicitud - a.id_estadoxsolicitud);
        // Obtiene el último estado de la solicitud
        const ultimoEstadoSol = estadosSol[0]?.estadoSolicitud?.estado;
        // Verifica si el tiempo de la solicitud ha expirado
        const tiempoExpirado = s.fecha_fin && new Date(s.fecha_fin) < ahora;
        // Retorna true si el estado es bloqueante y no ha expirado
        return ['generado', 'aceptado', 'prestado'].includes(ultimoEstadoSol) && !tiempoExpirado;
      });
    }
    // Si el equipo está ocupado por una solicitud, lanza un error
    if (estaOcupado) {
      throw new Error('No se puede cambiar el estado de un equipo que está prestado o solicitado');
    }
    // Obtiene el nombre del nuevo estado
    const targetEstadoObj = await estadoEquipoModel.findByPk(id_estado_equipo);
    const nuevoEstado = targetEstadoObj?.estado || (id_estado_equipo === 1 ? 'disponible' : (id_estado_equipo === 2 ? 'mantenimiento' : 'otro'));

    // Crea el nuevo registro de estado en el historial
    const nuevoRegistro = await Estadoxequipo.create({ id_equipo, id_estado_equipo });

    // Si el estado anterior era "revision", notificar al instructor (y al admin si aplica)
    let idUsuarioDevueltoNotificado = null;
    if (ultimoEstadoEq === 'revision') {
      idUsuarioDevueltoNotificado = await this.notificarResultadoRevisionEquipo(id_equipo, nuevoEstado);
    }

    // Notificar a todos los usuarios/instructores que hicieron clic en "🔔 Avisarme cuando termine la revisión"
    if (nuevoEstado === 'disponible') {
      try {
        const todasSuscripciones = leerSuscripciones();
        const suscriptoresEquipo = todasSuscripciones.filter(s => Number(s.id_equipo) === Number(id_equipo));
        const restantes = todasSuscripciones.filter(s => Number(s.id_equipo) !== Number(id_equipo));

        if (suscriptoresEquipo.length > 0) {
          for (const sub of suscriptoresEquipo) {
            // Enviar notificación a la campanita
            if (Number(sub.id_usuario) !== idUsuarioDevueltoNotificado) {
              await NotificacionService.crearNotificacion({
                id_usuario_destino: sub.id_usuario,
                id_usuario_origen: null,
                titulo: '🔔 Equipo Disponible tras Revisión',
                mensaje: `El equipo "${equipo.nom_equipo}" que estabas esperando ya superó la revisión técnica y está DISPONIBLE para que lo solicites.`,
                tipo: 'general'
              });
            }
            // Enviar correo electrónico al suscriptor
            if (sub.email) {
              emailService.sendEquipoDisponibleSuscriptorEmail(
                sub.email,
                sub.nombres_apellidos || 'Instructor',
                equipo.nom_equipo
              ).catch(err => {
                console.error('[estadoxequipoService] Error enviando correo a suscriptor:', err?.message);
              });
            }
          }
          guardarSuscripciones(restantes);
        }
      } catch (errSub) {
        console.error('[estadoxequipoService] Error notificando suscriptores de revisión:', errSub);
      }
    }

    try {
      const io = getIO();
      if (io) {
        io.emit('equipo_actualizado', { id_equipo });
        io.emit('solicitud_actualizada');
      }
    } catch {}

    return nuevoRegistro;
  }

  // Actualiza los datos de un registro del historial
  async update(id, data) {
    // Ejecuta la actualización filtrando por ID
    const result = await Estadoxequipo.update(data, { where: { id_estadoxequipo: id } });
    // Si no se actualizó ningún registro, lanza un error
    if (result[0] === 0) throw new Error("Registro no encontrado");
    // Retorna true indicando que la actualización fue exitosa
    return true;
  }

  // Elimina físicamente un registro del historial
  async delete(id) {
    // Ejecuta la eliminación filtrando por ID
    const deleted = await Estadoxequipo.destroy({ where: { id_estadoxequipo: id } });
    // Si no se eliminó ningún registro, lanza un error
    if (!deleted) throw new Error("Registro no encontrado");
    // Retorna true indicando que la eliminación fue exitosa
    return true;
  }
}

// Exporta una instancia única del servicio para usar como singleton
export default new EstadoxequipoService();
