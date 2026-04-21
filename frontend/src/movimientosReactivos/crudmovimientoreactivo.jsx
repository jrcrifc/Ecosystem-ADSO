import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import IngresoReactivoForm from "./movimientoreactivoform.jsx";

const CrudmovimientoReactivo = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedMovimiento, setSelectedMovimiento] = useState(null);

  const columns = [
    { name: "ID", selector: (row) => row.id_movimiento_reactivo, sortable: true, width: "80px" },
    { name: "Reactivo", selector: (row) => row.reactivo?.nom_reactivo || "-", sortable: true, width: "180px" },
    { name: "Cant. Inicial", selector: (row) => row.cantidad_inicial || 0, sortable: true, width: "130px" },
    { name: "Lote", selector: (row) => row.lote || "-", sortable: true, width: "120px" },
    { name: "Proveedor", selector: (row) => row.proveedor ? `${row.proveedor.nom_proveedor} ${row.proveedor.apel_proveedor}` : "-", sortable: true, width: "170px" },
    { name: "Cant. Salida", selector: (row) => row.cantidad_salida || 0, sortable: true, width: "130px" },
    { name: "Fecha Vencimiento", selector: (row) => row.fecha_vencimiento?.slice(0, 10) || "-", sortable: true, width: "160px" },
    {
      name: "Acciones",
      center: true,
      width: "100px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalIngreso"
            onClick={() => setSelectedMovimiento(row)}
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const cargarMovimientos = async () => {
    try {
      const res = await apiAxios.get("/api/movimientos");
      setMovimientos(res.data);
    } catch (error) {
      console.error("Error al cargar movimientos:", error);
      Swal.fire("Error", "No se pudo cargar los movimientos de los reactivos", "error");
    }
  };

  const hideModal = () => {
    const modal = document.getElementById("modalIngreso");
    if (modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const filtered = movimientos.filter((item) =>
    `${item.id_movimiento_reactivo || ""}`.includes(filterText) ||
    `${item.reactivo?.nom_reactivo || ""}`.toLowerCase().includes(filterText.toLowerCase()) ||
    `${item.lote || ""}`.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="mt-4" style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 16px" }}>
      <h2 className="text-center mb-4 text-primary fw-bold">Movimientos de Reactivos</h2>

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
            onClick={() => setSelectedMovimiento(null)}
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
        noDataComponent="No hay movimientos registrados"
        paginationPerPage={10}
      />

      <div className="modal fade" id="modalIngreso" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedMovimiento ? "Editar" : "Nuevo"} Movimiento de Reactivo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={hideModal}
              ></button>
            </div>
            <div className="modal-body">
              <IngresoReactivoForm
                selectedMovimiento={selectedMovimiento}
                refreshData={cargarMovimientos}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudmovimientoReactivo;