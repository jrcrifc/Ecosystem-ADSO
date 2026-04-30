import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

const estadoConfig = {
  disponible:      { icon: "✅", color: "#0077B6", bg: "#e0f2fe", border: "#bae6fd", label: "Disponible" },
  "no disponible": { icon: "🚫", color: "#dc2626", bg: "#fee2e2", border: "#fecaca", label: "No Disponible" },
  mantenimiento:   { icon: "🔧", color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "Mantenimiento" },
};

const estadosSiguientes = {
  disponible:      ["no disponible", "mantenimiento"],
  "no disponible": ["disponible", "mantenimiento"],
  mantenimiento:   ["disponible", "no disponible"],
};

const mapaEstados = { disponible: 1, "no disponible": 2, mantenimiento: 3 };

export default function GestionEstadoEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargarEquipos(); }, []);

  const cargarEquipos = async () => {
    try {
      const res = await apiAxios.get("/api/estadoxequipo/ultimos/estados", { headers });
      setEquipos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };

  const cambiarEstado = async (id_equipo, nuevoEstado) => {
    const cfg = estadoConfig[nuevoEstado];
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      html: `<p style="margin:0;color:#64748b">El equipo pasará a</p><p style="margin:8px 0 0;font-size:20px;font-weight:700;color:${cfg.color}">${cfg.icon} ${cfg.label}</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0077B6",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.post("/api/estadoxequipo/cambiarEstado",
        { id_equipo, id_estado_equipo: mapaEstados[nuevoEstado] },
        { headers }
      );
      Swal.fire({ icon: "success", title: "¡Estado actualizado!", timer: 1500, showConfirmButton: false });
      cargarEquipos();
      setExpandedId(null);
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const filtered = equipos.filter(r =>
    [r.nom_equipo, r.no_placa, r.marca_equipo, r.ultimoEstado]
      .some(f => f?.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Gestión de Estado de Equipos</h2>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
        Cambia el estado de disponibilidad de cada equipo
      </p>

      {/* Search + Refresh */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-7">
          <input type="text" className="form-control"
            placeholder="Buscar por nombre, placa, marca o estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-5 text-end">
          <button className="btn btn-outline-primary" onClick={cargarEquipos}
            style={{ borderRadius: "10px", fontWeight: "600" }}>
            <i className="fas fa-sync me-2"></i>Actualizar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {Object.entries(estadoConfig).map(([key, cfg]) => {
          const count = filtered.filter(e => (e.ultimoEstado || "disponible") === key).length;
          return (
            <div key={key} style={{
              flex: "1 1 160px", background: cfg.bg, border: `1px solid ${cfg.border}`,
              borderRadius: "14px", padding: "16px 20px", textAlign: "center",
              minWidth: "140px"
            }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>{cfg.icon}</div>
              <div style={{ fontSize: "24px", fontWeight: "800", color: cfg.color }}>{count}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: cfg.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {cfg.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Equipment Cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
          <p style={{ fontSize: "16px" }}>No hay equipos que coincidan con la búsqueda</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "16px" }}>
          {filtered.map(equipo => {
            const estado = equipo.ultimoEstado || "disponible";
            const cfg = estadoConfig[estado] || estadoConfig.disponible;
            const siguientes = estadosSiguientes[estado] || [];
            const isExpanded = expandedId === equipo.id_equipo;

            return (
              <div key={equipo.id_equipo} style={{
                background: "#fff", borderRadius: "16px", overflow: "hidden",
                border: `1px solid ${cfg.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
                transform: isExpanded ? "scale(1.01)" : "scale(1)"
              }}>
                {/* Top color bar */}
                <div style={{ height: "4px", background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}88)` }} />

                <div style={{ padding: "20px" }}>
                  {/* Header row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                      <div style={{
                        width: "46px", height: "46px", borderRadius: "12px",
                        background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "20px", flexShrink: 0
                      }}>
                        {cfg.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h6 style={{ margin: "0 0 2px", fontWeight: "700", color: "#0f172a", fontSize: "15px",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}
                          title={equipo.nom_equipo}>
                          {equipo.nom_equipo}
                        </h6>
                        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                          {equipo.marca_equipo || "Sin marca"} · {equipo.no_placa || "Sin placa"}
                        </p>
                      </div>
                    </div>

                    {/* Status badge */}
                    <span style={{
                      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                      padding: "4px 14px", borderRadius: "99px", fontSize: "11px",
                      fontWeight: "700", whiteSpace: "nowrap", textTransform: "uppercase",
                      letterSpacing: "0.3px"
                    }}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Action area */}
                  <div style={{ marginTop: "16px" }}>
                    {!isExpanded ? (
                      <button
                        onClick={() => setExpandedId(equipo.id_equipo)}
                        style={{
                          width: "100%", padding: "10px", borderRadius: "10px",
                          border: `1px solid ${cfg.border}`, background: cfg.bg,
                          color: cfg.color, fontWeight: "700", fontSize: "12px",
                          cursor: "pointer", transition: "all 0.2s",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                        }}
                      >
                        <i className="fas fa-exchange-alt" style={{ fontSize: "11px" }}></i>
                        Cambiar Estado
                      </button>
                    ) : (
                      <div style={{
                        background: "#f8fafc", borderRadius: "12px", padding: "14px",
                        border: "1px solid #e2e8f0"
                      }}>
                        <p style={{
                          margin: "0 0 10px", fontSize: "11px", fontWeight: "700",
                          color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px"
                        }}>
                          Cambiar a:
                        </p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {siguientes.map(nuevoEstado => {
                            const targetCfg = estadoConfig[nuevoEstado];
                            return (
                              <button key={nuevoEstado}
                                onClick={() => cambiarEstado(equipo.id_equipo, nuevoEstado)}
                                style={{
                                  flex: 1, padding: "10px 16px", borderRadius: "10px",
                                  border: `1px solid ${targetCfg.border}`,
                                  background: targetCfg.bg, color: targetCfg.color,
                                  fontWeight: "700", fontSize: "12px", cursor: "pointer",
                                  transition: "all 0.2s", minWidth: "120px",
                                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
                                }}
                                onMouseOver={e => { e.target.style.background = targetCfg.color; e.target.style.color = "#fff"; }}
                                onMouseOut={e => { e.target.style.background = targetCfg.bg; e.target.style.color = targetCfg.color; }}
                              >
                                {targetCfg.icon} {targetCfg.label}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setExpandedId(null)}
                          style={{
                            marginTop: "10px", width: "100%", padding: "8px",
                            borderRadius: "8px", border: "1px solid #e2e8f0",
                            background: "#fff", color: "#94a3b8", fontWeight: "600",
                            fontSize: "11px", cursor: "pointer"
                          }}
                        >
                          ✕ Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}