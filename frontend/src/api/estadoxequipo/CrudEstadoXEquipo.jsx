import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";

export default function CrudEstadoXEquipo() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    id_equipo: "",
    id_estado_equipo: "",
    observacion: ""
  });

  // Obtener datos de la API
  const obtenerDatos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/estadoxequipo");
      setDatos(response.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los datos: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Crear un nuevo registro
  const crearRegistro = async (e) => {
    e.preventDefault();
    try {
      if (!form.id_equipo || !form.id_estado_equipo) {
        setError("Por favor completa los campos obligatorios");
        return;
      }
      await axios.post("/estadoxequipo", form);
      setForm({ id_equipo: "", id_estado_equipo: "", observacion: "" });
      setShowForm(false);
      obtenerDatos();
      setError(null);
    } catch (err) {
      setError("Error al crear: " + err.message);
    }
  };

  // Editar un registro
  const editar = (item) => {
    setEditId(item.id_estadoxequipo);
    setForm({
      id_equipo: item.id_equipo,
      id_estado_equipo: item.id_estado_equipo,
      observacion: item.observacion || ""
    });
    setShowForm(true);
  };

  // Actualizar un registro
  const actualizarRegistro = async (e) => {
    e.preventDefault();
    try {
      if (!form.id_equipo || !form.id_estado_equipo) {
        setError("Por favor completa los campos obligatorios");
        return;
      }
      await axios.put(`/estadoxequipo/${editId}`, form);
      setForm({ id_equipo: "", id_estado_equipo: "", observacion: "" });
      setEditId(null);
      setShowForm(false);
      obtenerDatos();
      setError(null);
    } catch (err) {
      setError("Error al actualizar: " + err.message);
    }
  };

  // Eliminar un registro
  const eliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      try {
        await axios.delete(`/estadoxequipo/${id}`);
        obtenerDatos();
        setError(null);
      } catch (err) {
        setError("Error al eliminar: " + err.message);
      }
    }
  };

  // Cerrar formulario
  const cerrarForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm({ id_equipo: "", id_estado_equipo: "", observacion: "" });
  };

  if (loading) {
    return <div className="container mt-4"><p>Cargando datos...</p></div>;
  }

  return (
    <div className="container mt-4">
      <h2>Estado x Equipo - CRUD</h2>
      
      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
      </div>}

      <div className="mb-3">
        <button 
          className="btn btn-primary me-2" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "+ Nuevo Registro"}
        </button>
        <button 
          className="btn btn-info" 
          onClick={obtenerDatos}
        >
          Actualizar
        </button>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5>{editId ? "Editar Registro" : "Crear Nuevo Registro"}</h5>
          </div>
          <div className="card-body">
            <form onSubmit={editId ? actualizarRegistro : crearRegistro}>
              <div className="mb-3">
                <label className="form-label">ID Equipo *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="id_equipo"
                  value={form.id_equipo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">ID Estado Equipo *</label>
                <input 
                  type="number" 
                  className="form-control" 
                  name="id_estado_equipo"
                  value={form.id_estado_equipo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Observación</label>
                <textarea 
                  className="form-control" 
                  name="observacion"
                  value={form.observacion}
                  onChange={handleChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                  {editId ? "Actualizar" : "Crear"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={cerrarForm}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TABLA */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>ID Equipo</th>
              <th>ID Estado</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Observación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.length > 0 ? (
              datos.map((item) => (
                <tr key={item.id_estadoxequipo}>
                  <td><strong>{item.id_estadoxequipo}</strong></td>
                  <td>{item.id_equipo}</td>
                  <td>{item.id_estado_equipo}</td>
                  <td>{new Date(item.createdat).toLocaleString("es-ES")}</td>
                  <td>{new Date(item.updatedat).toLocaleString("es-ES")}</td>
                  <td>{item.observacion ? <small>{item.observacion}</small> : <span className="text-muted">-</span>}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editar(item)}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminar(item.id_estadoxequipo)}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <p className="text-muted mb-0">No hay datos disponibles</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-muted">
        <small>Total de registros: <strong>{datos.length}</strong></small>
      </div>
    </div>
  );
}
