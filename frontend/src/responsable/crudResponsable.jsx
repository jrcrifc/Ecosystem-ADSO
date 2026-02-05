import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Responsables from "./Responsables";

export default function CrudResponsable() {
  const [responsables, setResponsables] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedResponsable, setSelectedResponsable] = useState(null);

  useEffect(() => {
    getAllResponsables();
  }, []);

  const getAllResponsables = async () => {
    try {
      const res = await apiAxios.get("/api/responsable"); // Asegúrate del endpoint correcto
      setResponsables(res.data);
    } catch (error) {
      console.error("Error al obtener responsables:", error);
    }
  };

  const hideModal = () => {
    document.getElementById("closeModalResponsable").click();
    getAllResponsables();
  };

  // Cambiar estado al hacer click en la tabla
  const toggleEstado = async (responsable) => {
    try {
      await apiAxios.put(`/api/responsable/${responsable.id_responsable}`, {
        ...responsable,
        estado: responsable.estado === 1 ? 0 : 1,
      });
      getAllResponsables();
    } catch (error) {
      console.error("Error al cambiar estado:", error.response?.data || error);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id_responsable, sortable: true },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Apellido", selector: (row) => row.apellido, sortable: true },
    { name: "Teléfono", selector: (row) => row.numero_telefono },
    { name: "Correo", selector: (row) => row.correo },
    { name: "Cargo", selector: (row) => row.cargo },

    {
      name: "Estado",
      cell: (row) => (
        <span
          className={`badge ${row.estado === 1 ? "bg-success" : "bg-danger"}`}
          style={{ cursor: "pointer" }}
          onClick={() => toggleEstado(row)}
          title="Click para cambiar estado"
        >
          {row.estado === 1 ? "Activo" : "Inactivo"}
        </span>
      ),
      sortable: true,
    },

    {
      name: "Acciones",
      cell: (row) => (
        <button
          className="btn btn-sm bg-info"
          data-bs-toggle="modal"
          data-bs-target="#modalResponsable"
          onClick={() => setSelectedResponsable(row)}
        >
          <i className="fa-solid fa-pencil"></i>
        </button>
      ),
    },
  ];

  const filteredResponsables = responsables.filter((r) =>
    r.nombre?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Responsables</h2>

      <div className="row d-flex justify-content-between mb-4">
        <div className="col-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="col-2">
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#modalResponsable"
            onClick={() => setSelectedResponsable(null)}
          >
            Nuevo
          </button>
        </div>
      </div>

      <DataTable
        title="Listado de Responsables"
        columns={columns}
        data={filteredResponsables}
        pagination
        highlightOnHover
        striped
      />

      {/* MODAL */}
      <div className="modal fade" id="modalResponsable" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedResponsable ? "Editar Responsable" : "Nuevo Responsable"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModalResponsable"
              ></button>
            </div>
            <div className="modal-body">
              <Responsables
                hideModal={hideModal}
                selectedResponsable={selectedResponsable}
                key={selectedResponsable?.id_responsable || "new"} // reinicia el form al cambiar
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
