import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

export default function HistorialEstadoEquipo() {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);
  const [filterText, setFilterText] = useState("");

  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargarRegistros(); }, []);

  const cargarRegistros = async () => {
    try {
      const res = await apiAxios.get("/api/estadoxequipo", { headers });
      setRegistros(res.data);
    } catch {
      Swal.fire("Error", "No se pudo cargar el historial", "error");
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'disponible':    return 'bg-success';
      case 'no disponible': return 'bg-danger';
      case 'mantenimiento': return 'bg-warning text-dark';
      default:              return 'bg-secondary';
    }
  };

  const columns = [
    { name: "ID", selector: r => r.id_estadoxequipo, sortable: true, width: "80px" },
    { name: "Equipo", selector: r => r.equipo?.nom_equipo || "-", sortable: true, minWidth: "200px" },
    { name: "Marca", selector: r => r.equipo?.marca_equipo || "-", sortable: true, minWidth: "150px" },
    { name: "Placa", selector: r => r.equipo?.no_placa || "-", sortable: true, minWidth: "150px" },
    {
      name: "Estado",
      sortable: true,
      width: "150px",
      cell: r => (
        <span className={`badge ${getBadgeColor(r.estadoEquipo?.estado)}`} style={{ fontSize: "0.75rem", padding: "6px 12px", borderRadius: "20px" }}>
          {r.estadoEquipo?.estado || "-"}
        </span>
      )
    },
    { name: "Fecha Cambio", selector: r => r.createdAt ? new Date(r.createdAt).toLocaleString() : "-", sortable: true, minWidth: "250px" },
  ];

  const filtered = registros.filter(r => {
    const search = filterText.toLowerCase().trim();
    return (
      String(r.id_estadoxequipo || "").includes(search) ||
      String(r.id_equipo || "").includes(search) ||
      String(r.equipo?.nom_equipo || "").toLowerCase().includes(search) ||
      String(r.equipo?.marca_equipo || "").toLowerCase().includes(search) ||
      String(r.equipo?.no_placa || "").toLowerCase().includes(search) ||
      String(r.estadoEquipo?.estado || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mt-4" style={{ maxWidth: "1100px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Historial de Estados de Equipos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Registro cronológico de los cambios de estado de cada equipo en el sistema.
        </p>
      </div>
      <div className="row mb-4 align-items-center">
        <div className="col-md-7">
          <input type="text" className="form-control"
            placeholder="Buscar por ID, equipo, placa o estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-5 text-end">
          <div className="btn-group" role="group" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #0077B6" }}>
            <button 
              type="button" 
              className="btn" 
              style={{ background: "#fff", color: "#0077B6", fontWeight: "600", fontSize: "13px" }}
              onClick={() => navigate("/gestion-equipo")}
            >
              <i className="fas fa-edit me-2"></i>Gestión
            </button>
            <button type="button" className="btn" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", fontSize: "13px" }}>
              <i className="fas fa-history me-2"></i>Historial
            </button>
          </div>
        </div>
      </div>
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filtered}
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
              <p>No hay registros de cambios de estado</p>
            </div>
          }
        />
      </div>
    </div>
  );
}