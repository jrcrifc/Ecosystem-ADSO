import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import EstadoSolicitudForm from "./estadosolicitudform.jsx";

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

const CrudEstadoSolicitud = () => {
  const [estados, setEstados] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(null); // controla acceso a la tabla (null = loading)
  const [canEdit, setCanEdit] = useState(false); // permiso de edición (aprendiz = no)

  // ESTILOS MÍNIMOS PARA CENTRAR (sin cambiar tamaños)
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
      name: "ID Estado de la solicitud",
      selector: (row) => row.id_estado_solicitud,
      sortable: true,
      width: "250px",
      center: true,
    },
    {
      name: "Estado Solicitud",
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
                data-bs-target="#modalEstado"
                onClick={() => setSelectedEstado(row)}
                title="Editar"
              >
                <i className="fa-solid fa-pencil"></i>
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => eliminarEstado(row.id_estado_solicitud)}
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
  // porque el requerimiento fue que las etiquetas aparezcan en negro.
  // Si en el futuro se desea restablecer el color por estado,
  // descomentar la implementación original (ejemplo comentado abajo).
  const getColorEstado = () => {
    return "text-dark";
  };

  /* Implementación original por estado (comentada):
  const getColorEstado = (estado) => {
    switch (estado) {
      case "generado": return "text-primary";
      case "aceptado": return "text-success";
      case "prestado": return "text-info";
      case "cancelado": return "text-danger";
      case "entregado": return "text-dark";
      default: return "text-muted";
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
      const res = await apiAxios.get("/api/estadosolicitud");
      setEstados(res.data);
      setIsAuthorized(true)
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        setIsAuthorized(false)
        return
      }
      console.error(error);
    }
  };

  // onSaved recibe el item creado/actualizado y actualiza el estado local
  const onSaved = (item, isUpdate) => {
    if (isUpdate) {
      setEstados((prev) => prev.map((p) => (p.id_estado_solicitud === item.id_estado_solicitud ? item : p)));
    } else {
      setEstados((prev) => [item, ...prev]);
    }
  };

  const eliminarEstado = async (id) => {
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
      await apiAxios.delete(`/api/estadosolicitud/${id}`);
      // Actualizar estado localmente sin recargar toda la lista
      setEstados((prev) => prev.filter((p) => p.id_estado_solicitud !== id));
      Swal.fire("Eliminado", "Elemento eliminado", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  const filtered = estados.filter(item =>
    item.id_estado_solicitud.toString().includes(filterText) ||
    item.estado?.toLowerCase().includes(filterText.toLowerCase())
  );

  const hideModal = () => {
    document.getElementById("closeModalEstado").click();
    cargarEstados();
  };

  if (isAuthorized === false) {
    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-primary fw-bold">
          Estados de Solicitud
        </h2>
        <div className="alert alert-warning text-center">
          Acceso denegado — debes iniciar sesión para ver esta tabla. <a href="/login">Iniciar sesión</a>
        </div>
      </div>
    )
  }

  if (isAuthorized === null) {
    return (
      <div className="container mt-4">
        <h2 className="text-center mb-4 text-primary fw-bold">
          Estados de Solicitud
        </h2>
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary fw-bold">
        Estados de Solicitud
      </h2>

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
              data-bs-target="#modalEstado"
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

      {/* Tabla centrada */}
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

      {/* MODAL */}
      <div className="modal fade" id="modalEstado" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                {selectedEstado ? "Editar" : "Nuevo"} Estado de Solicitud
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <EstadoSolicitudForm
                selectedEstado={selectedEstado}
                // onSaved permite actualizar la lista localmente sin recargar
                onSaved={onSaved}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      </div>
      <button type="button" id="closeModalEstado" className="btn btn-primary d-none" data-bs-dismiss="modal"></button>
    </div>
  );
};

export default CrudEstadoSolicitud;