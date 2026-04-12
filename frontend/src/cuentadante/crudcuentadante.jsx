import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import CuentadanteForm from "./cuentadanteForm.jsx";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";

export default function CrudCuentadante() {
  const [cuentadantes, setCuentadantes] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedCuentadante, setSelectedCuentadante] = useState(null);

  useEffect(() => {
    cargarCuentadantes();
  }, []);

  const cargarCuentadantes = async () => {
    try {
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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

  const filteredCuentadantes = cuentadantes.filter(row =>
    `${row.nom_cuentadante} ${row.apell_cuentadante}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">Gestión de Cuentadantes</h2>

      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o apellido..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalCuentadante"
            onClick={() => setSelectedCuentadante(null)}
          >
            <i className="fas fa-plus me-2"></i>Nuevo Cuentadante
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCuentadantes}
        pagination
        paginationPerPage={10}
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay cuentadantes registrados"
      />

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