import { useEffect, useState } from "react";
import { getAllResponsables, createResponsable, updateResponsable, deleteResponsable } from "../src/api/responsableApi";

export default function Responsables() {
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    cargo: "",
    estado: "Activo"
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const cargarResponsables = async () => {
    try {
      const res = await getAllResponsables();
      setResponsables(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error al cargar responsables:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarResponsables();
  }, []);

  const filteredResponsables = responsables.filter(resp =>
    resp.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    resp.apellido?.toLowerCase().includes(search.toLowerCase()) ||
    resp.correo?.toLowerCase().includes(search.toLowerCase()) ||
    resp.telefono?.toLowerCase().includes(search.toLowerCase()) ||
    resp.cargo?.toLowerCase().includes(search.toLowerCase()) ||
    resp.estado?.toLowerCase().includes(search.toLowerCase()) ||
    resp.id?.toString().includes(search)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateResponsable(editingId, formData);
      } else {
        await createResponsable(formData);
      }
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        cargo: "",
        estado: "Activo"
      });
      setEditingId(null);
      setShowForm(false);
      cargarResponsables();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleEdit = (resp) => {
    setFormData({
      nombre: resp.nombre || "",
      apellido: resp.apellido || "",
      correo: resp.correo || "",
      telefono: resp.telefono || "",
      cargo: resp.cargo || "",
      estado: resp.estado || "Activo"
    });
    setEditingId(resp.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este responsable?")) {
      try {
        await deleteResponsable(id);
        cargarResponsables();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <div className="container mt-5">
      <h1 className="mb-3 text-center" style={{ fontWeight: 600, fontSize: '32px' }}>Responsables</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Buscar por nombre..."
          value={search}
          style={{ width: '320px', borderRadius: '8px' }}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
        <button
          className="btn btn-primary rounded-pill px-4 shadow"
          style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) {
              setEditingId(null);
              setFormData({
                nombre: "",
                apellido: "",
                correo: "",
                telefono: "",
                cargo: "",
                estado: ""
              });
            }
          }}
        >
          Nuevo
        </button>
      </div>

      <h5 className="mb-3" style={{ fontWeight: 500, color: '#333' }}>Listado de Responsables</h5> 

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editingId ? "Editar Responsable" : "Nuevo Responsable"}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Cargo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Estado</label>
                  <select className="form-select" value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-success me-2">
                    {editingId ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        nombre: "",
                        correo: "",
                        telefono: "",
                        apellido: "",
                        cargo: "",
                        estado: "Activo"
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
            <thead className="table-light">
              <tr>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>ID</th>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Nombre</th>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Apellido</th>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Teléfono</th>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Correo</th>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Cargo</th>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Estado</th>
                <th style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponsables.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((resp) => (
                <tr key={resp.id}>
                  <td><span className="px-2 py-1" style={{ background: '#f1f5f9', color: '#374151', borderRadius: 6, display: 'inline-block', minWidth: 40, textAlign: 'center' }}>{resp.id}</span></td>
                  <td><span className="px-2 py-1" style={{ background: '#f1f5f9', color: '#111827', borderRadius: 6, display: 'inline-block' }}>{resp.nombre}</span></td>
                  <td><span className="px-2 py-1" style={{ background: '#f1f5f9', color: '#111827', borderRadius: 6, display: 'inline-block' }}>{resp.apellido}</span></td>
                  <td><span className="px-2 py-1" style={{ background: '#f1f5f9', color: '#111827', borderRadius: 6, display: 'inline-block' }}>{resp.telefono}</span></td>
                  <td><span className="px-2 py-1" style={{ background: '#f1f5f9', color: '#111827', borderRadius: 6, display: 'inline-block' }}>{resp.correo}</span></td>
                  <td><span className="px-2 py-1" style={{ background: '#f1f5f9', color: '#111827', borderRadius: 6, display: 'inline-block' }}>{resp.cargo}</span></td>
                  <td>{resp.estado === 'Inactivo' ? <span className="badge" style={{ background: '#ef4444', color: 'white', borderRadius: 8 }}>Inactivo</span> : <span className="badge" style={{ background: '#10b981', color: 'white', borderRadius: 8 }}>Activo</span>}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => alert(`ID: ${resp.id}\nNombre: ${resp.nombre} ${resp.apellido}\nCorreo: ${resp.correo}\nTeléfono: ${resp.telefono}\nCargo: ${resp.cargo}\nEstado: ${resp.estado}`)}
                    >
                      Ver
                    </button>
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => {
                        setFormData(resp);
                        setEditingId(null);
                        setShowForm(true);
                      }}
                    >
                      Copiar
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEdit(resp)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(resp.id)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination footer */}
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div>
              Rows per page: 
              <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} className="form-select d-inline-block ms-2" style={{ width: '80px' }}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="text-muted">
              {filteredResponsables.length === 0 ? '0-0 of 0' : `${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredResponsables.length)} of ${filteredResponsables.length}`}
            </div>
            <div>
              <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Prev</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setPage(p => (p + 1) * rowsPerPage < filteredResponsables.length ? p + 1 : p)} disabled={(page + 1) * rowsPerPage >= filteredResponsables.length}>Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}