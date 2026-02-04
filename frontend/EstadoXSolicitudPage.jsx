import { useEffect, useState } from "react";
import {
  getAllEstadoXSolicitud,
  createEstadoXSolicitud,
  updateEstadoXSolicitud,
  deleteEstadoXSolicitud,
} from "../src/api/estadoxsolicitudApi";
import { getAllSolicitudes } from "../src/api/solicitudApi";
import { getAllEstadoSolicitud } from "../src/api/estadoSolicitudApi";
import EstadoXSolicitudForm from "../components/EstadoXSolicitudForm";

export default function EstadoXSolicitudPage() {
  const [data, setData] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAllEstadoXSolicitud();
      setData(res.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOptions = async () => {
    const [resSol, resEst] = await Promise.all([
      getAllSolicitudes(),
      getAllEstadoSolicitud()
    ]);
    setSolicitudes(resSol.data);
    setEstados(resEst.data);
  };

  useEffect(() => {
    loadData();
    loadOptions();
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

  const filteredData = data.filter(item =>
    item.Id_solicitud?.toString().includes(search) ||
    item.id_estado_solicitud?.toString().includes(search)
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Estado X Solicitud</h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setEditing(editing ? null : {})}
        >
          {editing ? "Cancelar" : "Nueva Relación"}
        </button>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {editing && (
        <div className="card mb-4">
          <div className="card-body">
            <EstadoXSolicitudForm
              onSubmit={editing.id_estadoxsolicitud ? handleUpdate : handleCreate}
              initialData={editing.id_estadoxsolicitud ? editing : null}
              solicitudes={solicitudes}
              estados={estados}
            />
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
                <th>Id_solicitud</th>
                <th>id_estado_solicitud</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id_estadoxsolicitud}>
                  <td>{item.id_estadoxsolicitud}</td>
                  <td>{item.Id_solicitud}</td>
                  <td>{item.id_estado_solicitud}</td>
                  <td>{new Date(item.createdat).toLocaleString()}</td>
                  <td>{new Date(item.updatedat).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => setEditing(item)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item.id_estadoxsolicitud)}
                    >
                      Borrar
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
