import { useEffect, useState } from "react";

export default function EstadoSolicitudResumen() {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarEstados = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/estado-solicitud");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setEstados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar estados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstados();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", color: "#999" }}>Cargando estados...</div>;
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
      {estados.length > 0 ? (
        estados.map((estado, index) => (
          <div 
            key={estado.id_estado_solicitud || index} 
            style={{
              backgroundColor: "#e3f2fd",
              border: "2px solid #2196f3",
              borderRadius: "8px",
              padding: "15px",
              textAlign: "center",
              fontSize: "14px",
              fontWeight: "500",
              color: "#1565c0"
            }}
          >
            {estado.estado}
          </div>
        ))
      ) : (
        <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999", padding: "20px" }}>
          Sin estados registrados
        </div>
      )}
    </div>
  );
}
