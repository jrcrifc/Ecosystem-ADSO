import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ReactivoForm from "./reactivosform.jsx";

const CrudReactivos = () => {
  const [reactivos, setReactivos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedReactivo, setSelectedReactivo] = useState(null);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_reactivo,
      sortable: true,
      width: "80px",
    },
    {
      name: "Nombre",
      selector: (row) => row.nom_reactivo,
      sortable: true,
      width: "220px",
    },
    {
      name: "Presentación",
      selector: (row) => row.presentacion_reactivo,
      sortable: true,
      width: "130px",
    },
    {
      name: "Cantidad pres.",
      selector: (row) => row.cantidad_presentacion,
      sortable: true,
      width: "120px",
    },
    {
      name: "Stand / Col / Fila",
      selector: (row) => `${row.stand || "-"} / ${row.columna || "-"} / ${row.fila || "-"}`,
      sortable: false,
      width: "160px",
    },
    {
      name: "Color Stand",
      selector: (row) => row.color_stand,
      sortable: true,
      width: "110px",
    },
    {
      name: "Existencia",
      selector: (row) => row.existencia_reactivo,
      sortable: true,
      width: "100px",
    },
    {
      name: "Clasificación",
      selector: (row) => row.clasificacion_reactivo,
      sortable: true,
      width: "160px",
    },
    {
      name: "Estado",
      width: "120px",
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
            data-bs-target="#modalReactivo"
            onClick={() => setSelectedReactivo(row)}
            title="Editar reactivo"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className={`btn btn-sm ${
              row.estado === 1 ? "btn-outline-danger" : "btn-outline-success"
            }`}
            onClick={() => toggleEstado(row.id_reactivo, row.estado)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    cargarReactivos();
  }, []);

  const cargarReactivos = async () => {
    try {
      const res = await apiAxios.get("/api/reactivo");
      setReactivos(res.data);
    } catch (error) {
      console.error("Error al cargar reactivos:", error);
      Swal.fire("Error", "No se pudieron cargar los reactivos", "error");
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El reactivo pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#28a745" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/reactivo/estado/${id}`, { estado: nuevoEstado });

      setReactivos((prev) =>
        prev.map((item) =>
          item.id_reactivo === id ? { ...item, estado: nuevoEstado } : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: `Reactivo ahora está ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const filtered = reactivos.filter(
    (item) =>
      String(item.id_reactivo || "").includes(filterText) ||
      String(item.nom_reactivo || "").toLowerCase().includes(filterText.toLowerCase()) ||
      String(item.nom_reactivo_ingles || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Gestión de Reactivos
      </h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID o nombre..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalReactivo"
            onClick={() => setSelectedReactivo(null)}
          >
            + Nuevo Reactivo
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
        noDataComponent="No hay reactivos registrados"
        paginationPerPage={10}
      />

      {/* Modal */}
      <div className="modal fade" id="modalReactivo" tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedReactivo ? "Editar" : "Nuevo"} Reactivo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ReactivoForm
                selectedReactivo={selectedReactivo}
                refreshData={cargarReactivos}
                hideModal={() => {
                  const modal = document.getElementById("modalReactivo");
                  const bsModal = bootstrap.Modal.getInstance(modal);
                  bsModal?.hide();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudReactivos;