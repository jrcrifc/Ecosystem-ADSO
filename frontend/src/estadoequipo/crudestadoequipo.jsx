import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import EstadoEquipoForm from "./estadoequipoform.jsx";

// decodificador de JWT (local) — usado para sacar userType/admin
const parseToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (err) {
    return null
  }
}

const CrudEstadoEquipo = () => {
  const [estados, setEstados] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null); // null = loading, false = no autorizado, true = autorizado
  const [canEdit, setCanEdit] = useState(false); // control de permisos (aprendiz = solo ver)

  const customStyles = {
    table: {
      style: {
        margin: "0 auto",
        width: "fit-content",
      },
    },
    cells: {
      style: {
        justifyContent: "center",
      },
    },
  };

  const columns = [
    {
      name: "ID Estado del Equipo",
      selector: (row) => row.id_estado_equipo,
      sortable: true,
      width: "250px",
      center: true,
    },
    {
      name: "Estado Equipo",
      selector: (row) => (
        <span className={`fw-bold ${getColorEstado(row.estado)}`}>
          {row.estado?.toUpperCase() || "Sin estado"}
        </span>
      ),
      sortable: true,
      width: "250px",
      center: true,
    },
    {
      name: "Acciones",
      center: true,
      width: "180px",
      cell: (row) => (
        <div className="d-flex gap-2 justify-content-center">
          {canEdit ? (
            <>
              <button
                className="btn btn-sm btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#modalEstadoEquipo"
                onClick={() => setSelectedEstado(row)}
                title="Editar"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => eliminarEstadoEquipo(row.id_estado_equipo)}
                title="Eliminar"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </>
          ) : (
            <span className="text-muted">—</span>
          )}
        </div>
      ),
    },
  ];

  // Nota: Se fuerza el color negro para todas las etiquetas de estado
  // porque se solicitó que las etiquetas aparezcan en negro.
  // La implementación original por estado queda comentada abajo.
  const getColorEstado = () => {
    return "text-dark";
  };

  /* Implementación original por estado (comentada):
  const getColorEstado = (estado) => {
    switch (estado) {
      case "disponible":
        return "text-success";
      case "en_uso":
        return "text-info";
      case "mantenimiento":
        return "text-warning";
      case "dañado":
        return "text-danger";
      case "descartado":
        return "text-dark";
      default:
        return "text-muted";
    }
  };
  */

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsAuthorized(false)
      setCanEdit(false)
      return
    }
    const payload = parseToken(token)
    const role = (payload?.userType || '').toString().toLowerCase()
    const allowedEdit = ['gestor','instructor','intructor']
    setCanEdit(Boolean(payload?.admin || allowedEdit.includes(role)))
    cargarEstados();

    const handleTokenUpdate = () => {
      const t = localStorage.getItem('token')
      const p = parseToken(t)
      const r = (p?.userType || '').toString().toLowerCase()
      setCanEdit(Boolean(p?.admin || allowedEdit.includes(r)))
      setIsAuthorized(Boolean(t))
      if (t) cargarEstados()
    }
    window.addEventListener('tokenUpdated', handleTokenUpdate)
    return () => window.removeEventListener('tokenUpdated', handleTokenUpdate)
  }, []);

  const cargarEstados = async () => {
    try {
      const res = await apiAxios.get("/api/estadoequipo");
      setEstados(res.data);
      setIsAuthorized(true)
    } catch (error) {
      // si el backend responde 401 -> usuario no existe o token inválido
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        setIsAuthorized(false)
        return
      }
      console.error(error);
    }
  };

  // onSaved actualiza la lista localmente sin recargar todo
  const onSaved = (item, isUpdate) => {
    if (isUpdate) {
      setEstados((prev) => prev.map((p) => (p.id_estado_equipo === item.id_estado_equipo ? item : p)));
    } else {
      setEstados((prev) => [item, ...prev]);
    }
  };

  const filtered = estados.filter(
    (item) =>
      item.id_estado_equipo.toString().includes(filterText) ||
      item.estado?.toLowerCase().includes(filterText.toLowerCase())
  );

  const hideModal = () => {
    document.getElementById("closeModalEstadoEquipo").click();
    cargarEstados();
  };

  const eliminarEstadoEquipo = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.delete(`/api/estadoequipo/${id}`);
      // Actualizar estado localmente sin recargar la lista
      setEstados((prev) => prev.filter((p) => p.id_estado_equipo !== id));
      Swal.fire("Eliminado", "Elemento eliminado", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  if (isAuthorized === false) {
    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-primary fw-bold">Estados del Equipo</h2>
        <div className="alert alert-warning text-center">
          Acceso denegado — debes iniciar sesión para ver esta tabla. <a href="/login">Iniciar sesión</a>
        </div>
      </div>
    )
  }

  if (isAuthorized === null) {
    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-primary fw-bold">Estados del Equipo</h2>
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold">Estados del Equipo</h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID o estado..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-7 text-end">
          {canEdit ? (
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#modalEstadoEquipo"
              onClick={() => setSelectedEstado(null)}
            >
              + Nuevo Estado
            </button>
          ) : (
            <button className="btn btn-secondary" disabled title="No tienes permisos para crear">
              + Nuevo Estado
            </button>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-center">
        <div style={{ width: "fit-content" }}>
          <DataTable
            columns={columns}
            data={filtered}
            pagination
            highlightOnHover
            striped
            responsive
            noDataComponent="No hay estados registrados"
            customStyles={customStyles}
          />
        </div>
      </div>

      <div className="modal fade" id="modalEstadoEquipo" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedEstado ? "Editar" : "Nuevo"} Estado del Equipo
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <EstadoEquipoForm
                    selectedEstado={selectedEstado}
                    onSaved={onSaved}
                    hideModal={hideModal}
                  />
            </div>
          </div>
        </div>
      </div>
      <button type="button" id="closeModalEstadoEquipo" className="btn btn-primary d-none" data-bs-dismiss="modal"></button>
    </div>
  );
};

export default CrudEstadoEquipo;
