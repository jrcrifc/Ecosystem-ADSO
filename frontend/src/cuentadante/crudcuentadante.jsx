import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import CuentadanteForm from "./cuentadanteForm.jsx";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

export default function CrudCuentadante() {
  const [cuentadantes, setCuentadantes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCuentadante, setSelectedCuentadante] = useState(null);

  useEffect(() => {
    cargarCuentadantes();
  }, []);

  const cargarCuentadantes = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await apiAxios.get("/api/cuentadante", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCuentadantes(res.data);
    } catch (error) {
      console.error("Error al cargar cuentadantes:", error);
      Swal.fire("Error", "No se pudieron cargar los cuentadantes", "error");
    }
  };

  const hideModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
      bsModal.hide();
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    }
  };

  const eliminarCuentadante = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cuentadante?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
      const token = sessionStorage.getItem("token");
      await apiAxios.delete(`/api/cuentadante/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
      cargarCuentadantes();
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el cuentadante", "error");
    }
  };

  const columns = [
    { name: "ID", selector: row => row.id_cuentadante, sortable: true, width: "80px" },
    { name: "Nombre", selector: row => row.nom_cuentadante, sortable: true },
    { name: "Apellido", selector: row => row.apell_cuentadante, sortable: true },
    { name: "Nombre Completo", selector: row => `${row.nom_cuentadante} ${row.apell_cuentadante}`, wrap: true },
    { name: "Telefono", selector: row => row.tel_cuentadante, sortable: true },
    {
      name: "Acciones",
      center: true,
      width: "140px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalCuentadante"
            onClick={() => setSelectedCuentadante(row)}
            title="Editar"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => eliminarCuentadante(row.id_cuentadante)}
            title="Eliminar"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const filteredCuentadantes = cuentadantes.filter(row => {
    const search = filterText.toLowerCase().trim();
    return (
      String(row.id_cuentadante || "").includes(search) ||
      String(row.nom_cuentadante || "").toLowerCase().includes(search) ||
      String(row.apell_cuentadante || "").toLowerCase().includes(search) ||
      `${row.nom_cuentadante} ${row.apell_cuentadante}`.toLowerCase().includes(search)
    );
  });

  return (
  <div className="container mt-4">
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
      <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
      <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Cuentadante</h2>
    </div>
  
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, nombre o apellido..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalCuentadante"
            onClick={() => setSelectedCuentadante(null)}
          >
            <i className="fas fa-plus me-2"></i>Nuevo Cuentadante
          </button>
        </div>
      </div>

      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filteredCuentadantes}
          pagination
          paginationPerPage={10}
          paginationComponentOptions={paginationComponentOptions}
          customStyles={tableCustomStyles}
          highlightOnHover
          striped
          responsive
          defaultSortFieldId={1}
          defaultSortAsc={false}
          noDataComponent={
            <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
              <div style={{ fontSize: "36px", marginBottom: "8px" }}>📭</div>
              <p>No hay cuentadantes registrados</p>
            </div>
          }
        />
      </div>

      {/* MODAL CREAR / EDITAR */}
      <div className="modal fade" id="modalCuentadante" tabIndex="-1" aria-labelledby="modalCuentadanteLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="modalCuentadanteLabel">
                {selectedCuentadante ? "Editar Cuentadante" : "Registrar Nuevo Cuentadante"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("modalCuentadante")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <CuentadanteForm
                selectedCuentadante={selectedCuentadante}
                refreshParent={cargarCuentadantes}
                hideModal={() => hideModal("modalCuentadante")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}