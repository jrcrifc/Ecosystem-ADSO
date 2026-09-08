// Archivo: solicitudform.jsx — Formulario de creación/edición de solicitudes de préstamo con validación por rol

// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa hooks de React para estado y efectos
import { useState, useEffect } from "react";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa Socket.io para actualizaciones en tiempo real
import socket from "../socket.js";

// ===================== UTILIDADES DE VALIDACIÓN DE FECHAS =====================

// Verifica que una fecha sea real (no 31 de febrero, 31 de noviembre, etc.)
const esFechaReal = (dateStr) => {
  if (!dateStr) return false;
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  if (!yyyy || !mm || !dd) return false;
  const fecha = new Date(yyyy, mm - 1, dd);
  return fecha.getFullYear() === yyyy && fecha.getMonth() === mm - 1 && fecha.getDate() === dd;
};

// Verifica si una fecha cae en sábado (6) o domingo (0)
const esFinDeSemana = (dateStr) => {
  if (!dateStr) return false;
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  const dia = new Date(yyyy, mm - 1, dd).getDay();
  return dia === 0 || dia === 6;
};

// Suma N días calendario a una fecha y retorna string YYYY-MM-DD
const sumarDias = (dateStr, dias) => {
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  const fecha = new Date(yyyy, mm - 1, dd);
  fecha.setDate(fecha.getDate() + dias);
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Calcula la diferencia en días calendario entre dos fechas
const diffDias = (fechaA, fechaB) => {
  const [yA, mA, dA] = fechaA.split("-").map(Number);
  const [yB, mB, dB] = fechaB.split("-").map(Number);
  const a = new Date(yA, mA - 1, dA);
  const b = new Date(yB, mB - 1, dB);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
};

// Obtiene la fecha de hoy en formato YYYY-MM-DD (local)
const hoyStr = () => {
  const hoy = new Date();
  const y = hoy.getFullYear();
  const m = String(hoy.getMonth() + 1).padStart(2, '0');
  const d = String(hoy.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Función que valida que la hora esté entre 7 AM y 4 PM
const isTimeValid = (time) => {
  if (!time) return false;
  const [hh, mm] = time.split(":").map(Number);
  const totalMinutes = hh * 60 + mm;
  return totalMinutes >= 7 * 60 && totalMinutes <= 16 * 60;
};

// Componente del formulario de solicitud de préstamo
const SolicitudPrestamoForm = ({ selectedSolicitud, refreshData, hideModal }) => {
  // Estado para la fecha de recogida del préstamo
  const [fecha_inicio, setFecha_inicio] = useState("");
  // Estado para la hora de recogida del préstamo
  const [hora_inicio, setHora_inicio]   = useState("07:00");
  // Estado para la fecha de devolución del préstamo
  const [fecha_fin, setFecha_fin]       = useState("");
  // Estado para la hora de devolución del préstamo
  const [hora_fin, setHora_fin]         = useState("16:00");
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
  // Verifica si el usuario es gestor
  const esGestor = userRol === "gestor";
  // Verifica si el usuario es pasante
  const esPasante = userRol === "pasante";
  // Determina si el usuario puede seleccionar un solicitante distinto
  const puedeSeleccionarSolicitante = esAdmin || esGestor || esPasante;
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
    // Si puede seleccionar solicitante, carga la lista de usuarios aprobados
    if (puedeSeleccionarSolicitante) {
      apiAxios
        .get("/api/auth/usuarios", { headers })
        .then(res => {
          const aprobados = res.data.filter(u => u.estado === 'aprobado' && u.rol !== 'Administrador');
          setUsuarios(aprobados);
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
      // Función que extrae fecha y hora local de un string ISO
      const getLocalPart = (isoString) => {
        if (!isoString) return { date: "", time: "07:00" };
        const d = new Date(isoString);
        if (isNaN(d)) return { date: "", time: "07:00" };
        let date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        let time = d.toTimeString().slice(0, 5);
        // Corrección: si el backend envió medianoche UTC, forzamos la fecha original y 7:00 AM
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
      // Si es nueva solicitud, establece valores por defecto
      // Fecha de recogida: 5 días después de hoy (primer día válido del rango permitido)
      setFecha_inicio(sumarDias(hoyStr(), 5));
      setHora_inicio("07:00");
      setHora_fin("16:00");
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

  // Función que devuelve el color del badge según el estado del equipo
  const getBadgeColor = (estado) => ({
    disponible:      "#2D8A4E",
    mantenimiento:   "#d97706",
    solicitado:      "#6366f1",
    prestado:        "#8b5cf6",
    inactivo:        "#dc3545",
  }[estado] || "#6c757d");

  // Filtra los equipos por texto de búsqueda y oculta los en mantenimiento si es nueva solicitud
  const equiposFiltrados = equipos.filter(e => {
    const search = busquedaEquipo.toLowerCase().trim();
    const matchesSearch = [e.nom_equipo, e.marca_equipo, e.no_placa]
      .some(f => String(f || "").toLowerCase().includes(search));
    // En nueva solicitud oculta equipos en mantenimiento
    if (!selectedSolicitud) {
        return matchesSearch && e.ultimoEstado !== 'mantenimiento';
    }
    return matchesSearch;
  });

  // Filtra los usuarios por nombre, documento o email
  const usuariosFiltrados = usuarios.filter(u =>
    (u.nombres_apellidos || "").toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
    (u.documento || "").includes(busquedaUsuario) ||
    (u.email || "").toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  // ===================== VALIDACIÓN CROSS-BROWSER DE FECHAS =====================

  // Valida la fecha de recogida y retorna error o null
  const validarFechaRecogida = (valor) => {
    if (!valor) return "La fecha de recogida es requerida";
    if (!esFechaReal(valor)) return "Fecha inválida (no existe en el calendario)";
    if (esFinDeSemana(valor)) return "No se pueden seleccionar sábados ni domingos";
    const diasDesdeHoy = diffDias(hoyStr(), valor);
    if (diasDesdeHoy < 5) return "Debe ser con mínimo 5 días de anticipación";
    if (diasDesdeHoy > 8) return "Debe ser con máximo 8 días de anticipación";
    return null;
  };

  // Valida la fecha de devolución y retorna error o null
  const validarFechaDevolucion = (valor) => {
    if (!valor) return "La fecha de devolución es requerida";
    if (!esFechaReal(valor)) return "Fecha inválida (no existe en el calendario)";
    if (esFinDeSemana(valor)) return "No se pueden seleccionar sábados ni domingos";
    if (!fecha_inicio) return "Primero selecciona la fecha de recogida";
    const diasDesdeInicio = diffDias(fecha_inicio, valor);
    if (diasDesdeInicio < 1) return "Debe ser posterior a la fecha de recogida";
    if (diasDesdeInicio > 15) return "Máximo 15 días después de la recogida";
    return null;
  };

  // Handler para cambio de fecha de recogida con validación JS
  const handleFechaRecogidaChange = (valor) => {
    setFecha_inicio(valor);
    const error = validarFechaRecogida(valor);
    setErrors(prev => ({ ...prev, fecha_inicio: error }));
    // Si la fecha de devolución ya está puesta, revalidarla
    if (fecha_fin) {
      // Necesitamos revalidar con el nuevo valor de fecha_inicio
      const validarFinConNuevoInicio = () => {
        if (!fecha_fin) return "La fecha de devolución es requerida";
        if (!esFechaReal(fecha_fin)) return "Fecha inválida (no existe en el calendario)";
        if (esFinDeSemana(fecha_fin)) return "No se pueden seleccionar sábados ni domingos";
        if (!valor) return "Primero selecciona la fecha de recogida";
        const diasDesdeInicio = diffDias(valor, fecha_fin);
        if (diasDesdeInicio < 1) return "Debe ser posterior a la fecha de recogida";
        if (diasDesdeInicio > 15) return "Máximo 15 días después de la recogida";
        return null;
      };
      setErrors(prev => ({ ...prev, fecha_inicio: error, fecha_fin: validarFinConNuevoInicio() }));
    }
  };

  // Handler para cambio de fecha de devolución con validación JS
  const handleFechaDevolucionChange = (valor) => {
    setFecha_fin(valor);
    const error = validarFechaDevolucion(valor);
    setErrors(prev => ({ ...prev, fecha_fin: error }));
  };

  // Función que valida y envía el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validación completa de fecha de recogida (cross-browser)
    const errorRecogida = validarFechaRecogida(fecha_inicio);
    if (errorRecogida) nuevosErrores.fecha_inicio = errorRecogida;

    // Validación de hora de recogida
    if (!isTimeValid(hora_inicio)) nuevosErrores.hora_inicio = "Debe estar entre 7:00 AM y 4:00 PM";

    // Validación completa de fecha de devolución (cross-browser)
    const errorDevolucion = validarFechaDevolucion(fecha_fin);
    if (errorDevolucion) nuevosErrores.fecha_fin = errorDevolucion;

    // Validación de hora de devolución
    if (!isTimeValid(hora_fin)) nuevosErrores.hora_fin = "Debe estar entre 7:00 AM y 4:00 PM";

    // Validación cruzada: fecha_fin + hora_fin debe ser posterior a fecha_inicio + hora_inicio
    if (fecha_inicio && fecha_fin && hora_inicio && hora_fin) {
      if (new Date(`${fecha_fin}T${hora_fin}`) <= new Date(`${fecha_inicio}T${hora_inicio}`)) {
        nuevosErrores.hora_fin = "La devolución debe ser posterior a la recogida";
      }
    }

    // Valida que se haya seleccionado al menos un equipo al crear
    if (!selectedSolicitud && equiposSeleccionados.length === 0) {
      nuevosErrores.equipos = "Selecciona al menos un equipo";
    }
    // Valida que se seleccione un solicitante al crear si tiene permisos
    if (puedeSeleccionarSolicitante && !selectedSolicitud && !idUsuarioSolicitante) {
      nuevosErrores.solicitante = "Debes seleccionar un solicitante";
    }
    // Si hay errores, los muestra y detiene el envío
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
    // Si eligió un solicitante distinto, lo incluye en los datos
    if (puedeSeleccionarSolicitante && idUsuarioSolicitante) {
      data.id_usuario_solicitante = parseInt(idUsuarioSolicitante);
    }
    try {
      setLoading(true);
      if (selectedSolicitud) {
        // Actualiza la solicitud existente vía PUT
        await apiAxios.put(
          `/api/solicitud/${selectedSolicitud.id_solicitud}`,
          data,
          { headers }
        );
        hideModal();
        refreshData();
        Swal.fire({ icon: "success", title: "✅ Actualizado", text: "Solicitud modificada correctamente", timer: 1500, showConfirmButton: false });
      } else {
        // Crea una nueva solicitud vía POST
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

  // Calcula los rangos de fecha para hint visual en los inputs (aunque la validación real es en JS)
  const minRecogidaStr = sumarDias(hoyStr(), 5);
  const maxRecogidaStr = sumarDias(hoyStr(), 8);
  const minDevolucionStr = fecha_inicio ? sumarDias(fecha_inicio, 1) : "";
  const maxDevolucionStr = fecha_inicio ? sumarDias(fecha_inicio, 15) : "";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">

        {/* ===================== 1. SELECTOR DE EQUIPOS (ARRIBA) ===================== */}
        <div className="col-12">
          <label className="form-label fw-bold mb-1" style={{ color: "#0A1628" }}>
            🔬 Equipos a solicitar
            {/* Badge con la cantidad de equipos seleccionados */}
            {equiposSeleccionados.length > 0 && (
              <span className="badge ms-2" style={{ background: "#0077B6", color: "#fff" }}>{equiposSeleccionados.length} seleccionado(s)</span>
            )}
          </label>
          {errors.equipos && <div className="text-danger mb-2" style={{ fontSize: "12px", fontWeight: "600" }}>{errors.equipos}</div>}
          {/* Campo de búsqueda de equipos */}
          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder="Buscar equipo por nombre, marca o placa..."
            value={busquedaEquipo}
            onChange={e => setBusquedaEquipo(e.target.value)}
          />
          {/* Lista de equipos disponibles */}
          <div style={{
            maxHeight: "260px", overflowY: "auto",
            border: "1px solid #dee2e6", borderRadius: "8px", padding: "8px"
          }}>
            {equiposFiltrados.length === 0 ? (
              <p className="text-muted text-center small mt-2">No se encontraron equipos</p>
            ) : (
              equiposFiltrados.map(equipo => {
                // Determina si el equipo está físicamente disponible
                const estaDisponibleFisicamente = equipo.ultimoEstado === "disponible";
                // Verifica si el equipo está activo
                const estaActivo = equipo.estado !== 0;
                // Determina si se puede seleccionar: disponible y activo
                const puedeSeleccionarse = estaDisponibleFisicamente && estaActivo;
                // Verifica si el equipo ya está seleccionado
                const seleccionado = equiposSeleccionados.includes(equipo.id_equipo);
                return (
                  // Tarjeta de cada equipo en la lista
                  <div
                    key={equipo.id_equipo}
                    onClick={() => puedeSeleccionarse && toggleEquipo(equipo.id_equipo)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 12px", marginBottom: "4px",
                      borderRadius: "8px", 
                      cursor: puedeSeleccionarse ? "pointer" : "not-allowed",
                      border: `2px solid ${seleccionado ? "#0077B6" : "#e9ecef"}`,
                      backgroundColor: seleccionado ? "#dbeafe" : !estaActivo ? "#f8d7da" : puedeSeleccionarse ? "#fff" : "#f1f5f9",
                      opacity: puedeSeleccionarse || seleccionado ? 1 : 0.6,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${seleccionado ? "#0077B6" : "#adb5bd"}`,
                      backgroundColor: seleccionado ? "#0077B6" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {seleccionado && <i className="fas fa-check" style={{ color: "#fff", fontSize: 11 }}></i>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>
                        {equipo.nom_equipo}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {equipo.marca_equipo || "Sin marca"} · {equipo.no_placa || "Sin placa"}
                      </div>
                      {/* Mensaje de equipo inactivo */}
                      {!estaActivo && (
                        <div style={{ color: "#dc3545", fontSize: "0.7rem", fontWeight: "700", marginTop: "2px" }}>
                          🚫 Equipo inactivo — No disponible para solicitudes
                        </div>
                      )}
                      {/* Mensaje de equipo ocupado con fecha de disponibilidad — NO TOCAR */}
                      {estaActivo && equipo.fecha_disponible && (
                        <div style={{ color: "#d97706", fontSize: "0.7rem", fontWeight: "700", marginTop: "2px" }}>
                          📅 Ocupado (Disponible el: {new Date(equipo.fecha_disponible + "T00:00:00").toLocaleDateString('es-CO')})
                        </div>
                      )}
                    </div>
                    {/* Badge de estado del equipo — muestra inactivo si estado === 0 */}
                    {!estaActivo ? (
                      <span style={{
                        padding: "2px 10px", borderRadius: 20, fontSize: "0.7rem",
                        fontWeight: 600, color: "#fff", flexShrink: 0,
                        backgroundColor: "#dc3545"
                      }}>
                        Inactivo
                      </span>
                    ) : (
                      <span style={{
                        padding: "2px 10px", borderRadius: 20, fontSize: "0.7rem",
                        fontWeight: 600, color: "#fff", flexShrink: 0,
                        backgroundColor: getBadgeColor(equipo.ultimoEstado)
                      }}>
                        {equipo.ultimoEstado || "Sin estado"}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ===================== 2. SELECTOR DE SOLICITANTE (MEDIO) ===================== */}
        {puedeSeleccionarSolicitante && !selectedSolicitud && (
          <div className="col-12">
            <label className="form-label fw-bold" style={{ color: "#0A1628" }}>
              👤 Solicitante <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px" }}>
              Selecciona el usuario que está realizando la solicitud de préstamo.
            </p>
            {/* Mensaje de usuario nuevo si no existe en la BD */}
            {busquedaUsuario.trim() !== "" && usuariosFiltrados.length === 0 && (
              <div style={{ color: "#dc3545", fontWeight: "bold", fontSize: "13px", marginBottom: "8px" }}>
                ⚠️ Es usuario nuevo
              </div>
            )}
            {/* Campo de búsqueda de usuarios */}
            <input
              type="text"
              className={`form-control form-control-sm mb-1 ${errors.solicitante ? 'is-invalid' : ''}`}
              placeholder="Buscar por nombre, documento o email..."
              value={busquedaUsuario}
              onChange={e => { setBusquedaUsuario(e.target.value); setErrors({...errors, solicitante: null}); }}
              style={{ borderColor: "#dbeafe" }}
            />
            {errors.solicitante && <div className="invalid-feedback mb-2" style={{ display: 'block' }}>{errors.solicitante}</div>}
            {/* Tarjeta del usuario seleccionado */}
            {selectedUser && (
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 14px", borderRadius: "10px", marginBottom: "8px",
                background: "#dbeafe", border: "2px solid #0077B6"
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #0077B6, #023E8A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: "800", fontSize: "14px", flexShrink: 0
                }}>
                  {selectedUser.nombres_apellidos?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "13px", color: "#023E8A" }}>
                    {selectedUser.nombres_apellidos}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {selectedUser.email} · <strong>{selectedUser.rol}</strong>
                  </div>
                </div>
                <button type="button" onClick={() => setIdUsuarioSolicitante("")} style={{
                  background: "none", border: "none", color: "#dc3545",
                  cursor: "pointer", fontSize: "16px", fontWeight: "700"
                }}>✕</button>
              </div>
            )}
            {/* Lista de usuarios disponibles para seleccionar */}
            {!selectedUser && (
              <div style={{
                maxHeight: "180px", overflowY: "auto",
                border: "1px solid #e0e0e0", borderRadius: "8px", padding: "6px"
              }}>
                {usuariosFiltrados.length === 0 ? (
                  <p style={{ color: "#dc3545", fontWeight: "bold", textAlign: "center", fontSize: "13px", margin: "10px 0" }}>
                    ⚠️ Es usuario nuevo
                  </p>
                ) : usuariosFiltrados.map(u => (
                  // Tarjeta de cada usuario en la lista de selección
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
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#dbeafe", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "12px", fontWeight: "700",
                      color: "#0077B6", flexShrink: 0
                    }}>
                      {u.nombres_apellidos?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "600", fontSize: "12.5px", color: "#0f172a" }}>{u.nombres_apellidos}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{u.email} · {u.documento}</div>
                    </div>
                    <span style={{
                      fontSize: "10px", fontWeight: "600", color: "#0077B6",
                      background: "#dbeafe", padding: "2px 8px", borderRadius: "99px"
                    }}>{u.rol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== 3. FECHAS Y HORARIOS (ABAJO) ===================== */}

        {/* Info del tipo de solicitud */}
        <div className="col-12">
          <div style={{
            padding: "10px 16px", borderRadius: "10px", fontSize: "12px",
            background: "#e3f2fd",
            border: "1px solid #90caf9",
            color: "#0d47a1"
          }}>
            📅 <strong>Importante:</strong> Puedes solicitar con <strong>5 a 8 días</strong> de anticipación y tienes hasta <strong>15 días</strong> para devolver los equipos. No se permiten sábados ni domingos.
          </div>
        </div>

        {/* Fecha de Recogida */}
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628", fontSize: "13px" }}>
            📅 Fecha de Recogida
          </label>
          <input type="date" className={`form-control form-control-sm ${errors.fecha_inicio ? 'is-invalid' : ''}`}
            value={fecha_inicio}
            onChange={e => handleFechaRecogidaChange(e.target.value)}
            min={minRecogidaStr} max={maxRecogidaStr} required />
          {errors.fecha_inicio ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.fecha_inicio}</div>
          ) : (
            <small style={{ color: "#94a3b8", fontSize: "10px" }}>Entre 5 y 8 días de anticipación (lunes a viernes)</small>
          )}
        </div>

        {/* Fecha de Devolución */}
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628", fontSize: "13px" }}>
            📅 Fecha de Devolución
          </label>
          <input type="date" className={`form-control form-control-sm ${errors.fecha_fin ? 'is-invalid' : ''}`}
            value={fecha_fin} onChange={e => handleFechaDevolucionChange(e.target.value)}
            min={minDevolucionStr} max={maxDevolucionStr} required />
          {errors.fecha_fin ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.fecha_fin}</div>
          ) : (
            <small style={{ color: "#94a3b8", fontSize: "10px" }}>Máximo 15 días después de la recogida (lunes a viernes)</small>
          )}
        </div>

        {/* Hora de Recogida */}
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628", fontSize: "13px" }}>
            ⏰ Hora de Recogida
          </label>
          <input type="time" className={`form-control form-control-sm ${errors.hora_inicio ? 'is-invalid' : ''}`}
            value={hora_inicio} onChange={e => { setHora_inicio(e.target.value); setErrors({...errors, hora_inicio: null}); }}
            min="07:00" max="16:00" required />
          {errors.hora_inicio ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.hora_inicio}</div>
          ) : (
            <small style={{ color: "#0077B6", fontSize: "10px", fontWeight: "600" }}>
              Laboratorio: 7:00 AM - 4:00 PM
            </small>
          )}
        </div>

        {/* Hora de Devolución */}
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628", fontSize: "13px" }}>
            ⏰ Hora de Devolución
          </label>
          <input type="time" className={`form-control form-control-sm ${errors.hora_fin ? 'is-invalid' : ''}`}
            value={hora_fin} onChange={e => { setHora_fin(e.target.value); setErrors({...errors, hora_fin: null}); }}
            min="07:00" max="16:00" required />
          {errors.hora_fin ? (
            <div className="invalid-feedback" style={{ fontSize: "11px", display: "block" }}>{errors.hora_fin}</div>
          ) : (
            <small style={{ color: "#0077B6", fontSize: "10px", fontWeight: "600" }}>
              Laboratorio: 7:00 AM - 4:00 PM
            </small>
          )}
        </div>

        {/* Botón de envío del formulario */}
        <div className="col-12 mt-2">
          <button type="submit" className="btn w-100" disabled={loading} style={{
            background: "linear-gradient(135deg, #0077B6, #023E8A)",
            color: "#fff", fontWeight: "700", border: "none",
            padding: "10px", borderRadius: "10px", fontSize: "14px",
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...</>
            ) : selectedSolicitud ? (
              "Actualizar Solicitud"
            ) : (
              "Registrar Solicitud"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SolicitudPrestamoForm;
