import { useEffect, useState } from "react";

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ titulo: "", descripcion: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const cargarSolicitudes = async () => {
    try {
      const response = await fetch("http://localhost:4001/api/solicitudes");
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setSolicitudes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      alert("Error al cargar solicitudes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `http://localhost:4001/api/solicitudes/${editingId}` : "http://localhost:4001/api/solicitudes";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingId ? "Solicitud actualizada" : "Solicitud creada");
        setFormData({ titulo: "", descripcion: "" });
        setEditingId(null);
        setShowForm(false);
        cargarSolicitudes();
      } else {
        alert("Error al guardar: " + response.status);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta solicitud?")) {
      try {
        const response = await fetch(`http://localhost:4001/api/solicitudes/${id}`, { method: "DELETE" });
        if (response.ok) {
          alert("Solicitud eliminada correctamente");
          cargarSolicitudes();
        } else {
          alert("Error al eliminar: " + response.status);
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }
  };

  const filteredSolicitudes = solicitudes.filter(s => 
    s.titulo?.toLowerCase().includes(search.toLowerCase()) || 
    s.descripcion?.toLowerCase().includes(search.toLowerCase()) ||
    s.id?.toString().includes(search)
  );

  return (
    <div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className="btn btn-success"
              onClick={() => {
                setFormData({ titulo: "", descripcion: "" });
                setEditingId(null);
                setShowForm(!showForm);
              }}
            >
              Nueva Solicitud
            </button>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Buscar por título o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {showForm && (
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Título:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Ingrese título"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción:</label>
                    <textarea
                      className="form-control"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Ingrese descripción"
                      required
                      rows="3"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary me-2">
                    {editingId ? "Actualizar" : "Guardar"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ titulo: "", descripcion: "" });
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Creado</th>
                  <th>Actualizado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSolicitudes.map((sol) => (
                  <tr key={sol.id}>
                    <td>{sol.id}</td>
                    <td>{sol.titulo}</td>
                    <td>{sol.descripcion ? (sol.descripcion.length > 80 ? sol.descripcion.substring(0, 80) + '...' : sol.descripcion) : ''}</td>
                    <td>{sol.createdat ? sol.createdat.slice(0,19) : ''}</td>
                    <td>{sol.updatedat ? sol.updatedat.slice(0,19) : ''}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => alert(`ID: ${sol.id}\nTítulo: ${sol.titulo}\nDescripción: ${sol.descripcion}\nCreado: ${sol.createdat || ''}\nActualizado: ${sol.updatedat || ''}`)}
                      >
                        Ver
                      </button>
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => {
                          setFormData({ titulo: sol.titulo || '', descripcion: sol.descripcion || '' });
                          setEditingId(sol.id);
                          setShowForm(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(sol.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSolicitudes.length === 0 && (
            <p className="text-center text-muted">Sin datos</p>
          )}
        </>
      )}
    </div>
  );
}


