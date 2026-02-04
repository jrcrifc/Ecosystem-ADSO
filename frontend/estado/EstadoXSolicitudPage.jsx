import { useEffect, useState } from "react";

export default function EstadoXSolicitudPage() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ Id_solicitud: "", id_estado_solicitud: "" });
  const [solicitudes, setSolicitudes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    return await res.json();
  };

  const cargarDatos = async () => {
    try {
      setDatos(await fetchJSON("http://localhost:4001/api/estadoxsolicitud"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    fetchJSON("http://localhost:4001/api/solicitudes").then(setSolicitudes);
    fetchJSON("http://localhost:4001/api/estado-solicitud").then(setEstados);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:4001/api/estadoxsolicitud/${editingId}`
      : `http://localhost:4001/api/estadoxsolicitud`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({ Id_solicitud: "", id_estado_solicitud: "" });
    setEditingId(null);
    setShowForm(false);
    cargarDatos();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar?")) return;

    await fetch(`http://localhost:4001/api/estadoxsolicitud/${id}`, { method: "DELETE" });
    cargarDatos();
  };

  return (
    <div style={{ fontSize: "14px" }}>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "white" }}>
                <th style={{ padding: "6px" }}>ID</th>
                <th style={{ padding: "6px" }}>Solicitud</th>
                <th style={{ padding: "6px" }}>Estado</th>
                <th style={{ padding: "6px" }}>Creado</th>
                <th style={{ padding: "6px" }}>Actualizado</th>
                <th style={{ padding: "6px", width: "120px" }}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {datos.map((item, i) => (
                <tr key={item.id_estadoxsolicitud} style={{ background: i % 2 ? "#f9f9f9" : "#fff" }}>
                  <td style={{ padding: "6px" }}>{item.id_estadoxsolicitud}</td>
                  <td style={{ padding: "6px" }}>{item.Solicitud ? item.Solicitud.titulo : item.Id_solicitud}</td>
                  <td style={{ padding: "6px" }}>{item.EstadoSolicitud ? item.EstadoSolicitud.estado : item.id_estado_solicitud}</td>
                  <td style={{ padding: "6px" }}>{item.createdat ? item.createdat.slice(0,19) : ''}</td>
                  <td style={{ padding: "6px" }}>{item.updatedat ? item.updatedat.slice(0,19) : ''}</td>

                  <td style={{ padding: "6px", textAlign: "center" }}>
                    <button
                      onClick={() => {
                        setFormData({ Id_solicitud: item.Id_solicitud, id_estado_solicitud: item.id_estado_solicitud });
                        setEditingId(item.id_estadoxsolicitud);
                        setShowForm(true);
                      }}
                      style={{
                        background: "#ffc107",
                        padding: "4px 8px",
                        marginRight: "3px",
                        border: "none",
                        fontSize: "11px",
                      }}
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => handleDelete(item.id_estadoxsolicitud)}
                      style={{
                        background: "#dc3545",
                        padding: "4px 8px",
                        border: "none",
                        color: "#fff",
                        fontSize: "11px",
                      }}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {datos.length === 0 && (
            <div style={{ padding: "15px", textAlign: "center", color: "#999" }}>Sin datos</div>
          )}
        </>
      )}
    </div>
  );
}
