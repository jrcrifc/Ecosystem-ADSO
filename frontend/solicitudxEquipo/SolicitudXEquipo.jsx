import { useEffect, useState } from "react";

const API_URL = "http://localhost:4001/api/solicitudxequipo";

export default function SolicitudXEquipo() {
  const [items, setItems] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ Id_solicitud: "", id_equipo: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchJSON = async (url) => {
    const res = await fetch(url);
    return await res.json();
  };

  const cargar = async () => {
    try {
      setItems(await fetchJSON(API_URL));
      setSolicitudes(await fetchJSON("http://localhost:4001/api/solicitudes"));
      setEquipos(await fetchJSON("http://localhost:4001/api/equipos"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      setFormData({ Id_solicitud: '', id_equipo: '' });
      setEditingId(null);
      setShowForm(false);
      cargar();
    } else {
      alert('Error al guardar relación');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar relación?')) return;
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (res.ok) cargar();
    else alert('Error al eliminar');
  };

  return (
    <div>
      <h3 className="mb-3">Solicitud x Equipo</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ Id_solicitud: '', id_equipo: '' }); }}
        >
          Nueva Relación
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <select
                className="form-control"
                value={formData.Id_solicitud}
                onChange={(e) => setFormData({ ...formData, Id_solicitud: e.target.value })}
                required
              >
                <option value="">-- Seleccionar Solicitud --</option>
                {solicitudes.map(s => (
                  <option key={s.id} value={s.id}>{s.titulo}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <select
                className="form-control"
                value={formData.id_equipo}
                onChange={(e) => setFormData({ ...formData, id_equipo: e.target.value })}
                required
              >
                <option value="">-- Seleccionar Equipo --</option>
                {equipos.map(eq => (
                  <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nom_equipo || `#${eq.id_equipo}`}</option>
                ))}
              </select>
            </div>

            <div className="col-12 mt-2">
              <button type="submit" className="btn btn-success me-2">{editingId ? 'Actualizar' : 'Crear'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Solicitud</th>
                <th>Equipo</th>
                <th>Creado</th>
                <th>Actualizado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it.id_solicitudxequipo}>
                  <td>{it.id_solicitudxequipo}</td>
                  <td>{it.Solicitud ? it.Solicitud.titulo : it.Id_solicitud}</td>
                  <td>{it.Equipo ? it.Equipo.nom_equipo : it.id_equipo}</td>
                  <td>{it.createdat ? it.createdat.slice(0,19) : ''}</td>
                  <td>{it.updatedat ? it.updatedat.slice(0,19) : ''}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-2" onClick={() => alert(`Solicitud: ${it.Solicitud ? it.Solicitud.titulo : it.Id_solicitud}\nEquipo: ${it.Equipo ? it.Equipo.nom_equipo : it.id_equipo}`)}>Ver</button>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => { setFormData({ Id_solicitud: it.Id_solicitud, id_equipo: it.id_equipo }); setEditingId(it.id_solicitudxequipo); setShowForm(true); }}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(it.id_solicitudxequipo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {items.length === 0 && !loading && <p className="text-center">Sin datos</p>}
    </div>
  );
}
