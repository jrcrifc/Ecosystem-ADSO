import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

export default function CrudEstadoEquipo() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ nombre_estado: "" });
  const [editId, setEditId] = useState(null);

  const getData = async () => {
    const res = await axios.get("/estadoequipo");
    setLista(res.data);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId === null) {
      await axios.post("/estadoequipo", form);
    } else {
      await axios.put(`/estadoequipo/${editId}`, form);
      setEditId(null);
    }

    setForm({ nombre_estado: "" });
    getData();
  };

  const eliminar = async (id) => {
    await axios.delete(`/estadoequipo/${id}`);
    getData();
  };

  const editar = (item) => {
    setEditId(item.id_estado_equipo);
    setForm({ nombre_estado: item.nombre_estado });
  };

  return (
    <div className="container mt-4">
      <h3>CRUD Estado Equipo</h3>

      <form className="mb-3" onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Nombre del estado"
          value={form.nombre_estado}
          onChange={(e) => setForm({ nombre_estado: e.target.value })}
        />
        <button className="btn btn-primary" type="submit">
          {editId ? "Actualizar" : "Crear"}
        </button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((e) => (
            <tr key={e.id_estado_equipo}>
              <td>{e.id_estado_equipo}</td>
              <td>{e.nombre_estado}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editar(e)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(e.id_estado_equipo)}
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
