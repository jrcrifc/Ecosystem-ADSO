const CrudEstadoSolicitud = () => {
  const estados = [
    { id: 1, estado: "generado",  icon: "📋", color: "#0077B6", bg: "#e0f2fe", border: "#bae6fd", desc: "La solicitud ha sido creada y registrada en el sistema" },
    { id: 2, estado: "aceptado",  icon: "✅", color: "#059669", bg: "#d1fae5", border: "#a7f3d0", desc: "La solicitud fue revisada y aprobada por el administrador" },
    { id: 3, estado: "prestado",  icon: "📦", color: "#d97706", bg: "#fef3c7", border: "#fde68a", desc: "Los equipos están en posesión del solicitante" },
    { id: 4, estado: "cancelado", icon: "❌", color: "#dc2626", bg: "#fee2e2", border: "#fecaca", desc: "La solicitud fue cancelada o rechazada" },
    { id: 5, estado: "entregado", icon: "🔄", color: "#374151", bg: "#f3f4f6", border: "#d1d5db", desc: "Los equipos fueron devueltos al laboratorio" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-1" style={{ color: "#0f172a" }}>Estados de Solicitud</h2>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
        Estos son los estados fijos del flujo de solicitudes de préstamo
      </p>
      <div style={{
        background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px",
        padding: "12px 18px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px"
      }}>
        <span style={{ fontSize: "18px" }}>ℹ️</span>
        <p style={{ margin: 0, fontSize: "13px", color: "#0369a1", fontWeight: "500" }}>
          Los estados son fijos y definen el ciclo de vida de cada solicitud. No pueden ser modificados.
        </p>
      </div>

      {/* Flow diagram */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        flexWrap: "wrap", gap: "0", marginBottom: "32px"
      }}>
        {estados.filter(e => e.estado !== "cancelado").map((e, i, arr) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              background: e.bg, border: `2px solid ${e.border}`, borderRadius: "12px",
              padding: "10px 20px", textAlign: "center", minWidth: "100px"
            }}>
              <div style={{ fontSize: "20px" }}>{e.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: "700", color: e.color, textTransform: "uppercase" }}>
                {e.estado}
              </div>
            </div>
            {i < arr.length - 1 && (
              <div style={{ padding: "0 8px", color: "#cbd5e1", fontSize: "20px", fontWeight: "bold" }}>→</div>
            )}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {estados.map(e => (
          <div key={e.id} style={{
            background: "#fff", borderRadius: "16px", overflow: "hidden",
            border: `1px solid ${e.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
            onMouseOver={ev => { ev.currentTarget.style.transform = "translateY(-2px)"; ev.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
            onMouseOut={ev => { ev.currentTarget.style.transform = "translateY(0)"; ev.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ height: "4px", background: `linear-gradient(90deg, ${e.color}, ${e.color}88)` }} />
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  background: e.bg, border: `1px solid ${e.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "22px"
                }}>
                  {e.icon}
                </div>
                <div>
                  <div style={{ fontWeight: "800", color: e.color, fontSize: "15px", textTransform: "uppercase" }}>
                    {e.estado}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
                    ID: {e.id}
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.6" }}>
                {e.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrudEstadoSolicitud;