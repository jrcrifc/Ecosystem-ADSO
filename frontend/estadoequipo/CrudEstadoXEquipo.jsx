import React, { useState, useEffect } from "react";
import axios from "../src/api/axiosConfig";

export default function CrudEstadoXEquipo() {
  const [lista, setLista] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [form, setForm] = useState({ id_equipo: "", id_estado_equipo: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [resRel, resEq, resEst] = await Promise.all([
        axios.get("/estadoxequipo"),
        axios.get("/equipos"),
        axios.get("/estado-equipo")
      ]);
      setLista(resRel.data || []);
      setEquipos(resEq.data || []);
      setEstados(resEst.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const save = async (e) => {
    e.preventDefault();

    const req = editId
      ? axios.put(`/estadoxequipo/${editId}`, form)
      : axios.post("/estadoxequipo", form);

    await req;
    setForm({ id_equipo: "", id_estado_equipo: "" });
    setEditId(null);
    setShowForm(false);
    loadData();
  };

  const del = async (id) => {
    if (!confirm("¿Eliminar?")) return;
    await axios.delete(`/estadoxequipo/${id}`);
    loadData();
  };

  const edit = (item) => {
    setForm({
      id_equipo: item.id_equipo,
      id_estado_equipo: item.id_estado_equipo,
    });
    setEditId(item.id_estadoxequipo);
    setShowForm(true);
  };

  const filtered = lista.filter(
    (i) =>
      i.id_equipo.toString().includes(search) ||
      i.id_estado_equipo.toString().includes(search)
  );

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Estado por Equipo</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          onClick={() => {
            setForm({ id_equipo: "", id_estado_equipo: "" });
            setEditId(null);
            setShowForm(!showForm);
          }}
          className="btn btn-success"
        >
          Nueva Relación
        </button>

        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          style={{ width: "250px" }}
        />
      </div>

      {showForm && (
        <div className="card mb-3">
          <div className="card-body">
            <form onSubmit={save}>
              <select
                value={form.id_equipo}
                onChange={(e) => setForm({ ...form, id_equipo: e.target.value })}
                required
                className="form-select mb-3"
              >
                <option value="">Seleccionar Equipo</option>
                {equipos.map(eq => (
                  <option key={eq.id_equipo} value={eq.id_equipo}>{eq.nom_equipo || `Equipo ${eq.id_equipo}`}</option>
                ))}
              </select>

              <select
                value={form.id_estado_equipo}
                onChange={(e) => setForm({ ...form, id_estado_equipo: e.target.value })}
                required
                className="form-select mb-3"
              >
                <option value="">Seleccionar Estado</option>
                {estados.map(est => (
                  <option key={est.id_estado_equipo} value={est.id_estado_equipo}>{est.estado || `Estado ${est.id_estado_equipo}`}</option>
                ))}
              </select>

              <button type="submit" className="btn btn-primary me-2">
                Guardar
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-hover" style={{ fontSize: "12px" }}>
          <thead className="table-dark">
            <tr>
              <th style={{ padding: "6px" }}>ID</th>
              <th style={{ padding: "6px" }}>Equipo</th>
              <th style={{ padding: "6px" }}>Estado</th>
              <th style={{ padding: "6px" }}>Acciones</th>
            </tr>
          </thead>

        <tbody>
          {filtered.map((e, i) => (
            <tr key={e.id_estadoxequipo}>
              <td style={{ padding: "6px" }}>{e.id_estadoxequipo}</td>
              <td style={{ padding: "6px" }}>{e.Equipo ? e.Equipo.nom_equipo : e.id_equipo}</td>
              <td style={{ padding: "6px" }}>{e.EstadoEquipo ? e.EstadoEquipo.estado : e.id_estado_equipo}</td>

              <td style={{ padding: "6px", textAlign: "center" }}>
                <button
                  onClick={() => alert(`ID: ${e.id_estadoxequipo}\nEquipo: ${e.Equipo ? e.Equipo.nom_equipo : e.id_equipo}\nEstado: ${e.EstadoEquipo ? e.EstadoEquipo.estado : e.id_estado_equipo}`)}
                  className="btn btn-info btn-sm"
                  style={{ marginRight: "10px" }}
                >
                  Ver
                </button>

                

                <button
                  onClick={() => edit(e)}
                  className="btn btn-warning btn-sm"
                  style={{ marginRight: "5px" }}
                >
                  Editar
                </button>

                <button
                  onClick={() => del(e.id_estadoxequipo)}
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted">Sin datos</p>
      )}
    </div>
  );
}
