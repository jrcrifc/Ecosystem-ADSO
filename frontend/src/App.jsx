import Equipos from "../equipo/Equipos.jsx";
import Solicitudes from "../solicitud/Solicitudes.jsx";
import EstadoXSolicitudPage from "../estado/EstadoXSolicitudPage.jsx";
import CrudEstadoXEquipo from "../estadoequipo/CrudEstadoXEquipo.jsx";
import SolicitudXEquipo from "../solicitudxEquipo/SolicitudXEquipo.jsx";

export default function App() {
  return (
    <div style={{ padding: "20px", background: "#fdf9f9ff", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>ecosistem</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        <div>
          <div style={{ border: "1px solid #ddd", borderRadius: "5px" }}>
            <div style={{ background: "#007bff", color: "white", padding: "15px", borderRadius: "5px 5px 0 0" }}>
              <h5 style={{ margin: 0 }}>Equipos</h5>
            </div>
            <div style={{ padding: "15px" }}>
              <Equipos />
            </div>
          </div>
        </div>
        <div>
          <div style={{ border: "1px solid #ddd", borderRadius: "5px" }}>
            <div style={{ background: "#17a2b8", color: "white", padding: "15px", borderRadius: "5px 5px 0 0" }}>
              <h5 style={{ margin: 0 }}>Solicitudes</h5>
            </div>
            <div style={{ padding: "15px" }}>
              <Solicitudes />
            </div>
          </div>
        </div>
        <div>
          <div style={{ border: "1px solid #ddd", borderRadius: "5px" }}>
            <div style={{ background: "#ffc107", color: "#333", padding: "15px", borderRadius: "5px 5px 0 0" }}>
              <h5 style={{ margin: 0 }}>Estado X Solicitud</h5>
            </div>
            <div style={{ padding: "15px" }}>
              <EstadoXSolicitudPage />
            </div>
          </div>
        </div>
        <div>
          <div style={{ border: "1px solid #ddd", borderRadius: "5px" }}>
            <div style={{ background: "#28a745", color: "white", padding: "15px", borderRadius: "5px 5px 0 0" }}>
              <h5 style={{ margin: 0 }}>Estado X Equipo</h5>
            </div>
            <div style={{ padding: "15px" }}>
              <CrudEstadoXEquipo />
            </div>
          </div>
        </div>
        <div>
          <div style={{ border: "1px solid #ddd", borderRadius: "5px" }}>
            <div style={{ background: "#6f42c1", color: "white", padding: "15px", borderRadius: "5px 5px 0 0" }}>
              <h5 style={{ margin: 0 }}>Solicitud X Equipo</h5>
            </div>
            <div style={{ padding: "15px" }}>
              <SolicitudXEquipo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
