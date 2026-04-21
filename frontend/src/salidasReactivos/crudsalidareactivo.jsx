import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
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
      sortable: true, width: "180px"
    },
    {
      name: "Lote",
      selector: (row) => row.movimiento?.lote || "-",
      sortable: true, width: "120px"
    },
    {
      name: "Cantidad Salida",
      selector: (row) => parseFloat(row.cantidad_salida).toFixed(3),
      sortable: true, width: "150px"
    },
    {
      name: "Fecha de salida",
      selector: (row) => row.fecha_salida ? new Date(row.fecha_salida).toLocaleString('es-CO') : "-",
      sortable: true, width: "180px"
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
    <div className="mt-4" style={{ maxWidth: "960px", margin: "0 auto", padding: "0 16px" }}>
      <h2 className="text-center mb-4 text-primary fw-bold">Salidas de Reactivos</h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text" className="form-control"
            placeholder="Buscar por reactivo, lote o ID..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalSalida"
            onClick={() => setSelectedSalida(null)}
          >
            + Nueva Salida
          </button>
        </div>
      </div>

      <DataTable
        columns={columns} data={filtered}
        pagination highlightOnHover striped responsive
        noDataComponent="No hay salidas registradas"
        paginationPerPage={10}
      />

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