import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import EquipoForm from "./EquiposForm.jsx";
import Swal from "sweetalert2";
import * as bootstrap from 'bootstrap';

export default function CrudEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [largePhoto, setLargePhoto] = useState(null);

  const navigate = useNavigate();

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.token) {
      navigate("/UserLogin");
      return null;
    }
    return user.token;
  };

  const getAllEquipos = async (token) => {
    if (!token) return;
    try {
      const res = await apiAxios.get("/api/equipos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      if (error.response?.status === 401) navigate("/UserLogin");
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) getAllEquipos(token);

    const modalEl = document.getElementById('modalEquipo');
    if (modalEl) {
      const handleHidden = () => setSelectedEquipo(null);
      modalEl.addEventListener('hidden.bs.modal', handleHidden);
      return () => modalEl.removeEventListener('hidden.bs.modal', handleHidden);
    }
  }, []);

  const cambiarEstado = async (equipo) => {
    const token = getToken();
    if (!token) return;

    const nuevoEstado = equipo.estado === 1 ? 0 : 1;
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `El equipo pasará a ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#28a745" : "#dc3545",
      confirmButtonText: "Sí, cambiar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`/api/equipos/${equipo.id_equipo}`, { estado: nuevoEstado }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({ icon: "success", title: "Estado actualizado", timer: 1500, showConfirmButton: false });
      getAllEquipos(token);
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const columns = [
    { name: "ID", selector: row => row.id_equipo, sortable: true, width: "80px" },
    { name: "Grupo", selector: row => row.grupo_equipo, sortable: true, wrap: true, width: "220px" },
    { name: "Nombre", selector: row => row.nom_equipo, sortable: true, wrap: true, width: "200px" },
    { name: "Marca", selector: row => row.marca_equipo || "-", sortable: true, width: "140px" },
    { name: "Placa/Serial", selector: row => row.no_placa || "-", sortable: true, width: "130px" },
    {
      name: "Foto",
      width: "120px",
      center: true,
      cell: row => (
        <div style={{ padding: "5px" }}>
          {row.foto_equipo ? (
            <img
              src={`http://localhost:8000/uploads/${row.foto_equipo}?v=${Date.now()}`}
              alt="Equipo"
              style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }}
              onClick={() => {
                setLargePhoto(row.foto_equipo);
                const modal = new bootstrap.Modal(document.getElementById("largePhotoModal"));
                modal.show();
              }}
              onError={e => { e.target.src = "/img/no-image.png"; }}
            />
          ) : <span>-</span>}
        </div>
      )
    },
    {
      name: "Estado",
      center: true,
      cell: row => (
        <span className={`badge ${row.estado === 1 ? "bg-success" : "bg-danger"}`}>
          {row.estado === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      )
    },
    {
      name: "Acciones",
      center: true,
      cell: row => (
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#modalEquipo" onClick={() => setSelectedEquipo(row)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className={`btn btn-sm ${row.estado === 1 ? "btn-outline-danger" : "btn-outline-success"}`} onClick={() => cambiarEstado(row)}>
            <i className={`fas ${row.estado === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      )
    }
  ];

  const filteredEquipos = equipos.filter(row =>
    [row.nom_equipo, row.grupo_equipo, row.marca_equipo, row.no_placa]
      .some(field => field?.toString().toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">Gestión de Equipos</h2>
      <div className="row mb-4">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Buscar..." value={filterText} onChange={e => setFilterText(e.target.value)} />
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#modalEquipo" onClick={() => setSelectedEquipo(null)}>
            <i className="fas fa-plus me-2"></i>Nuevo Equipo
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredEquipos}
        pagination
        highlightOnHover
        noDataComponent="No hay equipos registrados"
      />

      <div className="modal fade" id="modalEquipo" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{selectedEquipo ? "Editar Equipo" : "Nuevo Equipo"}</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <EquipoForm selectedEquipo={selectedEquipo} refreshParent={() => getAllEquipos(getToken())} />
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="largePhotoModal" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center p-4">
              {largePhoto && (
                <img src={`http://localhost:8000/uploads/${largePhoto}`} alt="Grande" style={{ maxWidth: "100%", maxHeight: "80vh" }} onError={e => e.target.src = "/img/no-image.png"} />
              )}
              <button className="btn btn-secondary mt-3 d-block mx-auto" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}