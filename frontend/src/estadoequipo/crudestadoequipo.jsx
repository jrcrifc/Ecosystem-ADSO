export default function CrudEstadoEquipo() {
  const estados = [
    { id: 1, estado: "disponible",    icon: "✅", color: "#0077B6", bg: "#e0f2fe", border: "#bae6fd", desc: "El equipo está en el laboratorio, listo para ser prestado o utilizado" },
    { id: 2, estado: "no disponible", icon: "🚫", color: "#dc2626", bg: "#fee2e2", border: "#fecaca", desc: "El equipo no se encuentra disponible actualmente para préstamo" },
    { id: 3, estado: "mantenimiento", icon: "🔧", color: "#d97706", bg: "#fef3c7", border: "#fde68a", desc: "El equipo está en proceso de mantenimiento o calibración" },
  ];

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Estados de Equipo</h2>
      </div>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
        Estos son los estados fijos que puede tener cada equipo del laboratorio
      </p>
      <div style={{
        background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "12px",
        padding: "12px 18px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px"
      }}>
        <span style={{ fontSize: "18px" }}>ℹ️</span>
        <p style={{ margin: 0, fontSize: "13px", color: "#0369a1", fontWeight: "500" }}>
          Los estados son fijos y se asignan desde la gestión de equipos. No pueden ser creados ni eliminados.
        </p>
      </div>

      {/* Flow diagram */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        flexWrap: "wrap", gap: "0", marginBottom: "32px"
      }}>
        {estados.map((e, i) => (
          <div key={e.id} style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              background: e.bg, border: `2px solid ${e.border}`, borderRadius: "12px",
              padding: "14px 28px", textAlign: "center", minWidth: "120px"
            }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>{e.icon}</div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: e.color, textTransform: "uppercase" }}>
                {e.estado}
              </div>
            </div>
            {i < estados.length - 1 && (
              <div style={{ padding: "0 12px", color: "#cbd5e1", fontSize: "24px", fontWeight: "bold" }}>⇄</div>
            )}
          </div>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {estados.map(e => (
          <div key={e.id} style={{
            background: "#fff", borderRadius: "16px", overflow: "hidden",
            border: `1px solid ${e.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            transition: "transform 0.2s, box-shadow 0.2s"
          }}
            onMouseOver={ev => { ev.currentTarget.style.transform = "translateY(-3px)"; ev.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)"; }}
            onMouseOut={ev => { ev.currentTarget.style.transform = "translateY(0)"; ev.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
          >
            <div style={{ height: "5px", background: `linear-gradient(90deg, ${e.color}, ${e.color}88)` }} />
            <div style={{ padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px",
                  background: `linear-gradient(135deg, ${e.color}, ${e.color}cc)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px"
                }}>
                  {e.icon}
                </div>
                <div>
                  <div style={{ fontWeight: "800", color: e.color, fontSize: "16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {e.estado}
                  </div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600" }}>
                    Registro ID: {e.id}
                  </div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.7" }}>
                {e.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}