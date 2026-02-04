import { useEffect, useState } from "react";
import { getAllResponsables, createResponsable, updateResponsable, deleteResponsable } from "../src/api/responsableApi";

export default function Responsables() {
  const [responsables, setResponsables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    telefono: ""
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
    resp.correo?.toLowerCase().includes(search.toLowerCase())
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
        correo: "",
        telefono: ""
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
      nombre: resp.nombre,
      correo: resp.correo,
      telefono: resp.telefono
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestión de Responsables</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            if (editingId) {
              setEditingId(null);
              setFormData({
                nombre_responsable: "",
                apellido_responsable: "",
                email_responsable: "",
                telefono_responsable: ""
              });
            }
          }}
        >
          {showForm ? "Ocultar Formulario" : "Nuevo Responsable"}
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
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
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
                        telefono: ""
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
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResponsables.map((resp) => (
                <tr key={resp.id}>
                  <td>{resp.id}</td>
                  <td>{resp.nombre}</td>
                  <td>{resp.correo}</td>
                  <td>{resp.telefono}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => alert(`ID: ${resp.id}\nNombre: ${resp.nombre}\nCorreo: ${resp.correo}\nTeléfono: ${resp.telefono}`)}
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
                      Duplicar
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
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}