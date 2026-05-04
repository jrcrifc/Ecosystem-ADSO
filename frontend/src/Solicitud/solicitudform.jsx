import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SolicitudPrestamoForm = ({ selectedSolicitud, refreshData, hideModal }) => {
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [hora_inicio, setHora_inicio]   = useState("07:00");
  const [fecha_fin, setFecha_fin]       = useState("");
  const [hora_fin, setHora_fin]         = useState("11:00");

  // ✅ Horarios permitidos: 7-11am y 2-4pm
  const horariosPermitidos = [
    "07:00", "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00"
  ];
  const formatHora = (h) => {
    const [hh] = h.split(":");
    const num = parseInt(hh);
    return num < 12 ? `${num}:00 AM` : num === 12 ? `12:00 PM` : `${num-12}:00 PM`;
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

  // Detectar rol del usuario
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  const esAdmin = userRol === "administrador" || userRol === "admin";
  const esAprendiz = userRol === "aprendiz";
  const esInstructor = userRol === "instructor";

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
        ? new Date(selectedSolicitud.fecha_fin).toTimeString().slice(0, 5) : "11:00");
      setEstado(selectedSolicitud.estado ?? 1);
      const idsActuales = (selectedSolicitud.equipos || []).map(e => e.id_equipo);
      setEquiposSeleccionados(idsActuales);
      setIdUsuarioSolicitante("");
    } else {
      // Valor por defecto: hoy + 1 día para evitar problemas de "atraso"
      const defaultDate = new Date(); 
      defaultDate.setDate(defaultDate.getDate() + 1);
      const dateStr = defaultDate.toISOString().slice(0, 10);
      
      setFecha_inicio(dateStr);
      setFecha_fin(esAprendiz ? dateStr : ""); // Aprendiz: mismo día por defecto
      setHora_inicio("07:00");
      setHora_fin("11:00");
      setEstado(1);
      setEquiposSeleccionados([]);
      setIdUsuarioSolicitante("");
    }
  }, [selectedSolicitud, esAprendiz]);

  // Si es aprendiz y cambia la fecha de inicio, la de fin debe ser la misma
  useEffect(() => {
    if (esAprendiz && fecha_inicio) {
      setFecha_fin(fecha_inicio);
    }
  }, [fecha_inicio, esAprendiz]);

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

  // Helper para calcular días hábiles (Lunes a Viernes)
  const calcularDiasHabiles = (inicio, fin) => {
    let count = 0;
    let current = new Date(inicio);
    const end = new Date(fin);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++; // 0: Domingo, 6: Sábado
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha_inicio) {
      Swal.fire("⚠️ Atención", "La fecha de inicio es obligatoria", "warning");
      return;
    }

    const startDateTime = new Date(`${fecha_inicio}T${hora_inicio}`);
    const endDateTime = fecha_fin ? new Date(`${fecha_fin}T${hora_fin}`) : null;

    if (endDateTime && endDateTime <= startDateTime) {
      Swal.fire("⚠️ Atención", "La fecha/hora de fin debe ser posterior a la de inicio", "warning");
      return;
    }

    // ✅ Validación Aprendiz: Mismo día
    if (esAprendiz && fecha_fin && fecha_inicio !== fecha_fin) {
      Swal.fire("⚠️ Política", "Como aprendiz, debes entregar el equipo el mismo día.", "warning");
      return;
    }

    // ✅ Validación Instructor: 3 a 5 días hábiles
    if (esInstructor && fecha_fin) {
      const dias = calcularDiasHabiles(fecha_inicio, fecha_fin);
      if (dias < 3 || dias > 5) {
        Swal.fire("⚠️ Política", "Como instructor, las solicitudes deben ser de 3 a 5 días hábiles.", "warning");
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

    const data = {
      fecha_inicio: startDateTime.toISOString(),
      fecha_fin:    endDateTime ? endDateTime.toISOString() : null,
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

  const selectedUser = usuarios.find(u => u.id_usuario === parseInt(idUsuarioSolicitante));

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row g-3">

        {/* ✅ Información de Políticas */}
        <div className="col-12">
          <div style={{
            background: "#f0f9ff", border: "1px solid #bae6fd",
            padding: "10px", borderRadius: "8px", marginBottom: "5px"
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#0369a1", fontWeight: "600" }}>
              📌 <span className="text-uppercase">Políticas de Solicitud:</span>
            </p>
            <ul style={{ margin: "5px 0 0", paddingLeft: "20px", fontSize: "11px", color: "#0c4a6e" }}>
              <li><b>Aprendices:</b> Entrega el mismo día de la asignación.</li>
              <li><b>Instructores:</b> Plazo de atención de 3 a 5 días hábiles.</li>
              <li><b>Múltiples Equipos:</b> Puedes seleccionar varios equipos en esta misma solicitud.</li>
            </ul>
          </div>
        </div>

        {/* ✅ ADMIN: Selector de solicitante */}
        {esAdmin && !selectedSolicitud && (
          <div className="col-12">
            <label className="form-label fw-semibold" style={{ color: "#1B3A2D" }}>
              👤 Solicitante <span style={{ color: "#dc3545" }}>*</span>
            </label>
            <p style={{ fontSize: "12px", color: "#5f7d6a", margin: "0 0 8px" }}>
              Como administrador, selecciona el usuario que está realizando la solicitud.
            </p>

            <input
              type="text"
              className="form-control form-control-sm mb-2"
              placeholder="Buscar por nombre, documento o email..."
              value={busquedaUsuario}
              onChange={e => setBusquedaUsuario(e.target.value)}
              style={{ borderColor: "#c8e6c9" }}
            />

            {selectedUser && (
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "10px 14px", borderRadius: "10px", marginBottom: "8px",
                background: "#e8f5e9", border: "2px solid #4CAF50"
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "linear-gradient(135deg, #4CAF50, #2D8A4E)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: "800", fontSize: "14px", flexShrink: 0
                }}>
                  {selectedUser.nombres_apellidos?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", fontSize: "13px", color: "#1B3A2D" }}>
                    {selectedUser.nombres_apellidos}
                  </div>
                  <div style={{ fontSize: "11px", color: "#5f7d6a" }}>
                    {selectedUser.email} · {selectedUser.rol}
                  </div>
                </div>
                <button type="button" onClick={() => setIdUsuarioSolicitante("")} style={{
                  background: "none", border: "none", color: "#dc3545",
                  cursor: "pointer", fontSize: "16px", fontWeight: "700"
                }}>✕</button>
              </div>
            )}

            {!selectedUser && (
              <div style={{
                maxHeight: "150px", overflowY: "auto",
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
                    onMouseEnter={e => { e.currentTarget.style.background = "#f0f9f2"; e.currentTarget.style.borderColor = "#c8e6c9"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
                  >
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#e8f5e9", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "12px", fontWeight: "700",
                      color: "#2D8A4E", flexShrink: 0
                    }}>
                      {u.nombres_apellidos?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: "600", fontSize: "12.5px", color: "#1B3A2D" }}>{u.nombres_apellidos}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{u.email} · {u.documento}</div>
                    </div>
                    <span style={{
                      fontSize: "10px", fontWeight: "600", color: "#2D8A4E",
                      background: "#e8f5e9", padding: "2px 8px", borderRadius: "99px"
                    }}>{u.rol}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fechas */}
        {(() => {
          const hoy = new Date();
          const minDate = new Date(hoy);
          minDate.setDate(minDate.getDate() + 1); // Permitir desde mañana
          const maxDate = new Date(hoy);
          maxDate.setMonth(maxDate.getMonth() + 2);
          const minStr = minDate.toISOString().slice(0, 10);
          const maxStr = maxDate.toISOString().slice(0, 10);

          return (
            <>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ color: "#023E8A", fontSize: "13px" }}>📅 Fecha Inicio</label>
                <div className="d-flex gap-2">
                  <input type="date" className="form-control form-control-sm"
                    value={fecha_inicio} onChange={e => setFecha_inicio(e.target.value)}
                    min={minStr} max={maxStr} required style={{ flex: 2 }} />
                  <select className="form-select form-select-sm" value={hora_inicio}
                    onChange={e => setHora_inicio(e.target.value)} required style={{ flex: 1 }}>
                    {horariosPermitidos.map(h => (
                      <option key={h} value={h}>{formatHora(h)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ color: "#023E8A", fontSize: "13px" }}>📅 Fecha Fin</label>
                <div className="d-flex gap-2">
                  <input type="date" className="form-control form-control-sm"
                    value={fecha_fin} onChange={e => setFecha_fin(e.target.value)}
                    min={fecha_inicio || minStr} max={maxStr} 
                    disabled={esAprendiz} // Aprendiz: bloqueado al mismo día
                    style={{ flex: 2, backgroundColor: esAprendiz ? "#f8f9fa" : "#fff" }} />
                  <select className="form-select form-select-sm" value={hora_fin}
                    onChange={e => setHora_fin(e.target.value)} style={{ flex: 1 }}>
                    {horariosPermitidos.map(h => (
                      <option key={h} value={h}>{formatHora(h)}</option>
                    ))}
                  </select>
                </div>
                {esAprendiz && <small style={{ color: "#d97706", fontSize: "10px" }}>* Mismo día obligatorio</small>}
              </div>

              <div className="col-12">
                <small style={{ color: "#0077B6", fontSize: "11px", fontWeight: "600" }}>
                  ⏰ Horarios permitidos: 7:00 AM - 11:00 AM y 2:00 PM - 4:00 PM
                </small>
              </div>
            </>
          );
        })()}

        {/* Selector de equipos */}
        <div className="col-12">
          <label className="form-label fw-semibold text-muted">
            Equipos a solicitar (puedes elegir varios)
            {equiposSeleccionados.length > 0 && (
              <span className="badge ms-2" style={{ background: "#2D8A4E", color: "#fff" }}>{equiposSeleccionados.length} seleccionado(s)</span>
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
            maxHeight: "220px", overflowY: "auto",
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
                      border: `2px solid ${seleccionado ? "#2D8A4E" : "#e9ecef"}`,
                      backgroundColor: seleccionado ? "#e8f5e9" : disponible ? "#fff" : "#f8f9fa",
                      opacity: disponible ? 1 : 0.6,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${seleccionado ? "#2D8A4E" : "#adb5bd"}`,
                      backgroundColor: seleccionado ? "#2D8A4E" : "transparent",
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
            background: "linear-gradient(135deg, #2D8A4E, #4CAF50)",
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