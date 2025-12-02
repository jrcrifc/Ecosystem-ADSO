import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import IngresoReactivoForm from "./IngresoReactivoForm.jsx";

const CrudIngresoReactivo = () => {
  const [ingresos, setIngresos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedIngreso, setSelectedIngreso] = useState(null);

  const columns = [
    {
      name: "ID Ingreso",
      selector: (row) => row.id_ingreso_reactivo,
      sortable: true,
      width: "120px",
    },
    {
      name: "Fecha Ingreso",
      selector: (row) => new Date(row.fech_ingreso).toLocaleDateString("es-ES"),
      sortable: true,
      width: "140px",
    },
    {
      name: "Cantidad",
      selector: (row) => row.cantidad_ingreso,
      sortable: true,
      width: "110px",
    },
    {
      name: "ID Reactivo",
      selector: (row) => row.id_reactivo,
      sortable: true,
      width: "120px",
    },
    {
      name: "ID Lote",
      selector: (row) => row.id_lote,
      sortable: true,
      width: "100px",
    },
    {
      name: "ID Responsable",
      selector: (row) => row.id_responsable,
      sortable: true,
      width: "140px",
    },
    {
      name: "Estado",
      width: "150px",
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
      sortable: true,
    },
    {
      name: "Acciones",
      center: true,
      width: "130px",
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          {/* EDITAR */}
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedIngreso(row)}
            title="Editar ingreso"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          {/* ACTIVAR / INACTIVAR */}
          <button
            className={`btn btn-sm ${
              row.estado === 1 ? "btn-outline-danger" : "btn-outline-success"
            }`}
            onClick={() => toggleEstado(row.id_ingreso_reactivo, row.estado)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    cargarIngresos();
  }, []);

  const cargarIngresos = async () => {
    try {
      const res = await apiAxios.get("api/ingresoreactivo");
      setIngresos(res.data);
    } catch (error) {
      console.error("Error al cargar ingresos:", error);
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `Este ingreso pasará a estar ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#28a745" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`api/ingresoreactivo/estado/${id}`, { estado: nuevoEstado });

      setIngresos((prev) =>
        prev.map((item) =>
          item.id_ingreso_reactivo === id ? { ...item, estado: nuevoEstado } : item
        )
      );

      Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: `Ingreso ahora está ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const filtered = ingresos.filter((item) =>
    item.id_ingreso_reactivo.toString().includes(filterText) ||
    item.id_reactivo.toString().includes(filterText) ||
    item.id_lote.toString().includes(filterText)
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Ingresos de Reactivos
      </h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, reactivo o lote..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedIngreso(null)}
          >
            + Nuevo Ingreso
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
        noDataComponent="No hay ingresos registrados"
        paginationPerPage={10}
      />

      {/* MODAL */}
      <div className="modal fade" id="modalIngreso" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedIngreso ? "Editar" : "Nuevo"} Ingreso de Reactivo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <IngresoReactivoForm
                selectedIngreso={selectedIngreso}
                refreshData={cargarIngresos}
                hideModal={() => document.querySelector("#modalIngreso").modal?.("hide")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudIngresoReactivo;