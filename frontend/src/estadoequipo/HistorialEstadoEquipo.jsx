import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

export default function HistorialEstadoEquipo() {
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
    { name: "ID Registro", selector: r => r.id_estadoxequipo, sortable: true, width: "120px" },
    { name: "Equipo", selector: r => r.equipo?.nom_equipo || "-", sortable: true, width: "180px" },
    { name: "Marca", selector: r => r.equipo?.marca_equipo || "-", sortable: true, width: "130px" },
    { name: "No. Placa", selector: r => r.equipo?.no_placa || "-", sortable: true, width: "120px" },
    {
      name: "Estado",
      sortable: true,
      width: "150px",
      cell: r => (
        <span className={`badge ${getBadgeColor(r.estadoEquipo?.estado)}`} style={{ fontSize: "0.75rem" }}>
          {r.estadoEquipo?.estado || "-"}
        </span>
      )
    },
    { name: "Fecha Cambio", selector: r => r.createdAt?.slice(0, 10) || "-", sortable: true, width: "140px" },
  ];

  const filtered = registros.filter(r =>
    [r.equipo?.nom_equipo, r.equipo?.no_placa, r.estadoEquipo?.estado]
      .some(f => f?.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Historial de Estados de Equipos</h2>
      </div>
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input type="text" className="form-control"
            placeholder="Buscar por equipo, placa o estado..."
            value={filterText} onChange={e => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }} />
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-outline-primary" onClick={cargarRegistros}>
            <i className="fas fa-sync me-2"></i>Actualizar
          </button>
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