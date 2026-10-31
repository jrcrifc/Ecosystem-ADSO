// Archivo: solicitudform.jsx — Formulario de creación/edición de solicitudes de préstamo con validación por rol

// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa hooks de React para estado y efectos
import { useState, useEffect } from "react";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa Socket.io para actualizaciones en tiempo real
import socket from "../socket.js";
// Importa DatePicker y su CSS
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
registerLocale('es', es);

// Importa utilidades para cálculo de días hábiles en Colombia (excluyendo fines de semana y festivos)
import {
  esFechaReal,
  esFestivoOFinDeSemana,
  esDiaHabil,
  sumarDiasHabiles,
  diffDiasHabiles,
  hoyStr,
  formatDateStr,
  parseDateStr
} from "../utils/fechasHabiles.js";

// Función que valida que la hora esté entre 7:00 AM y 3:30 PM
const isTimeValid = (time) => {
  if (!time) return false;
  const [hh, mm] = time.split(":").map(Number);
  const totalMinutes = hh * 60 + mm;
  return totalMinutes >= 7 * 60 && totalMinutes <= 15 * 60 + 30;
};

// Componente del formulario de solicitud de préstamo
const SolicitudPrestamoForm = ({ selectedSolicitud, refreshData, hideModal }) => {
  // Estado para la fecha de recogida del préstamo
  const [fecha_inicio, setFecha_inicio] = useState("");
  // Estado para la hora de recogida del préstamo
  const [hora_inicio, setHora_inicio]   = useState("07:00");
  // Estado para la fecha de devolución del préstamo
  const [fecha_fin, setFecha_fin]       = useState("");
  // Estado para la hora de devolución del préstamo (por defecto 07:00 AM, máx 3:30 PM)
  const [hora_fin, setHora_fin]         = useState("07:00");
  // Estado que indica si se está guardando la solicitud
  const [loading, setLoading]           = useState(false);
  // Estado que almacena los errores de validación del formulario
  const [errors, setErrors]             = useState({});
  // Estado para el estado activo/inactivo de la solicitud
  const [estado, setEstado]             = useState(1);
  // Estado que almacena la lista de equipos disponibles
  const [equipos, setEquipos]           = useState([]);
  // Estado que almacena los IDs de los equipos seleccionados
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
  // Estado para el texto de búsqueda de equipos
  const [busquedaEquipo, setBusquedaEquipo] = useState("");
  // Estado que almacena la lista de usuarios para seleccionar solicitante (admin)
  const [usuarios, setUsuarios] = useState([]);
  // Estado para el ID del usuario solicitante seleccionado
  const [idUsuarioSolicitante, setIdUsuarioSolicitante] = useState("");
  // Estado para el texto de búsqueda de usuarios
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  // Obtiene el token de autenticación desde sessionStorage
  const getToken = () => sessionStorage.getItem("token");
  // Crea el objeto de headers con el token para las peticiones
  const headers  = { Authorization: `Bearer ${getToken()}` };
  // Lee los datos del usuario desde sessionStorage
  const stored = sessionStorage.getItem("user");
  // Parsea los datos del usuario si existen
  const userData = stored ? JSON.parse(stored) : null;
  // Determina el rol del usuario logueado en minúsculas
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  // Verifica si el usuario es administrador
  const esAdmin = userRol === "administrador" || userRol === "admin";
  // Solo el administrador puede seleccionar un solicitante distinto
  const puedeSeleccionarSolicitante = esAdmin;
  // Busca el usuario seleccionado en la lista de usuarios cargados
  const selectedUser = usuarios.find(u => u.id_usuario === parseInt(idUsuarioSolicitante));

  // Efecto que carga equipos disponibles y usuarios al montar o cambiar selectedSolicitud
  useEffect(() => {
    const cargarEquipos = () => {
      apiAxios
        .get("/api/estadoxequipo/ultimos/estados", { headers })
        .then(res => setEquipos(res.data))
        .catch(() => {});
    };
    cargarEquipos();
    // Escucha en tiempo real cambios de equipos y solicitudes para actualizar disponibilidad
    socket.on('equipo_actualizado', cargarEquipos);
    socket.on('solicitud_actualizada', cargarEquipos);
    // Si puede seleccionar solicitante (Admin), carga únicamente los Instructores desde la tabla instructores
    if (puedeSeleccionarSolicitante) {
      apiAxios
        .get("/api/instructores", { headers })
        .then(res => {
          const instructores = (res.data || []).map(i => ({
            id_usuario: i.id_instructor,
            id_instructor: i.id_instructor,
            nombres_apellidos: i.nombres_apellidos,
            documento: i.documento,
            email: i.email,
            rol: 'Instructor'
          }));
          setUsuarios(instructores);
        })
        .catch(() => {});
    }
    // Limpieza de listeners al desmontar
    return () => {
      socket.off('equipo_actualizado', cargarEquipos);
      socket.off('solicitud_actualizada', cargarEquipos);
    };
  }, [selectedSolicitud]);

  // Efecto que prellena el formulario cuando se edita una solicitud existente
  useEffect(() => {
    if (selectedSolicitud) {
      const getLocalPart = (isoString) => {
        if (!isoString) return { date: "", time: "07:00" };
        const d = new Date(isoString);
        if (isNaN(d)) return { date: "", time: "07:00" };
        let date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        let time = d.toTimeString().slice(0, 5);
        if (time === "19:00" || isoString.includes("T00:00:00.000Z")) {
           date = isoString.substring(0, 10);
           time = "07:00";
        }
        return { date, time };
      };
      const start = getLocalPart(selectedSolicitud.fecha_inicio);
      setFecha_inicio(start.date);
      setHora_inicio(start.time);
      const end = getLocalPart(selectedSolicitud.fecha_fin);
      setFecha_fin(end.date);
      setHora_fin(end.time);
      setEstado(selectedSolicitud.estado ?? 1);
      const idsActuales = (selectedSolicitud.equipos || []).map(e => e.id_equipo);
      setEquiposSeleccionados(idsActuales);
      setIdUsuarioSolicitante("");
    } else {
      setFecha_inicio(sumarDiasHabiles(hoyStr(), 5));
      setHora_inicio("07:00");
      setHora_fin("07:00");
      setFecha_fin("");
      setEstado(1);
      setEquiposSeleccionados([]);
      setIdUsuarioSolicitante("");
    }
  }, [selectedSolicitud]);

  // Función que agrega o remueve un equipo de la selección
  const toggleEquipo = (id_equipo) => {
    setEquiposSeleccionados(prev =>
      prev.includes(id_equipo)
        ? prev.filter(id => id !== id_equipo)
        : [...prev, id_equipo]
    );
  };

  // Filtra los equipos por texto de búsqueda
  const equiposFiltrados = equipos.filter(e => {
    const search = busquedaEquipo.toLowerCase().trim();
    return [e.nom_equipo, e.marca_equipo, e.no_placa]
      .some(f => String(f || "").toLowerCase().includes(search));
  });

  // Filtra los usuarios por nombre, documento o email
  const usuariosFiltrados = usuarios.filter(u =>
    (u.nombres_apellidos || "").toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
    (u.documento || "").includes(busquedaUsuario) ||
    (u.email || "").toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  // ===================== VALIDACIÓN CROSS-BROWSER DE FECHAS =====================

  const validarFechaRecogida = (valor) => {
    if (!valor) return "La fecha de recogida es requerida";
    if (!esFechaReal(valor)) return "Fecha inválida (no existe en el calendario)";
    if (esFestivoOFinDeSemana(valor)) return "No se pueden seleccionar fines de semana ni festivos";
    const diasDesdeHoy = diffDiasHabiles(hoyStr(), valor);
    if (diasDesdeHoy < 5) return "Debe ser con mínimo 5 días hábiles de anticipación";
    return null;
  };

  const validarFechaDevolucion = (valor) => {
    if (!valor) return "La fecha de devolución es requerida";
    if (!esFechaReal(valor)) return "Fecha inválida (no existe en el calendario)";
    if (esFestivoOFinDeSemana(valor)) return "No se pueden seleccionar fines de semana ni festivos";
    if (!fecha_inicio) return "Primero selecciona la fecha de recogida";
    const diasDesdeInicio = diffDiasHabiles(fecha_inicio, valor);
    if (diasDesdeInicio < 1) return "Debe ser posterior a la fecha de recogida";
    if (diasDesdeInicio > 15) return "Máximo 15 días hábiles después de la recogida";
    return null;
  };

  const handleFechaRecogidaChange = (valor) => {
    setFecha_inicio(valor);
    const error = validarFechaRecogida(valor);
    setErrors(prev => ({ ...prev, fecha_inicio: error }));
    if (fecha_fin) {
      const validarFinConNuevoInicio = () => {
        if (!fecha_fin) return "La fecha de devolución es requerida";
        if (!esFechaReal(fecha_fin)) return "Fecha inválida (no existe en el calendario)";
        if (esFestivoOFinDeSemana(fecha_fin)) return "No se pueden seleccionar fines de semana ni festivos";
        if (!valor) return "Primero selecciona la fecha de recogida";
        const diasDesdeInicio = diffDiasHabiles(valor, fecha_fin);
        if (diasDesdeInicio < 1) return "Debe ser posterior a la fecha de recogida";
        if (diasDesdeInicio > 15) return "Máximo 15 días hábiles después de la recogida";
        return null;
      };
      setErrors(prev => ({ ...prev, fecha_inicio: error, fecha_fin: validarFinConNuevoInicio() }));
    }
  };

  const handleFechaDevolucionChange = (valor) => {
    setFecha_fin(valor);
    const error = validarFechaDevolucion(valor);
    setErrors(prev => ({ ...prev, fecha_fin: error }));
  };

  // Función real para registrar en el servidor el aviso por correo y campanita cuando un equipo termine revisión
  const handleAvisarmeRevision = async (eq, fechaDisp) => {
    let destinoEmail = userData?.email || userData?.user?.email || "tu correo registrado";
    try {
      const res = await apiAxios.post(
        "/api/estadoxequipo/suscribir-revision",
        {
          id_equipo: eq.id_equipo,
          id_usuario_solicitante: (puedeSeleccionarSolicitante && idUsuarioSolicitante) ? parseInt(idUsuarioSolicitante) : undefined
        },
        { headers }
      );
      if (res.data?.email) {
        destinoEmail = res.data.email;
      }
    } catch (err) {
      console.warn("Advertencia registrando suscripción de revisión:", err?.message);
    }

    Swal.fire({
      title: `🔔 Notificación Programada`,
      html: `
        <div style="text-align: left; font-size: 13px; color: #334155; line-height: 1.6;">
          <p>Has solicitado que te avisemos sobre el equipo <strong>${eq.nom_equipo}</strong>.</p>
          <p>En cuanto el equipo sea devuelto y supere los <strong>3 días hábiles de revisión técnica</strong> en el laboratorio (estimado: <strong>${fechaDisp || 'próximamente'}</strong>), te enviaremos automáticamente un aviso a <strong>${destinoEmail}</strong> y una alerta en la <strong>campanita</strong> de la plataforma para que puedas pedirlo de inmediato.</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#0077B6",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Volver al formulario",
      cancelButtonText: "Salir del formulario"
    }).then((res) => {
      if (res.dismiss === Swal.DismissReason.cancel) {
        hideModal();
      }
    });
  };

  // Función que valida y envía el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    const errorRecogida = validarFechaRecogida(fecha_inicio);
    if (errorRecogida) nuevosErrores.fecha_inicio = errorRecogida;

    if (!isTimeValid(hora_inicio)) nuevosErrores.hora_inicio = "Debe estar entre 7:00 AM y 3:30 PM";

    const errorDevolucion = validarFechaDevolucion(fecha_fin);
    if (errorDevolucion) nuevosErrores.fecha_fin = errorDevolucion;

    if (!isTimeValid(hora_fin)) nuevosErrores.hora_fin = "Debe estar entre 7:00 AM y 3:30 PM";

    if (fecha_inicio && fecha_fin && hora_inicio && hora_fin) {
      if (new Date(`${fecha_fin}T${hora_fin}`) <= new Date(`${fecha_inicio}T${hora_inicio}`)) {
        nuevosErrores.hora_fin = "La devolución debe ser posterior a la recogida";
      }
    }

    if (selectedSolicitud && equiposSeleccionados.length === 0) {
      const confirmacion = await Swal.fire({
        title: "¿Eliminar solicitud?",
        text: "No seleccionaste ningún equipo. Al actualizar la solicitud sin equipos, esta será eliminada del sistema. ¿Deseas continuar y eliminarla?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Sí, eliminar solicitud",
        cancelButtonText: "Cancelar"
      });

      if (confirmacion.isConfirmed) {
        try {
          setLoading(true);
          await apiAxios.delete(`/api/solicitud/${selectedSolicitud.id_solicitud}`, { headers });
          hideModal();
          refreshData();
          Swal.fire({
            icon: "success",
            title: "Solicitud eliminada",
            text: "La solicitud fue eliminada correctamente.",
            timer: 1800,
            showConfirmButton: false
          });
        } catch (err) {
          Swal.fire("Error", err.response?.data?.message || "No se pudo eliminar la solicitud", "error");
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    if (!selectedSolicitud && equiposSeleccionados.length === 0) {
      nuevosErrores.equipos = "Selecciona al menos un equipo";
    }
    if (puedeSeleccionarSolicitante && !selectedSolicitud && !idUsuarioSolicitante) {
      nuevosErrores.solicitante = "Debes seleccionar un solicitante";
    }
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }
    setErrors({});

    const data = {
      fecha_inicio: new Date(`${fecha_inicio}T${hora_inicio}:00`).toISOString(),
      fecha_fin:    new Date(`${fecha_fin}T${hora_fin}:00`).toISOString(),
      estado,
      equipos_ids:  equiposSeleccionados,
    };
    if (puedeSeleccionarSolicitante && idUsuarioSolicitante) {
      data.id_usuario_solicitante = parseInt(idUsuarioSolicitante);
    }
    try {
      setLoading(true);
      if (selectedSolicitud) {
        await apiAxios.put(
          `/api/solicitud/${selectedSolicitud.id_solicitud}`,
          data,
          { headers }
        );
        hideModal();
        refreshData();
        Swal.fire({ icon: "success", title: "✅ Actualizado", text: "Solicitud modificada correctamente", timer: 1500, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/solicitud", data, { headers });
        hideModal();
        refreshData();
        Swal.fire({ icon: "success", title: "✅ Registrada", text: "Solicitud creada correctamente", timer: 1500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire("💀 Error", error.response?.data?.message || "No se pudo guardar", "error");
    } finally {
      setLoading(false);
    }
  };

  const minRecogidaStr = sumarDiasHabiles(hoyStr(), 5);
  const minDevolucionStr = fecha_inicio ? sumarDiasHabiles(fecha_inicio, 1) : sumarDiasHabiles(hoyStr(), 6);
  const maxDevolucionStr = fecha_inicio ? sumarDiasHabiles(fecha_inicio, 15) : sumarDiasHabiles(hoyStr(), 23);

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "bold",
    color: "#000",
    marginBottom: "4px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  const fieldStyle = {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1.5px solid #dbeafe",
    fontSize: "13px",
    color: "#1e293b",
    outline: "none"
  };

  return (
    <form onSubmit={handleSubmit} noValidate style={{ padding: "18px 22px" }}>
      <div className="row g-3">

        {/* ===================== 1. SELECTOR DE EQUIPOS ===================== */}
        <div className="col-12" style={{ background: "#f0f7ff", border: "1px solid #dbeafe", borderRadius: "8px", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "#0077B6", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.3px" }}>
            🔬 1. Equipos a Solicitar
          </span>
          {equiposSeleccionados.length > 0 && (
            <span className="badge" style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", fontSize: "11px" }}>
              {equiposSeleccionados.length} seleccionado(s)
            </span>
          )}
        </div>

        <div className="col-12">
          {errors.equipos && <div className="text-danger mb-2" style={{ fontSize: "12px", fontWeight: "600" }}>{errors.equipos}</div>}
          <input
            type="text"
            style={{ ...fieldStyle, marginBottom: "8px" }}
            placeholder="🔍 Buscar equipo por nombre, marca o placa..."
            value={busquedaEquipo}
            onChange={e => setBusquedaEquipo(e.target.value)}
          />
          <div style={{
            maxHeight: "230px", overflowY: "auto",
            border: "1.5px solid #dbeafe", borderRadius: "10px", padding: "8px", background: "#f8fafc"
          }}>
            {equiposFiltrados.length === 0 ? (
              <p className="text-muted text-center small my-3">No se encontraron equipos</p>
            ) : (
              equiposFiltrados.map(equipo => {
                const estaActivo = equipo.estado !== 0;
                const estadoBase = (equipo.ultimoEstado || "disponible").toLowerCase();
                const estaEnMantenimiento = estadoBase === "mantenimiento";
                const estaEnRevision = estadoBase === "revision";
                const estaPrestado = estadoBase === "prestado";
                const estaSolicitado = estadoBase === "solicitado" || (!estaPrestado && !estaEnRevision && !estaEnMantenimiento && equipo.estaOcupado);
                const estaDisponible = estadoBase === "disponible" && !equipo.estaOcupado;

                const yaSeleccionadoEnEdicion = selectedSolicitud && (selectedSolicitud.equipos || []).some(e => e.id_equipo === equipo.id_equipo);
                const puedeSeleccionarse = estaActivo && (estaDisponible || yaSeleccionadoEnEdicion);

                const seleccionado = equiposSeleccionados.includes(equipo.id_equipo);

                const formatearFechaLegible = (fStr) => {
                  if (!fStr) return "";
                  const [y, m, d] = String(fStr).substring(0, 10).split("-");
                  if (!y || !m || !d) return fStr;
                  return `${d}/${m}/${y}`;
                };

                const fechaDevolucionEstimada = equipo.fecha_devolucion ? formatearFechaLegible(equipo.fecha_devolucion) : null;
                const fechaDisponibleConRevision = equipo.fecha_disponible_post_revision 
                  ? formatearFechaLegible(equipo.fecha_disponible_post_revision) 
                  : (equipo.fecha_devolucion ? formatearFechaLegible(sumarDiasHabiles(equipo.fecha_devolucion, 3)) : null);

                return (
                  <div
                    key={equipo.id_equipo}
                    onClick={() => puedeSeleccionarse && toggleEquipo(equipo.id_equipo)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 12px", marginBottom: "6px",
                      borderRadius: "8px", 
                      cursor: puedeSeleccionarse ? "pointer" : "not-allowed",
                      border: `1.5px solid ${seleccionado ? "#0077B6" : "#e2e8f0"}`,
                      backgroundColor: seleccionado ? "#dbeafe" : !estaActivo ? "#fff1f2" : puedeSeleccionarse ? "#fff" : "#f1f5f9",
                      opacity: puedeSeleccionarse || seleccionado ? 1 : 0.85,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      border: `2px solid ${seleccionado ? "#0077B6" : "#94a3b8"}`,
                      backgroundColor: seleccionado ? "#0077B6" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {seleccionado && <i className="fas fa-check" style={{ color: "#fff", fontSize: 11 }}></i>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="fw-semibold" style={{ fontSize: "0.85rem", color: "#0f172a" }}>
                        {equipo.nom_equipo}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Placa: {equipo.no_placa || "Sin placa"}
                      </div>

                      {!estaActivo && (
                        <div style={{ color: "#dc3545", fontSize: "0.72rem", fontWeight: "700", marginTop: "2px" }}>
                          🚫 Equipo inactivo — No disponible para solicitudes
                        </div>
                      )}

                      {estaActivo && estaEnMantenimiento && (
                        <div style={{ color: "#d97706", fontSize: "0.72rem", fontWeight: "700", marginTop: "2px" }}>
                          🔧 En mantenimiento — No disponible
                        </div>
                      )}

                      {estaActivo && !estaEnMantenimiento && (estaSolicitado || estaPrestado) && (
                        <div style={{ marginTop: "3px" }}>
                          <div style={{ color: estaPrestado ? "#ca8a04" : "#6366f1", fontSize: "0.72rem", fontWeight: "700" }}>
                            {estaPrestado ? "📦 Equipo actualmente en préstamo" : "📝 Equipo solicitado por otro usuario"}
                            {fechaDevolucionEstimada && ` (Devolución: ${fechaDevolucionEstimada})`}
                          </div>
                          {fechaDisponibleConRevision && (
                            <div style={{ color: "#0284c7", fontSize: "0.72rem", fontWeight: "600", marginTop: "1px" }}>
                              ✨ Disponible después de 3 días de revisión: <strong>{fechaDisponibleConRevision}</strong>
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAvisarmeRevision(equipo, fechaDisponibleConRevision);
                            }}
                            style={{
                              background: "#eff6ff", border: "1px solid #bfdbfe", color: "#0077B6",
                              borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: "700"
                            }}
                          >
                            🔔 Avisarme cuando termine la revisión
                          </button>
                        </div>
                      )}

                      {estaActivo && estaEnRevision && (
                        <div style={{ marginTop: "3px" }}>
                          <div style={{ color: "#7c3aed", fontSize: "0.72rem", fontWeight: "700" }}>
                            🔬 En revisión técnica en laboratorio (3 días hábiles)
                          </div>
                          {fechaDisponibleConRevision && (
                            <div style={{ color: "#0284c7", fontSize: "0.72rem", fontWeight: "600", marginTop: "1px" }}>
                              ✨ Disponible estimado al terminar revisión: <strong>{fechaDisponibleConRevision}</strong>
                            </div>
                          )}
                          <button
                            type="button"
                            className="btn btn-sm mt-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAvisarmeRevision(equipo, fechaDisponibleConRevision);
                            }}
                            style={{
                              background: "#eff6ff", border: "1px solid #bfdbfe", color: "#0077B6",
                              borderRadius: "6px", padding: "2px 8px", fontSize: "11px", fontWeight: "700"
                            }}
                          >
                            🔔 Avisarme cuando termine la revisión
                          </button>
                        </div>
                      )}

                      {estaActivo && estaDisponible && (
                        <div style={{ color: "#16a34a", fontSize: "0.72rem", fontWeight: "700", marginTop: "2px" }}>
                          ✅ Disponible para solicitud inmediata
                        </div>
                      )}
                    </div>

                    {!estaActivo ? (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem",
                        fontWeight: 700, color: "#fff", flexShrink: 0,
                        backgroundColor: "#dc3545"
                      }}>
                        Inactivo
                      </span>
                    ) : estaEnMantenimiento ? (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem",
                        fontWeight: 700, color: "#fff", flexShrink: 0,
                        backgroundColor: "#d97706"
                      }}>
                        Mantenimiento
                      </span>
                    ) : estaEnRevision ? (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem",
                        fontWeight: 700, color: "#fff", flexShrink: 0,
                        backgroundColor: "#7c3aed"
                      }}>
                        En Revisión
                      </span>
                    ) : estaPrestado ? (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem",
                        fontWeight: 700, color: "#fff", flexShrink: 0,
                        backgroundColor: "#ca8a04"
                      }}>
                        Prestado
                      </span>
                    ) : estaSolicitado ? (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem",
                        fontWeight: 700, color: "#fff", flexShrink: 0,
                        backgroundColor: "#6366f1"
                      }}>
                        Solicitado
                      </span>
                    ) : (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: "0.72rem",
                        fontWeight: 700, color: "#fff", flexShrink: 0,
                        backgroundColor: "#2D8A4E"
                      }}>
                        Disponible
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ===================== 2. SELECTOR DE SOLICITANTE (ADMIN) ===================== */}
        {puedeSeleccionarSolicitante && !selectedSolicitud && (
          <>
            <div className="col-12 mt-2" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px" }}>
              <p style={{ margin: 0, fontSize: "11px", color: "#065f46", fontWeight: "700", textTransform: "uppercase" }}>
                👨‍🏫 2. Instructor Solicitante
              </p>
            </div>
            <div className="col-12">
              <label style={labelStyle}>
                Buscar Instructor <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                style={{ ...fieldStyle, borderColor: errors.solicitante ? "#dc3545" : "#dbeafe" }}
                placeholder="Escribe el nombre, documento o email del instructor..."
                value={busquedaUsuario}
                onChange={e => { setBusquedaUsuario(e.target.value); setErrors({...errors, solicitante: null}); }}
              />
              {errors.solicitante && <div className="invalid-feedback mb-2" style={{ display: 'block', fontSize: "11px" }}>{errors.solicitante}</div>}
              
              {selectedUser && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "10px 14px", borderRadius: "10px", marginTop: "8px",
                  background: "#dbeafe", border: "1.5px solid #0077B6"
                }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #0077B6, #023E8A)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: "800", fontSize: "13px", flexShrink: 0
                  }}>
                    {selectedUser.nombres_apellidos?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", fontSize: "13px", color: "#023E8A" }}>
                      {selectedUser.nombres_apellidos}
                    </div>
                    <div style={{ fontSize: "11px", color: "#475569" }}>
                      {selectedUser.email} · Doc: {selectedUser.documento}
                    </div>
                  </div>
                  <button type="button" onClick={() => setIdUsuarioSolicitante("")} style={{
                    background: "#fee2e2", border: "none", color: "#dc2626",
                    cursor: "pointer", width: "26px", height: "26px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700"
                  }}>✕</button>
                </div>
              )}

              {!selectedUser && busquedaUsuario.trim().length > 0 && (
                <div style={{
                  maxHeight: "170px", overflowY: "auto",
                  border: "1.5px solid #dbeafe", borderRadius: "8px", padding: "6px",
                  background: "#ffffff", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  marginTop: "4px"
                }}>
                  {usuariosFiltrados.length === 0 ? (
                    <p style={{ color: "#dc3545", fontWeight: "bold", textAlign: "center", fontSize: "12px", margin: "8px 0" }}>
                      ⚠️ No se encontraron instructores con esa búsqueda
                    </p>
                  ) : usuariosFiltrados.map(u => (
                    <div key={u.id_usuario}
                      onClick={() => { setIdUsuarioSolicitante(String(u.id_usuario)); setBusquedaUsuario(""); }}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "8px 12px", borderRadius: "8px", cursor: "pointer",
                        marginBottom: "2px", transition: "background 0.15s",
                        border: "1px solid transparent"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f0f7ff"; e.currentTarget.style.borderColor = "#dbeafe"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                    >
                      <div style={{
                        width: "30px", height: "30px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #0077B6, #023E8A)", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: "12px", fontWeight: "700",
                        color: "#fff", flexShrink: 0
                      }}>
                        {u.nombres_apellidos?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "600", fontSize: "12.5px", color: "#0f172a" }}>{u.nombres_apellidos}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{u.email} · {u.documento}</div>
                      </div>
                      <span style={{
                        fontSize: "10px", fontWeight: "700", color: "#0077B6",
                        background: "#dbeafe", padding: "2px 8px", borderRadius: "99px"
                      }}>{u.rol}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ===================== 3. FECHAS Y HORARIOS ===================== */}
        <div className="col-12 mt-2" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#065f46", fontWeight: "700", textTransform: "uppercase" }}>
            📅 3. Fechas y Horarios del Préstamo
          </p>
        </div>

        <div className="col-12">
          <div style={{
            padding: "8px 12px", borderRadius: "8px", fontSize: "11.5px",
            background: "#f0f7ff", border: "1px solid #bae6fd", color: "#0369a1"
          }}>
            ℹ️ Puedes solicitar con mínimo <strong>5 días hábiles</strong> de anticipación y tienes hasta <strong>15 días hábiles</strong> para devolver los equipos (sin contar fines de semana ni festivos).
          </div>
        </div>

        {/* Fecha de Recogida */}
        <div className="col-md-6">
          <label style={labelStyle}>Fecha de Recogida <span className="text-danger">*</span></label>
          <DatePicker
            selected={parseDateStr(fecha_inicio)}
            onChange={(date) => handleFechaRecogidaChange(formatDateStr(date))}
            minDate={parseDateStr(minRecogidaStr)}
            filterDate={(date) => esDiaHabil(date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className={`form-control form-control-sm ${errors.fecha_inicio ? 'is-invalid' : ''}`}
            placeholderText="dd/mm/aaaa"
          />
          {errors.fecha_inicio ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.fecha_inicio}</div>
          ) : (
            <small style={{ color: "#64748b", fontSize: "10px" }}>Mínimo 5 días hábiles de anticipación</small>
          )}
        </div>

        {/* Fecha de Devolución */}
        <div className="col-md-6">
          <label style={labelStyle}>Fecha de Devolución <span className="text-danger">*</span></label>
          <DatePicker
            selected={parseDateStr(fecha_fin)}
            onChange={(date) => handleFechaDevolucionChange(formatDateStr(date))}
            minDate={parseDateStr(minDevolucionStr)}
            maxDate={parseDateStr(maxDevolucionStr)}
            filterDate={(date) => esDiaHabil(date)}
            locale="es"
            dateFormat="dd/MM/yyyy"
            className={`form-control form-control-sm ${errors.fecha_fin ? 'is-invalid' : ''}`}
            placeholderText="dd/mm/aaaa"
            disabled={!fecha_inicio}
          />
          {errors.fecha_fin ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.fecha_fin}</div>
          ) : (
            <small style={{ color: "#64748b", fontSize: "10px" }}>Máximo 15 días hábiles después de la recogida</small>
          )}
        </div>

        {/* Hora de Recogida */}
        <div className="col-md-6">
          <label style={labelStyle}>Hora de Recogida <span className="text-danger">*</span></label>
          <input
            type="time"
            style={{ ...fieldStyle, borderColor: errors.hora_inicio ? "#dc3545" : "#dbeafe" }}
            value={hora_inicio}
            onChange={e => { setHora_inicio(e.target.value); setErrors({...errors, hora_inicio: null}); }}
            min="07:00" max="15:30" required
          />
          {errors.hora_inicio ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.hora_inicio}</div>
          ) : (
            <small style={{ color: "#0077B6", fontSize: "10px", fontWeight: "600" }}>
              Horario Laboratorio: 7:00 AM - 3:30 PM
            </small>
          )}
        </div>

        {/* Hora de Devolución */}
        <div className="col-md-6">
          <label style={labelStyle}>Hora de Devolución <span className="text-danger">*</span></label>
          <input
            type="time"
            style={{ ...fieldStyle, borderColor: errors.hora_fin ? "#dc3545" : "#dbeafe" }}
            value={hora_fin}
            onChange={e => { setHora_fin(e.target.value); setErrors({...errors, hora_fin: null}); }}
            min="07:00" max="15:30" required
          />
          {errors.hora_fin ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.hora_fin}</div>
          ) : (
            <small style={{ color: "#0077B6", fontSize: "10px", fontWeight: "600" }}>
              Horario Laboratorio: 7:00 AM - 3:30 PM
            </small>
          )}
        </div>

        {/* Botones de acción unificados */}
        <div className="col-12 mt-3 d-flex gap-2" style={{ paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
          <button
            type="button"
            onClick={hideModal}
            style={{
              flex: 1, padding: "9px 14px", borderRadius: "8px",
              border: "1.5px solid #e2e8f0", background: "#f8fafc",
              color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "13px"
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2, padding: "9px 14px", borderRadius: "8px", border: "none",
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              color: "#fff", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
              fontSize: "13px", opacity: loading ? 0.75 : 1,
              boxShadow: "0 4px 12px rgba(0, 119, 182, 0.25)"
            }}
          >
            {loading ? "Guardando..." : selectedSolicitud ? "✅ Actualizar Solicitud" : "✅ Registrar Solicitud"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SolicitudPrestamoForm;
