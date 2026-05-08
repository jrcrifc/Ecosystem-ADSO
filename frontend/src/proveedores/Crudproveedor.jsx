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

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;
    const confirm = await Swal.fire({
      title: "¿Cambiar estado?", 
      text: `El proveedor pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "warning", showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, cambiar", cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      await apiAxios.put(`/api/proveedor/estado/${id}`, { estado: nuevoEstado });
      setProveedor(proveedor.map((p) => p.id_proveedor === id ? { ...p, estado: nuevoEstado } : p));
      Swal.fire({ icon: "success", title: "Actualizado", text: "El estado fue modificado correctamente", timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
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
      name: "Estado", width: "100px", center: true,
      cell: (row) => (
        <span className={`px-2 py-1 rounded-pill text-white fw-semibold ${row.estado === 1 ? "bg-success" : "bg-danger"}`} style={{ fontSize: "0.7rem" }}>
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      ),
    },
    {
      name: "Acciones", center: true, width: "120px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            data-bs-toggle="modal" data-bs-target="#modalProveedor" onClick={() => setSelectedProveedor(row)} title="Editar">
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-sm" style={{ background: row.estado === 1 ? "#fee2e2" : "#dcfce7", color: row.estado === 1 ? "#dc2626" : "#16a34a", border: "none" }}
            onClick={() => toggleEstado(row.id_proveedor, row.estado)} title={row.estado === 1 ? "Inactivar" : "Activar"}>
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Proveedores</h2>
      </div>
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