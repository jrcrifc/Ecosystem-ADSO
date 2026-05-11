import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import ReactivoForm from "./reactivosform.jsx";
import * as bootstrap from "bootstrap";
import { exportToPDF, exportToExcel } from "../api/ExportUtils.js";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

const CrudReactivos = () => {
  const [reactivos, setReactivos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedReactivo, setSelectedReactivo] = useState(null);

  const columns = [
    { name: "ID", selector: (row) => row.id_reactivo, sortable: true, width: "80px", center: true },
    { name: "Nombre", selector: (row) => row.nom_reactivo, sortable: true, minWidth: "220px" },
    { name: "Presentación", selector: (row) => row.presentacion_reactivo, sortable: true, minWidth: "180px" },
    { name: "Cantidad", selector: (row) => row.cantidad_presentacion, sortable: true, minWidth: "150px" },
    { name: "Ubicación (S/C/F)", selector: (row) => `${row.stand || "-"} / ${row.columna || "-"} / ${row.fila || "-"}`, sortable: false, minWidth: "200px" },
    { name: "Color Stand", selector: (row) => row.color_stand, sortable: true, minWidth: "150px" },
    { name: "Clasificación", selector: (row) => row.clasificacion_reactivo, sortable: true, minWidth: "200px" },
    {
      name: "Estado", width: "120px",
      cell: (row) => (
        <span className={`px-3 py-1 rounded-pill text-white fw-semibold ${row.estado === 1 ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.75rem" }}>
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      ),
    },
    {
      name: "Acciones", center: true, width: "130px",
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          <button className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }} data-bs-toggle="modal" data-bs-target="#modalReactivo" onClick={() => setSelectedReactivo(row)}>
            <i className="fa-solid fa-pencil"></i>
          </button>
          <button className="btn btn-sm" style={{ background: row.estado === 1 ? "#fee2e2" : "#dcfce7", color: row.estado === 1 ? "#dc2626" : "#16a34a", border: "none" }} onClick={() => toggleEstado(row.id_reactivo, row.estado)}>
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => { cargarReactivos(); }, []);

  const cargarReactivos = async () => {
    try {
      const res = await apiAxios.get("/api/reactivos");
      setReactivos(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los reactivos", "error");
    }
  };

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El reactivo pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question", showCancelButton: true,
      confirmButtonText: "Sí, cambiar", cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await apiAxios.put(`/api/reactivos/estado/${id}`, { estado: nuevoEstado });
      setReactivos((prev) => prev.map((item) => item.id_reactivo === id ? { ...item, estado: nuevoEstado } : item));
      Swal.fire("Correcto", "Estado actualizado", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  // ✅ FIX: getOrCreateInstance + limpiar backdrop
  const hideModal = () => {
    const modal = document.getElementById("modalReactivo");
    if (modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const filtered = reactivos.filter((item) => {
    const search = filterText.toLowerCase().trim();
    return (
      String(item.id_reactivo || "").includes(search) ||
      String(item.nom_reactivo || "").toLowerCase().includes(search) ||
      String(item.nom_reactivo_ingles || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mt-4" style={{ maxWidth: "1200px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Reactivos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Administra el inventario de reactivos, ubicaciones y clasificaciones.
        </p>
      </div>
      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input type="text" className="form-control" placeholder="Buscar por ID o nombre..." value={filterText} onChange={(e) => setFilterText(e.target.value)} style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-7 text-end d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-danger" onClick={() => {
            const cols = [
              { header: "ID", dataKey: "id_reactivo" },
              { header: "Nombre", dataKey: "nom_reactivo" },
              { header: "Presentación", dataKey: "presentacion_reactivo" },
              { header: "Clasificación", dataKey: "clasificacion_reactivo" }
            ];
            exportToPDF(filtered, cols, "Inventario_Reactivos", "INVENTARIO DE REACTIVOS");
          }}>
            <i className="fa-solid fa-file-pdf me-2"></i> PDF
          </button>
          <button className="btn btn-outline-success" onClick={() => exportToExcel(filtered, "Inventario_Reactivos")}>
            <i className="fa-solid fa-file-excel me-2"></i> Excel
          </button>
          <button className="btn" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }} data-bs-toggle="modal" data-bs-target="#modalReactivo" onClick={() => setSelectedReactivo(null)}>
            + Nuevo Reactivo
          </button>
        </div>
      </div>
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable columns={columns} data={filtered} pagination paginationPerPage={10} paginationComponentOptions={paginationComponentOptions} customStyles={tableCustomStyles} highlightOnHover striped responsive defaultSortFieldId={1} defaultSortAsc={false} noDataComponent={
          <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
            <p>No hay reactivos registrados</p>
          </div>
        } />
      </div>
      <div className="modal fade" id="modalReactivo" tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{selectedReactivo ? "Editar" : "Nuevo"} Reactivo</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>
            <div className="modal-body">
              <ReactivoForm selectedReactivo={selectedReactivo} refreshData={cargarReactivos} hideModal={hideModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudReactivos;