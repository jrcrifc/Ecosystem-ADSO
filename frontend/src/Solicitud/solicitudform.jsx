import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SolicitudPrestamoForm = ({ selectedSolicitud, refreshData, hideModal }) => {
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [hora_inicio, setHora_inicio]   = useState("07:00");
  const [fecha_fin, setFecha_fin]       = useState("");
  const [hora_fin, setHora_fin]         = useState("16:00");

  // ✅ Horarios: 7 AM - 4 PM (Flexible)
  const isTimeValid = (time) => {
    if (!time) return false;
    const [hh, mm] = time.split(":").map(Number);
    const totalMinutes = hh * 60 + mm;
    return totalMinutes >= 7 * 60 && totalMinutes <= 16 * 60;
  };

  const [estado, setEstado]             = useState(1);
  const [equipos, setEquipos]           = useState([]);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
  const [busquedaEquipo, setBusquedaEquipo] = useState("");

  // ✅ Admin: seleccionar solicitante
  const [usuarios, setUsuarios] = useState([]);
  const [idUsuarioSolicitante, setIdUsuarioSolicitante] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");

  const getToken = () => sessionStorage.getItem("token");
  const headers  = { Authorization: `Bearer ${getToken()}` };

  // Detectar si es admin
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  const esAdmin = userRol === "administrador" || userRol === "admin";

  // ✅ Determinar el ROL EFECTIVO del solicitante
  // Si es admin y seleccionó un usuario, usar el rol de ese usuario
  // Si no, usar el rol del usuario logueado
  const selectedUser = usuarios.find(u => u.id_usuario === parseInt(idUsuarioSolicitante));
  const rolEfectivo = esAdmin && selectedUser
    ? selectedUser.rol.toLowerCase()
    : userRol;

  // ✅ Reglas por rol:
  // Aprendiz → devuelve el MISMO DÍA
  // Instructor → puede devolver hasta 1 MES después
  const esAprendiz = rolEfectivo === "aprendiz";
  const esInstructor = rolEfectivo === "instructor";

  // Cargar equipos disponibles
  useEffect(() => {
    apiAxios
      .get("/api/estadoxequipo/ultimos/estados", { headers })
      .then(res => setEquipos(res.data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los equipos", "error"));

    // ✅ Si es admin, cargar lista de usuarios aprobados
    if (esAdmin) {
      apiAxios
        .get("/api/auth/usuarios", { headers })
        .then(res => {
          const aprobados = res.data.filter(u => u.estado === 'aprobado' && u.rol !== 'Administrador');
          setUsuarios(aprobados);
        })
        .catch(() => {});
    }
  }, []);

  // Prellenar si es edición
  useEffect(() => {
    if (selectedSolicitud) {
      setFecha_inicio(selectedSolicitud.fecha_inicio
        ? new Date(selectedSolicitud.fecha_inicio).toISOString().slice(0, 10) : "");
      setHora_inicio(selectedSolicitud.fecha_inicio
        ? new Date(selectedSolicitud.fecha_inicio).toTimeString().slice(0, 5) : "07:00");
      setFecha_fin(selectedSolicitud.fecha_fin
        ? new Date(selectedSolicitud.fecha_fin).toISOString().slice(0, 10) : "");
      setHora_fin(selectedSolicitud.fecha_fin
        ? new Date(selectedSolicitud.fecha_fin).toTimeString().slice(0, 5) : "16:00");
      setEstado(selectedSolicitud.estado ?? 1);
      const idsActuales = (selectedSolicitud.equipos || []).map(e => e.id_equipo);
      setEquiposSeleccionados(idsActuales);
      setIdUsuarioSolicitante("");
    } else {
      const defaultDate = new Date(); defaultDate.setDate(defaultDate.getDate() + 5);
      setFecha_inicio(defaultDate.toISOString().slice(0, 10));
      setHora_inicio("07:00");
      setHora_fin("16:00");
      setFecha_fin("");
      setEstado(1);
      setEquiposSeleccionados([]);
      setIdUsuarioSolicitante("");
    }
  }, [selectedSolicitud]);

  const toggleEquipo = (id_equipo) => {
    setEquiposSeleccionados(prev =>
      prev.includes(id_equipo)
        ? prev.filter(id => id !== id_equipo)
        : [...prev, id_equipo]
    );
  };

  const getBadgeColor = (estado) => ({
    disponible:      "#2D8A4E",
    mantenimiento:   "#D4A843",
    "no disponible": "#dc3545",
  }[estado] || "#6c757d");

  const equiposFiltrados = equipos.filter(e =>
    [e.nom_equipo, e.marca_equipo, e.no_placa]
      .some(f => f?.toLowerCase().includes(busquedaEquipo.toLowerCase()))
  );

  const usuariosFiltrados = usuarios.filter(u =>
    (u.nombres_apellidos || "").toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
    (u.documento || "").includes(busquedaUsuario) ||
    (u.email || "").toLowerCase().includes(busquedaUsuario.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha_inicio) {
      Swal.fire("⚠️ Atención", "La fecha de inicio es obligatoria", "warning");
      return;
    }
    if (!isTimeValid(hora_inicio)) {
      Swal.fire("⚠️ Atención", "La hora de inicio debe estar entre 7:00 AM y 4:00 PM", "warning");
      return;
    }

    // ✅ Validaciones según rol
    if (esAprendiz) {
      // Aprendiz: mismo día, validar hora fin
      if (!isTimeValid(hora_fin)) {
        Swal.fire("⚠️ Atención", "La hora de devolución debe estar entre 7:00 AM y 4:00 PM", "warning");
        return;
      }
      if (new Date(`${fecha_inicio}T${hora_fin}`) <= new Date(`${fecha_inicio}T${hora_inicio}`)) {
        Swal.fire("⚠️ Atención", "La hora de devolución debe ser posterior a la de inicio", "warning");
        return;
      }
    } else if (esInstructor) {
      // Instructor: necesita fecha fin (hasta 1 mes)
      if (!fecha_fin) {
        Swal.fire("⚠️ Atención", "Debe seleccionar la fecha de devolución", "warning");
        return;
      }
      if (!isTimeValid(hora_fin)) {
        Swal.fire("⚠️ Atención", "La hora de devolución debe estar entre 7:00 AM y 4:00 PM", "warning");
        return;
      }
      if (new Date(`${fecha_fin}T${hora_fin}`) <= new Date(`${fecha_inicio}T${hora_inicio}`)) {
        Swal.fire("⚠️ Atención", "La fecha/hora de devolución debe ser posterior a la de inicio", "warning");
        return;
      }
    }

    if (!selectedSolicitud && equiposSeleccionados.length === 0) {
      Swal.fire("⚠️ Atención", "Selecciona al menos un equipo", "warning");
      return;
    }

    // ✅ Admin debe seleccionar solicitante al crear
    if (esAdmin && !selectedSolicitud && !idUsuarioSolicitante) {
      Swal.fire("⚠️ Atención", "Como administrador, debes seleccionar un solicitante", "warning");
      return;
    }

    // ✅ Construir fecha_fin según rol
    let fechaFinISO;
    if (esAprendiz) {
      // Mismo día: fecha_inicio + hora_fin
      fechaFinISO = new Date(`${fecha_inicio}T${hora_fin}:00`).toISOString();
    } else if (esInstructor) {
      // Fecha diferente: fecha_fin + hora_fin
      fechaFinISO = new Date(`${fecha_fin}T${hora_fin}:00`).toISOString();
    } else {
      // Fallback (admin sin usuario seleccionado): mismo día
      fechaFinISO = new Date(`${fecha_inicio}T${hora_fin}:00`).toISOString();
    }

    const data = {
      fecha_inicio: new Date(`${fecha_inicio}T${hora_inicio}:00`).toISOString(),
      fecha_fin:    fechaFinISO,
      estado,
      equipos_ids:  equiposSeleccionados,
    };

    // ✅ Si es admin y eligió un solicitante, enviarlo
    if (esAdmin && idUsuarioSolicitante) {
      data.id_usuario_solicitante = parseInt(idUsuarioSolicitante);
    }

    try {
      if (selectedSolicitud) {
        await apiAxios.put(
          `/api/solicitud/${selectedSolicitud.id_solicitud}`,
          data,
          { headers }
        );
        Swal.fire("✅ Actualizado", "Solicitud modificada correctamente", "success");
      } else {
        await apiAxios.post("/api/solicitud", data, { headers });
        Swal.fire("✅ Registrada", "Solicitud creada correctamente", "success");
      }
      refreshData();
      hideModal();
    } catch (error) {
      Swal.fire("💀 Error", error.response?.data?.message || "No se pudo guardar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">

        {/* ✅ ADMIN: Selector de solicitante */}
        {esAdmin && !selectedSolicitud && (
          <div className="col-12">
            <label className="form-label fw-semibold" style={{ color: "#023E8A" }}>
              👤 Solicitante <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 8px" }}>
              Como administrador, selecciona el usuario que está realizando la solicitud.
            </p>

            {/* Búsqueda */}
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="Buscar por nombre, documento o email..."
              value={busquedaUsuario}
              onChange={e => setBusquedaUsuario(e.target.value)}
              style={{ borderColor: "#dbeafe" }}
            />

            {/* Usuario seleccionado */}
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

            {/* Lista de usuarios */}
            {!selectedUser && (
              <div style={{
                maxHeight: "180px", overflowY: "auto",
                border: "1px solid #e0e0e0", borderRadius: "8px", padding: "6px"
              }}>
                {usuariosFiltrados.length === 0 ? (
                  <p className="text-muted text-center small mt-2">No se encontraron usuarios</p>
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

        {/* ✅ Info del tipo de solicitud según rol */}
        {(esAprendiz || esInstructor) && (
          <div className="col-12">
            <div style={{
              padding: "10px 16px", borderRadius: "10px", fontSize: "12px",
              background: esAprendiz ? "#fff8e1" : "#e3f2fd",
              border: `1px solid ${esAprendiz ? "#ffe082" : "#90caf9"}`,
              color: esAprendiz ? "#7c5e00" : "#0d47a1"
            }}>
              {esAprendiz ? (
                <>🎓 <strong>Aprendiz:</strong> La solicitud es por un solo día. Debes devolver los equipos el mismo día antes de las 4:00 PM.</>
              ) : (
                <>👨‍🏫 <strong>Instructor:</strong> Puedes solicitar con 3 a 5 días de anticipación y tienes hasta <strong>1 mes</strong> para devolver los equipos.</>
              )}
            </div>
          </div>
        )}

        {/* ✅ FECHA Y HORARIO — Adaptado por rol */}
        {(() => {
          const hoy = new Date();
          const minDate = new Date(hoy);
          minDate.setDate(minDate.getDate() + 3); // mínimo 3 días hábiles
          const maxDate = new Date(hoy);
          maxDate.setMonth(maxDate.getMonth() + 2);
          const minStr = minDate.toISOString().slice(0, 10);
          const maxStr = maxDate.toISOString().slice(0, 10);

          // Para instructor: fecha fin máxima = fecha_inicio + 1 mes
          let maxFinStr = maxStr;
          if (fecha_inicio && esInstructor) {
            const maxFin = new Date(fecha_inicio);
            maxFin.setMonth(maxFin.getMonth() + 1);
            maxFinStr = maxFin.toISOString().slice(0, 10);
          }

          return (
            <>
              {/* Fecha de solicitud (siempre) */}
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ color: "#023E8A", fontSize: "13px" }}>
                  📅 {esAprendiz ? "Fecha de Solicitud (Mismo día)" : "Fecha de Inicio"}
                </label>
                <input type="date" className="form-control form-control-sm"
                  value={fecha_inicio} onChange={e => { setFecha_inicio(e.target.value); if (esAprendiz) setFecha_fin(e.target.value); }}
                  min={minStr} max={maxStr} required />
                <small style={{ color: "#94a3b8", fontSize: "10px" }}>Solicitar con mín. 3 días de anticipación</small>
              </div>

              {/* Instructor: Fecha de devolución */}
              {esInstructor && (
                <div className="col-md-6">
                  <label className="form-label fw-semibold" style={{ color: "#023E8A", fontSize: "13px" }}>
                    📅 Fecha de Devolución
                  </label>
                  <input type="date" className="form-control form-control-sm"
                    value={fecha_fin} onChange={e => setFecha_fin(e.target.value)}
                    min={fecha_inicio || minStr} max={maxFinStr} required />
                  <small style={{ color: "#94a3b8", fontSize: "10px" }}>Máx. 1 mes después del inicio</small>
                </div>
              )}

              {/* Horario (siempre) */}
              <div className={esInstructor ? "col-12" : "col-md-6"}>
                <label className="form-label fw-semibold" style={{ color: "#023E8A", fontSize: "13px" }}>
                  ⏰ {esAprendiz ? "Horario de Uso (Mismo día)" : "Horario"}
                </label>
                <div className="d-flex gap-2 align-items-center">
                  <div style={{ flex: 1 }}>
                    <small className="text-muted" style={{ fontSize: "10px" }}>Hora inicio</small>
                    <input type="time" className="form-control form-control-sm"
                      value={hora_inicio} onChange={e => setHora_inicio(e.target.value)}
                      min="07:00" max="16:00" required />
                  </div>
                  <span className="text-muted small" style={{ paddingTop: "16px" }}>a</span>
                  <div style={{ flex: 1 }}>
                    <small className="text-muted" style={{ fontSize: "10px" }}>Hora {esAprendiz ? "devolución" : "fin"}</small>
                    <input type="time" className="form-control form-control-sm"
                      value={hora_fin} onChange={e => setHora_fin(e.target.value)}
                      min="07:00" max="16:00" required />
                  </div>
                </div>
                <small style={{ color: "#0077B6", fontSize: "10px", fontWeight: "600" }}>
                  Laboratorio Ambiental: 7:00 AM - 4:00 PM
                </small>
              </div>
            </>
          );
        })()}

        {/* Selector de equipos */}
        <div className="col-12">
          <label className="form-label fw-semibold text-muted">
            Equipos a solicitar
            {equiposSeleccionados.length > 0 && (
              <span className="badge ms-2" style={{ background: "#0077B6", color: "#fff" }}>{equiposSeleccionados.length} seleccionado(s)</span>
            )}
          </label>

          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder="Buscar equipo por nombre, marca o placa..."
            value={busquedaEquipo}
            onChange={e => setBusquedaEquipo(e.target.value)}
          />

          <div style={{
            maxHeight: "260px", overflowY: "auto",
            border: "1px solid #dee2e6", borderRadius: "8px", padding: "8px"
          }}>
            {equiposFiltrados.length === 0 ? (
              <p className="text-muted text-center small mt-2">No se encontraron equipos</p>
            ) : (
              equiposFiltrados.map(equipo => {
                const disponible  = equipo.ultimoEstado === "disponible";
                const seleccionado = equiposSeleccionados.includes(equipo.id_equipo);

                return (
                  <div
                    key={equipo.id_equipo}
                    onClick={() => disponible && toggleEquipo(equipo.id_equipo)}
                    style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 12px", marginBottom: "4px",
                      borderRadius: "8px", cursor: disponible ? "pointer" : "not-allowed",
                      border: `2px solid ${seleccionado ? "#0077B6" : "#e9ecef"}`,
                      backgroundColor: seleccionado ? "#dbeafe" : disponible ? "#fff" : "#f8f9fa",
                      opacity: disponible ? 1 : 0.6,
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
                    </div>

                    <span style={{
                      padding: "2px 10px", borderRadius: 20, fontSize: "0.7rem",
                      fontWeight: 600, color: "#fff", flexShrink: 0,
                      backgroundColor: getBadgeColor(equipo.ultimoEstado)
                    }}>
                      {equipo.ultimoEstado || "Sin estado"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Botón */}
        <div className="col-12 mt-2">
          <button type="submit" className="btn w-100" style={{
            background: "linear-gradient(135deg, #0077B6, #023E8A)",
            color: "#fff", fontWeight: "700", border: "none",
            padding: "10px", borderRadius: "10px", fontSize: "14px"
          }}>
            {selectedSolicitud ? "Actualizar Solicitud" : "Registrar Solicitud"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default SolicitudPrestamoForm;