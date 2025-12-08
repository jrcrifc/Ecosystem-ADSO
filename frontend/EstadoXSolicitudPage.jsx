import { useEffect, useState } from "react";
import {
  getAllEstadoXSolicitud,
  createEstadoXSolicitud,
  updateEstadoXSolicitud,
  deleteEstadoXSolicitud,
} from "../src/api/estadoxsolicitudApi";
import EstadoXSolicitudForm from "../components/EstadoXSolicitudForm";

export default function EstadoXSolicitudPage() {
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadData = async () => {
    const res = await getAllEstadoXSolicitud();
    setData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (form) => {
    await createEstadoXSolicitud(form);
    loadData();
  };

  const handleUpdate = async (form) => {
    await updateEstadoXSolicitud(editing.id_estadoxsolicitud, form);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteEstadoXSolicitud(id);
    loadData();
  };

  return (
    <div>
      <h1>Estado X Solicitud</h1>

      {editing ? (
        <EstadoXSolicitudForm
          onSubmit={handleUpdate}
          initialData={editing}
        />
      ) : (
        <EstadoXSolicitudForm onSubmit={handleCreate} />
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Id_solicitud</th>
            <th>id_estado_solicitud</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id_estadoxsolicitud}>
              <td>{item.id_estadoxsolicitud}</td>
              <td>{item.Id_solicitud}</td>
              <td>{item.id_estado_solicitud}</td>
              <td>{item.createdAt}</td>
              <td>{item.updatedAt}</td>

              <td>
                <button onClick={() => setEditing(item)}>Editar</button>
                <button onClick={() => handleDelete(item.id_estadoxsolicitud)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
