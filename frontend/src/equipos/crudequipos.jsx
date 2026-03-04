import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import EquipoForm from "./EquiposForm.jsx";
import Swal from "sweetalert2";
import * as bootstrap from 'bootstrap';

export default function CrudEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [largePhoto, setLargePhoto] = useState(null); // Para el modal de foto grande

  useEffect(() => {
    getAllEquipos();
  }, []);

  const getAllEquipos = async () => {
    try {
      const res = await apiAxios.get("/api/equipos");
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
      confirmButtonColor: nuevoEstado === 1 ? "#28a745" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/equipos/${equipo.id_equipo}`, { estado: nuevoEstado });
      Swal.fire({
        icon: "success",
        title: nuevoEstado === 1 ? "Activado" : "Inactivado",
        timer: 1500,
        showConfirmButton: false,
      });
      getAllEquipos();
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
      console.error(error);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id_equipo,
      sortable: true,
      width: "80px",
    },
    {
      name: "Grupo",
      selector: (row) => row.grupo_equipo,
      sortable: true,
      wrap: true,
      width: "220px",
    },
    {
      name: "Nombre",
      selector: (row) => row.nom_equipo,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Marca",
      selector: (row) => row.marca_equipo || "-",
      sortable: true,
      width: "140px",
    },
    {
      name: "Placa/Serial",
      selector: (row) => row.no_placa || "-",
      sortable: true,
      width: "130px",
    },
    {
      name: "Cuentadante",
      selector: (row) => row.id_usuario_cuentadante || "-",
      width: "120px",
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
                border: "2px solid #28a745",
                transition: "transform 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onMouseOver={(e) => e.target.style.transform = "scale(1.08)"}
              onMouseOut={(e) => e.target.style.transform = "scale(1)"}
              onClick={() => {
                setLargePhoto(row.foto_equipo);
                const modal = new bootstrap.Modal(document.getElementById("largePhotoModal"));
                modal.show();
              }}
              onError={(e) => {
                e.target.src = "/img/no-image.png";
              }}
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
      width: "120px", // ← más ancho para que quepa bien
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
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalEquipo"
            onClick={() => setSelectedEquipo(row)}
            title="Editar equipo"
          >
            <i className="fas fa-edit"></i>
          </button>

          <button
            className={`btn btn-sm ${row.estado === 1 ? "btn-outline-danger" : "btn-outline-success"}`}
            onClick={() => cambiarEstado(row)}
            title={row.estado === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

  const filteredEquipos = equipos.filter((row) =>
    [row.nom_equipo, row.grupo_equipo, row.marca_equipo, row.no_placa, row.id_usuario_cuentadante]
      .some((field) => field?.toString().toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">Gestión de Equipos</h2>

      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre, grupo, marca, placa o cuentadante..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalEquipo"
            onClick={() => setSelectedEquipo(null)}
          >
            <i className="fas fa-plus me-2"></i>Nuevo Equipo
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredEquipos}
        pagination
        paginationPerPage={10}
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay equipos registrados"
      />

      {/* MODAL PARA EDITAR / CREAR */}
      <div className="modal fade" id="modalEquipo" tabIndex="-1" aria-labelledby="modalEquipoLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="modalEquipoLabel">
                {selectedEquipo ? "Editar Equipo" : "Registrar Nuevo Equipo"}
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <EquipoForm
                selectedEquipo={selectedEquipo}
                refreshParent={getAllEquipos}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL PARA VER FOTO GRANDE */}
      <div className="modal fade" id="largePhotoModal" tabIndex="-1" aria-labelledby="largePhotoLabel" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="largePhotoLabel">
                Foto del equipo
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center p-4">
              {largePhoto && (
                <img
                  src={`http://localhost:8000/uploads/${largePhoto}?v=${Date.now()}`}
                  alt="Foto grande del equipo"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    objectFit: "contain",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                  }}
                  onError={(e) => {
                    e.target.src = "/img/no-image.png";
                  }}
                />
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}