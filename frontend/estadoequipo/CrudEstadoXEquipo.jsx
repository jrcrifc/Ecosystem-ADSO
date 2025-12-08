import React, { useState, useEffect } from "react";
import axios from "../axiosConfig";

export default function CrudEstadoXEquipo() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({
    id_equipo: "",
    id_estado_equipo: ""
  });

  const [editId, setEditId] = useState(null);

  const getData = async () => {
    const res = await axios.get("/estadoxequipo");
    setLista(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId === null) {
      await axios.post("/estadoxequipo", form);
    } else {
      await axios.put(`/estadoxequipo/${editId}`, form);
      setEditId(null);
    }

    setForm({ id_equipo: "", id_estado_equipo: "" });
    getData();
  };

  const eliminar = async (id) => {
    await axios.delete(`/estadoxequipo/${id}`);
    getData();
  };

  const editar = (item) => {
    setEditId(item.id_estadoxequipo);
    setForm({
      id_equipo: item.id_equipo,
      id_estado_equipo: item.id_estado_equipo
    });
  };

  return (
    <div className="container mt-4">
      <h3>CRUD Estado X Equipo</h3>

      <form onSubmit={handleSubmit} className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="ID Equipo"
          value={form.id_equipo}
          onChange={(e) => setForm({ ...form, id_equipo: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="ID Estado Equipo"
          value={form.id_estado_equipo}
          onChange={(e) =>
            setForm({ ...form, id_estado_equipo: e.target.value })
          }
        />

        <button className="btn btn-primary" type="submit">
          {editId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID Equipo</th>
            <th>ID Estado Equipo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((e) => (
            <tr key={e.id_estadoxequipo}>
              <td>{e.id_estadoxequipo}</td>
              <td>{e.id_equipo}</td>
              <td>{e.id_estado_equipo}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editar(e)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(e.id_estadoxequipo)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
