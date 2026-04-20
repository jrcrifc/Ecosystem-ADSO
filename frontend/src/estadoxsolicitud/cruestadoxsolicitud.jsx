import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function CrudEstadoxSolicitud() {
  const [registros, setRegistros] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiAxios.get("/api/estadoxsolicitud", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRegistros(res.data);
    } catch (error) {
      console.error("Error al cargar historial:", error);
      Swal.fire("Error", "No se pudo cargar el historial de estados", "error");
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "generado":  return "bg-secondary";
      case "aceptado":  return "bg-primary";
      case "prestado":  return "bg-warning text-dark";
      case "entregado": return "bg-success";
      case "cancelado": return "bg-danger";
      default:          return "bg-secondary";
    }
  };

  const columns = [
    { 
      name: "ID Registro", 
      selector: (row) => row.id_estadoxsolicitud, 
      sortable: true, 
      width: "120px" 
    },
    { 
      name: "Solicitante", 
      selector: (row) => row.solicitud?.usuario?.nombres_apellidos || "-", 
      sortable: true, 
      width: "180px" 
    },
    { 
      name: "Fecha Inicio", 
      selector: (row) => row.solicitud?.fecha_inicio?.slice(0, 10) || "-", 
      sortable: true, 
      width: "140px" 
    },
    { 
      name: "Fecha Fin", 
      selector: (row) => row.solicitud?.fecha_fin?.slice(0, 10) || "-", 
      sortable: true, 
      width: "140px" 
    },
    {
      name: "Estado",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <span className={`badge ${getBadgeColor(row.estadoSolicitud?.estado)}`} style={{ fontSize: "0.75rem" }}>
          {row.estadoSolicitud?.estado || "-"}
        </span>
      )
    },
    { 
      name: "Fecha Cambio", 
      selector: (row) => row.createdat?.slice(0, 10) || "-", 
      sortable: true, 
      width: "140px" 
    },
  ];

  const filtered = registros.filter((row) =>
    [
      row.solicitud?.id_solicitud?.toString(),
      row.estadoSolicitud?.estado
    ].some((field) => field?.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <h2 className="text-center mb-4 fw-bold text-primary">Historial de Estados de Solicitudes</h2>

      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID solicitud o estado..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-outline-primary" onClick={cargarRegistros}>
            <i className="fas fa-sync me-2"></i>Actualizar
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        pagination
        paginationPerPage={10}
        highlightOnHover
        striped
        responsive
        noDataComponent="No hay registros de cambios de estado"
      />
    </div>
  );
}