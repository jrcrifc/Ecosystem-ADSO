import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SolicitudPrestamoForm = ({ selectedSolicitud, refreshData, hideModal }) => {
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [fecha_fin, setFecha_fin]       = useState("");
  const [estado, setEstado]             = useState(1);
  const [equipos, setEquipos]           = useState([]);        // todos los equipos
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]); // ids seleccionados
  const [busquedaEquipo, setBusquedaEquipo] = useState("");

  const getToken = () => localStorage.getItem("token");
  const headers  = { Authorization: `Bearer ${getToken()}` };

  // Cargar equipos disponibles
  useEffect(() => {
    apiAxios
      .get("/api/estadoxequipo/ultimos/estados", { headers })
      .then(res => setEquipos(res.data))
      .catch(() => Swal.fire("Error", "No se pudieron cargar los equipos", "error"));
  }, []);

  // Prellenar si es edición
  useEffect(() => {
    if (selectedSolicitud) {
      setFecha_inicio(selectedSolicitud.fecha_inicio
        ? new Date(selectedSolicitud.fecha_inicio).toISOString().slice(0, 16) : "");
      setFecha_fin(selectedSolicitud.fecha_fin
        ? new Date(selectedSolicitud.fecha_fin).toISOString().slice(0, 16) : "");
      setEstado(selectedSolicitud.estado ?? 1);

      // Precargar equipos ya asignados
      const idsActuales = (selectedSolicitud.equipos || []).map(e => e.id_equipo);
      setEquiposSeleccionados(idsActuales);
    } else {
      setFecha_inicio(new Date().toISOString().slice(0, 16));
      setFecha_fin("");
      setEstado(1);
      setEquiposSeleccionados([]);
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
    disponible:      "#28a745",
    mantenimiento:   "#f59e0b",
    "no disponible": "#dc3545",
  }[estado] || "#6c757d");

  const equiposFiltrados = equipos.filter(e =>
    [e.nom_equipo, e.marca_equipo, e.no_placa]
      .some(f => f?.toLowerCase().includes(busquedaEquipo.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha_inicio) {
      Swal.fire("⚠️ Atención", "La fecha de inicio es obligatoria", "warning");
      return;
    }
    if (fecha_fin && new Date(fecha_fin) <= new Date(fecha_inicio)) {
      Swal.fire("⚠️ Atención", "La fecha de fin debe ser posterior a la de inicio", "warning");
      return;
    }
    if (!selectedSolicitud && equiposSeleccionados.length === 0) {
      Swal.fire("⚠️ Atención", "Selecciona al menos un equipo", "warning");
      return;
    }

    const data = {
      fecha_inicio: new Date(fecha_inicio).toISOString(),
      fecha_fin:    fecha_fin ? new Date(fecha_fin).toISOString() : null,
      estado,
      equipos_ids:  equiposSeleccionados,   // ← array de ids
    };

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

        {/* Fechas */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha y hora de inicio</label>
          <input type="datetime-local" className="form-control form-control-sm"
            value={fecha_inicio} onChange={e => setFecha_inicio(e.target.value)} required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha y hora de fin</label>
          <input type="datetime-local" className="form-control form-control-sm"
            value={fecha_fin} onChange={e => setFecha_fin(e.target.value)} />
        </div>

        {/* Selector de equipos */}
        <div className="col-12">
          <label className="form-label fw-semibold text-muted">
            Equipos a solicitar
            {equiposSeleccionados.length > 0 && (
              <span className="badge bg-primary ms-2">{equiposSeleccionados.length} seleccionado(s)</span>
            )}
          </label>

          {/* Buscador */}
          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder="Buscar equipo por nombre, marca o placa..."
            value={busquedaEquipo}
            onChange={e => setBusquedaEquipo(e.target.value)}
          />

          {/* Lista de equipos */}
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
                      border: `2px solid ${seleccionado ? "#0d6efd" : "#e9ecef"}`,
                      backgroundColor: seleccionado ? "#e7f1ff" : disponible ? "#fff" : "#f8f9fa",
                      opacity: disponible ? 1 : 0.6,
                      transition: "all 0.15s",
                    }}
                  >
                    {/* Checkbox visual */}
                    <div style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${seleccionado ? "#0d6efd" : "#adb5bd"}`,
                      backgroundColor: seleccionado ? "#0d6efd" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {seleccionado && <i className="fas fa-check" style={{ color: "#fff", fontSize: 11 }}></i>}
                    </div>

                    {/* Info equipo */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="fw-semibold" style={{ fontSize: "0.85rem" }}>
                        {equipo.nom_equipo}
                      </div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {equipo.marca_equipo || "Sin marca"} · {equipo.no_placa || "Sin placa"}
                      </div>
                    </div>

                    {/* Badge estado */}
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
          <button type="submit" className="btn btn-primary w-100">
            {selectedSolicitud ? "Actualizar Solicitud" : "Registrar Solicitud"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default SolicitudPrestamoForm;