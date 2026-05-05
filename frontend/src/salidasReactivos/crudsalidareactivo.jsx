import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
import SalidaReactivoForm from "./salidareactivoform.jsx";

const CrudSalidasReactivos = () => {
  const [salidas, setSalidas] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedSalida, setSelectedSalida] = useState(null);

  const columns = [
    { name: "ID", selector: (row) => row.id_salida, sortable: true, width: "80px" },
    {
      name: "Reactivo",
      selector: (row) => row.movimiento?.reactivo?.nom_reactivo || "-",
      sortable: true, minWidth: "200px"
    },
    {
      name: "Lote",
      selector: (row) => row.movimiento?.lote || "-",
      sortable: true, minWidth: "150px"
    },
    {
      name: "Cantidad Salida",
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <span>
          {parseFloat(parseFloat(row.cantidad_salida || 0).toFixed(3)).toString()}{" "}
          <span style={{ fontSize: "11px", color: "#0077B6", fontWeight: "600" }}>
            {row.movimiento?.reactivo?.presentacion_reactivo || ""}
          </span>
        </span>
      )
    },
    {
      name: "Fecha Salida",
      selector: (row) => row.fecha_salida ? new Date(row.fecha_salida).toLocaleString('es-CO') : "-",
      sortable: true, minWidth: "250px"
    },
    {
      name: "Acciones", center: true, width: "130px",
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalSalida"
            onClick={() => setSelectedSalida(row)}
            title="Editar"
          >
            <i className="fas fa-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => eliminar(row.id_salida)}
            title="Eliminar"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      ),
    },
  ]; // ✅ Cierre del array columns

  useEffect(() => { cargarSalidas(); }, []);

  const cargarSalidas = async () => {
    try {
      const res = await apiAxios.get("/api/salidas");
      setSalidas(res.data);
    } catch (error) {
      console.error("Error al cargar salidas:", error);
      Swal.fire("Error", "No se pudieron cargar las salidas", "error");
    }
  };

  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar salida?",
      text: "El stock será devuelto al inventario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.delete(`/api/salidas/${id}`);
      Swal.fire("Eliminado", "Salida eliminada y stock restaurado", "success");
      cargarSalidas();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo eliminar", "error");
    }
  };

  const hideModal = () => {
    const modal = document.getElementById("modalSalida");
    if (modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const filtered = salidas.filter(item =>
    String(item.id_salida || "").includes(filterText) ||
    (item.movimiento?.reactivo?.nom_reactivo || "").toLowerCase().includes(filterText.toLowerCase()) ||
    (item.movimiento?.lote || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Salidas de Reactivos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Control detallado de los consumos y salidas de inventario.
        </p>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text" className="form-control"
            placeholder="Buscar por reactivo, lote o ID..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalSalida"
            onClick={() => setSelectedSalida(null)}
          >
            + Nueva Salida
          </button>
        </div>
      </div>

      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filtered}
          pagination
          paginationPerPage={10}
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay salidas registradas</p>
            </div>
          }
        />
      </div>

      <div className="modal fade" id="modalSalida" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedSalida ? "Editar" : "Nueva"} Salida de Reactivo
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>
            <div className="modal-body">
              <SalidaReactivoForm
                selectedSalida={selectedSalida}
                refreshData={cargarSalidas}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudSalidasReactivos;