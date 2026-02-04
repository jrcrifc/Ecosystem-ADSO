import { useEffect, useState } from "react";

const API_URL = "http://localhost:4001/api/estado-solicitud";

export default function EstadoSolicitudCrud() {
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ estado: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const cargarEstados = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEstados(Array.isArray(data) ? data : []);
    } catch (error) {
      alert("Error al cargar estados");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEstados();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: formData.estado })
      });

      if (!res.ok) throw new Error("Error al guardar");

      setFormData({ estado: "" });
      setEditingId(null);
      setShowForm(false);
      cargarEstados();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este estado?")) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargarEstados();
  };

  const filteredEstados = estados.filter(e =>
    e.estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h3 className="mb-3">Estados de Solicitud</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ estado: "" });
            setEditingId(null);
          }}
        >
          Nuevo Estado
        </button>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            value={formData.estado}
            onChange={(e) => setFormData({ estado: e.target.value })}
            placeholder="Nombre del estado"
            required
          />

          <button type="submit" className="btn btn-success">
            {editingId ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowForm(false)}
          >
            Cancelar
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstados.map(est => (
                <tr key={est.id_estado_solicitud}>
                  <td>{est.id_estado_solicitud}</td>
                  <td>{est.estado}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => alert(`ID: ${est.id_estado_solicitud}\nEstado: ${est.estado}`)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setFormData({ estado: est.estado });
                        setEditingId(est.id_estado_solicitud);
                        setShowForm(true);
                      }}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredEstados.length === 0 && !loading && (
        <p className="text-center text-muted">Sin registros</p>
      )}
    </div>
  );
}
