import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap"; // ✅ FIX: faltaba este import
import SolicitudPrestamoForm from "./solicitudform.jsx";

const CrudSolicitudPrestamos = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_solicitud,
      sortable: true,
      width: "90px",
    },
    {
      name: "Solicitante",
      selector: (row) => row.id_persona_solicitante,
      sortable: true,
      width: "130px",
    },
    {
      name: "Fecha Inicio",
      selector: (row) => (row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleString() : "-"),
      sortable: true,
      width: "180px",
    },
    {
      name: "Fecha Fin",
      selector: (row) => (row.fecha_fin ? new Date(row.fecha_fin).toLocaleString() : "-"),
      sortable: true,
      width: "180px",
    },
    {
      name: "Estado",
      width: "140px",
      center: true,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-pill text-white fw-semibold ${
            row.estado === 1 ? "bg-success" : "bg-danger"
          }`}
          style={{ fontSize: "0.75rem" }}
        >
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      ),
    },
    {
      name: "Acciones",
      center: true,
      width: "130px",
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalSolicitud"
            onClick={() => setSelectedSolicitud(row)}
            title="Editar solicitud"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className={`btn btn-sm ${
              row.estado === 1 ? "btn-outline-danger" : "btn-outline-success"
            }`}
            onClick={() => toggleEstado(row.id_solicitud, row.estado)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const res = await apiAxios.get("/api/solicitud");
      setSolicitudes(res.data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `La solicitud pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#28a745" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/solicitud/estado/${id}`, { estado: nuevoEstado });

      setSolicitudes((prev) =>
        prev.map((item) =>
          item.id_solicitud === id ? { ...item, estado: nuevoEstado } : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: `Solicitud ahora está ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const hideModal = () => {
    const modal = document.getElementById("modalSolicitud");
    const bsModal = bootstrap.Modal.getInstance(modal);
    bsModal?.hide();
  };

  const filtered = solicitudes.filter(
    (item) =>
      String(item.id_solicitud || "").includes(filterText) ||
      String(item.id_persona_solicitante || "").includes(filterText)
  );

  return (
    <div className="mt-4" style={{ maxWidth: "960px", margin: "0 auto", padding: "0 16px" }}>
      <h2 className="text-center mb-4 text-primary fw-bold">
        Solicitudes de Préstamo
      </h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID o solicitante..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalSolicitud"
            onClick={() => setSelectedSolicitud(null)}
          >
            + Nueva Solicitud
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay solicitudes registradas"
        paginationPerPage={10}
      />

      {/* Modal */}
      <div className="modal fade" id="modalSolicitud" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedSolicitud ? "Editar" : "Nueva"} Solicitud de Préstamo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <SolicitudPrestamoForm
                selectedSolicitud={selectedSolicitud}
                refreshData={cargarSolicitudes}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudSolicitudPrestamos;