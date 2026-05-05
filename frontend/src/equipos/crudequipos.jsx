import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import EquipoForm from "./EquiposForm.jsx";
import Swal from "sweetalert2";
import * as bootstrap from "bootstrap";
import { exportToPDF, exportToExcel } from "../api/ExportUtils.js";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

export default function CrudEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [largePhoto, setLargePhoto] = useState(null);

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }
      const res = await apiAxios.get("/api/equipos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };

  const cambiarEstado = async (equipo) => {
    const nuevoEstado = equipo.estado === 1 ? 0 : 1;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El equipo pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#0077B6" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }
      await apiAxios.put(
        `/api/equipos/${equipo.id_equipo}`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 1 ? "Activado" : "Inactivado",
        timer: 1500,
        showConfirmButton: false,
      });
      getAllEquipos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
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

  const columns = [
    { name: "ID", selector: (row) => row.id_equipo, sortable: true, width: "80px", center: true },
    { name: "Grupo", selector: (row) => row.grupo_equipo, sortable: true, minWidth: "180px" },
    { name: "Nombre", selector: (row) => row.nom_equipo, sortable: true, minWidth: "180px" },
    { name: "Marca", selector: (row) => row.marca_equipo || "-", sortable: true, minWidth: "130px" },
    { name: "Placa", selector: (row) => row.no_placa || "-", sortable: true, minWidth: "130px" },

    // ✅ COLUMNA SIMPLIFICADA
    {
      name: "Cuentadante",
      selector: (row) => row.cuentadante
        ? `${row.cuentadante.nom_cuentadante} ${row.cuentadante.apell_cuentadante}`
        : "-",
      sortable: true,
      minWidth: "200px"
    },

    {
      name: "Foto",
      width: "120px",
      center: true,
      cell: (row) => (
        <div style={{ padding: "5px", cursor: row.foto_equipo ? "pointer" : "default" }}>
          {row.foto_equipo ? (
            <img
              src={`http://localhost:8000/uploads/${row.foto_equipo}?v=${Date.now()}`}
              alt={row.nom_equipo || "Foto del equipo"}
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "2px solid #0077B6",
                transition: "transform 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              onClick={() => {
                setLargePhoto(row.foto_equipo);
                const modal = new bootstrap.Modal(document.getElementById("largePhotoModal"));
                modal.show();
              }}
              onError={(e) => { e.target.src = "/img/no-image.png"; }}
            />
          ) : (
            <span style={{ color: "#999", fontSize: "12px" }}>Sin foto</span>
          )}
        </div>
      ),
    },
    {
      name: "Estado",
      center: true,
      width: "120px",
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
      width: "140px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          <button
            className="btn btn-sm" style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalEquipo"
            onClick={() => setSelectedEquipo(row)}
            title="Editar equipo"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            className="btn btn-sm" style={{ background: row.estado === 1 ? "#fee2e2" : "#dcfce7", color: row.estado === 1 ? "#dc2626" : "#16a34a", border: "none" }}
            onClick={() => cambiarEstado(row)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  // ✅ FILTRO CORREGIDO
  const filteredEquipos = equipos.filter((row) => {
    const nombreCuentadante = row.cuentadante
      ? `${row.cuentadante.nom_cuentadante} ${row.cuentadante.apell_cuentadante}`
      : "";
    return [row.nom_equipo, row.grupo_equipo, row.marca_equipo, row.no_placa, nombreCuentadante]
      .some((field) => field?.toString().toLowerCase().includes(filterText.toLowerCase()));
  });

  return (
    <div className="container mt-4" style={{ maxWidth: "1150px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Equipos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Administra el inventario de equipos y herramientas del laboratorio.
        </p>
      </div>

      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre, grupo, marca, placa o cuentadante..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-6 text-end d-flex gap-2 justify-content-end">
          <button className="btn btn-outline-danger" onClick={() => {
            const cols = [
              { header: "ID", dataKey: "id_equipo" },
              { header: "Grupo", dataKey: "grupo_equipo" },
              { header: "Nombre", dataKey: "nom_equipo" },
              { header: "Marca", dataKey: "marca_equipo" },
              { header: "Placa", dataKey: "no_placa" }
            ];
            exportToPDF(filteredEquipos, cols, "Inventario_Equipos", "INVENTARIO DE EQUIPOS");
          }}>
            <i className="fa-solid fa-file-pdf me-2"></i> PDF
          </button>
          <button className="btn btn-outline-success" onClick={() => exportToExcel(filteredEquipos, "Inventario_Equipos")}>
            <i className="fa-solid fa-file-excel me-2"></i> Excel
          </button>
          <button
            className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            data-bs-toggle="modal"
            data-bs-target="#modalEquipo"
            onClick={() => setSelectedEquipo(null)}
          >
            <i className="fas fa-plus me-2"></i>Nuevo Equipo
          </button>
        </div>
      </div>

      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filteredEquipos}
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
              <p>No hay equipos registrados</p>
            </div>
          }
        />
      </div>

      {/* MODAL EDITAR / CREAR */}
      <div className="modal fade" id="modalEquipo" tabIndex="-1" aria-labelledby="modalEquipoLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="modalEquipoLabel">
                {selectedEquipo ? "Editar Equipo" : "Registrar Nuevo Equipo"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("modalEquipo")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <EquipoForm
                selectedEquipo={selectedEquipo}
                refreshParent={getAllEquipos}
                hideModal={() => hideModal("modalEquipo")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX FOTO GRANDE */}
      <div className="modal fade" id="largePhotoModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content" style={{ background: "rgba(0,0,0,0.95)", border: "none", borderRadius: "16px" }}>
            <div className="modal-header" style={{ border: "none", paddingBottom: 0 }}>
              <h6 style={{ color: "#fff", fontWeight: "600", margin: 0 }}>📷 Vista ampliada</h6>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => hideModal("largePhotoModal")}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center" style={{ padding: "20px 40px 40px" }}>
              {largePhoto && (
                <img
                  src={`http://localhost:8000/uploads/${largePhoto}?v=${Date.now()}`}
                  alt="Foto del equipo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "75vh",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
                    transition: "transform 0.3s ease",
                  }}
                  onError={(e) => { e.target.src = "/img/no-image.png"; }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}