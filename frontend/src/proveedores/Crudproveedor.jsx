import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import ProveedorForm from "./ProveedorFrom.jsx";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

const Crudproveedor = () => {
  const [proveedor, setProveedor] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  useEffect(() => { cargarProveedor(); }, []);

  const cargarProveedor = async () => {
    try {
      const { data } = await apiAxios.get("/api/proveedor");
      setProveedor(data);
    } catch (error) {
      console.error("Error cargando proveedor", error);
      Swal.fire("Error", "No se pudo cargar los proveedores", "error");
    }
  };

  const eliminarProveedor = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar proveedor?", text: "Esta acción no se puede deshacer",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#dc3545", cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      await apiAxios.delete(`/api/proveedor/${id}`);
      setProveedor(proveedor.filter((p) => p.id_proveedor !== id));
      Swal.fire({ icon: "success", title: "Eliminado", text: "El proveedor fue eliminado correctamente", timer: 1800, showConfirmButton: false });
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  // ✅ FIX: getOrCreateInstance + limpiar backdrop
  const hideModal = () => {
    const modal = document.getElementById("modalProveedor");
    if (modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const columnas = [
    { name: "ID",        selector: (row) => row.id_proveedor,   sortable: true, width: "80px" },
    { name: "Nombre",    selector: (row) => row.nom_proveedor,  sortable: true },
    { name: "Apellido",  selector: (row) => row.apel_proveedor, sortable: true },
    { name: "Teléfono",  selector: (row) => row.tel_proveedor,  sortable: true },
    { name: "Dirección", selector: (row) => row.dir_proveedor,  sortable: true },
    {
      name: "Acciones", center: true, width: "120px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            data-bs-toggle="modal" data-bs-target="#modalProveedor" onClick={() => setSelectedProveedor(row)} title="Editar">
            ✏️
          </button>
          <button className="btn btn-sm" style={{ background: "#fee2e2", color: "#dc2626", border: "none" }}
            onClick={() => eliminarProveedor(row.id_proveedor)} title="Eliminar">
            🗑️
          </button>
        </div>
      ),
    },
  ];

  const listaFiltrada = proveedor.filter((p) =>
    [p.nom_proveedor, p.apel_proveedor, p.tel_proveedor, p.dir_proveedor]
      .some((field) => field?.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="mt-4" style={{ padding: "0 16px" }}>
      <h2 className="fw-bold mb-1" style={{ color: "#0A1628" }}>Gestión de Proveedores</h2>
      <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>Administra los proveedores del laboratorio</p>

      <div className="row mb-3 align-items-center">
        <div className="col-md-7">
          <input type="text" className="form-control" placeholder="Buscar por nombre, apellido, teléfono..."
            value={filterText} onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-5 text-end">
          <button className="btn" data-bs-toggle="modal" data-bs-target="#modalProveedor"
            onClick={() => setSelectedProveedor(null)}
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}>
            + Nuevo Proveedor
          </button>
        </div>
      </div>

      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columnas}
          data={listaFiltrada}
          pagination
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay proveedores registrados</p>
            </div>
          }
          paginationPerPage={10}
        />
      </div>

      <div className="modal fade" id="modalProveedor" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content" style={{ borderRadius: "16px", overflow: "hidden" }}>
            <div className="modal-header" style={{ background: "#023E8A", color: "#fff" }}>
              <h5 className="modal-title fw-bold">{selectedProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={hideModal}></button>
            </div>
            <div className="modal-body">
              <ProveedorForm selectedProveedor={selectedProveedor} refreshData={cargarProveedor} hideModal={hideModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Crudproveedor;