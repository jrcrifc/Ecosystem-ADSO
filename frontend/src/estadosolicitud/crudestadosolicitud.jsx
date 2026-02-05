import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import EstadoSolicitudForm from "./estadosolicitudform.jsx";

const CrudEstadoSolicitud = () => {
  const [estados, setEstados] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [selectedEstado, setSelectedEstado] = useState(null);

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
      name: "Estatus",
      width: "250px",
      center: true,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-pill text-white fw-semibold ${
            row.estados === 1 ? "bg-success" : "bg-danger"
          }`}
          style={{ fontSize: "0.75rem" }}
        >
          {row.estados === 1 ? "ACTIVO" : "INACTIVO"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Acciones",
      center: true,
      width: "140px",
      cell: (row) => (
        <div className="d-flex gap-1 justify-content-center">
          <button
            className="btn btn-sm btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#modalEstado"
            onClick={() => setSelectedEstado(row)}
            title="Editar"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>

          <button
            className={`btn btn-sm ${
              row.estados === 1 ? "btn-outline-danger" : "btn-outline-success"
            }`}
            onClick={() => toggleEstado(row.id_estado_solicitud, row.estados)}
            title={row.estados === 1 ? "Inactivar" : "Activar"}
          >
            <i className={`fas ${row.estados === 1 ? "fa-ban" : "fa-check"}`}></i>
          </button>
        </div>
      ),
    },
  ];

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

  useEffect(() => {
    cargarEstados();
  }, []);

  const cargarEstados = async () => {
    try {
      const res = await apiAxios.get("api/estadosolicitud");
      setEstados(res.data);
    } catch (error) {
      console.error(error);
    }
  };   // ← Aquí estaba la llave que faltaba!!!

  const toggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 1 ? 0 : 1;

    const result = await Swal.fire({
      title: "¿Cambiar estatus?",
      text: `Este estado pasará a estar ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: nuevoEstado === 1 ? "#28a745" : "#dc3545",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      await apiAxios.put(`api/estadosolicitud/estados/${id}`, { estados: nuevoEstado });

      setEstados(prev =>
        prev.map(item =>
          item.id_estado_solicitud === id ? { ...item, estados: nuevoEstado } : item
        )
      );

      Swal.fire("¡Listo!", `Estado ahora está ${nuevoEstado === 1 ? "ACTIVO" : "INACTIVO"}`, "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estatus", "error");
    }
  };

  const filtered = estados.filter(item =>
    item.id_estado_solicitud.toString().includes(filterText) ||
    item.estado?.toLowerCase().includes(filterText.toLowerCase())
  );

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
          <button
            className="btn btn-success"
            data-bs-toggle="modal"
            data-bs-target="#modalEstado"
            onClick={() => setSelectedEstado(null)}
          >
            + Nuevo Estado
          </button>
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
                refreshData={cargarEstados}
                hideModal={() => document.querySelector("#modalEstado")?.modal?.("hide")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrudEstadoSolicitud;