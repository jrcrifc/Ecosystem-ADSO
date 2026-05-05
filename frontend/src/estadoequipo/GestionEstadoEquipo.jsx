import React, { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

const estadoConfig = {
  disponible:      { icon: "✅", color: "#0077B6", bg: "#e0f2fe", border: "#bae6fd", label: "Disponible" },
  "no disponible": { icon: "🚫", color: "#dc2626", bg: "#fee2e2", border: "#fecaca", label: "No Disponible" },
  mantenimiento:   { icon: "🔧", color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "Mantenimiento" },
};

const mapaEstados = { disponible: 1, "no disponible": 2, mantenimiento: 3 };

export default function GestionEstadoEquipo() {
  const [equipos, setEquipos] = useState([]);
  const [filterText, setFilterText] = useState("");

  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { cargarEquipos(); }, []);

  const cargarEquipos = async () => {
    try {
      const res = await apiAxios.get("/api/estadoxequipo/ultimos/estados", { headers });
      setEquipos(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };

  const cambiarEstado = async (id_equipo, nuevoEstado) => {
    const cfg = estadoConfig[nuevoEstado];
    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      html: `<p style="margin:0;color:#64748b">El equipo pasará a</p><p style="margin:8px 0 0;font-size:20px;font-weight:700;color:${cfg.color}">${cfg.icon} ${cfg.label}</p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0077B6",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });
    
    if (!result.isConfirmed) return;
    
    try {
      await apiAxios.post("/api/estadoxequipo/cambiarEstado",
        { id_equipo, id_estado_equipo: mapaEstados[nuevoEstado] },
        { headers }
      );
      Swal.fire({ icon: "success", title: "¡Estado actualizado!", timer: 1500, showConfirmButton: false });
      cargarEquipos();
    } catch {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const filtered = equipos.filter(r =>
    [r.nom_equipo, r.no_placa, r.marca_equipo, r.ultimoEstado]
      .some(f => f?.toLowerCase().includes(filterText.toLowerCase()))
  );

  const columns = [
    {
      name: "Equipo",
      selector: row => row.nom_equipo,
      sortable: true,
      grow: 2
    },
    {
      name: "Placa",
      selector: row => row.no_placa,
      sortable: true,
      width: "130px",
      center: true
    },
    {
      name: "Marca",
      selector: row => row.marca_equipo,
      sortable: true,
      width: "130px",
      center: true
    },
    {
      name: "Estado Actual",
      selector: row => row.ultimoEstado || "disponible",
      sortable: true,
      width: "170px",
      center: true,
      cell: row => {
        const estado = row.ultimoEstado || "disponible";
        const cfg = estadoConfig[estado] || estadoConfig.disponible;
        return (
          <span style={{
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            padding: "4px 10px", borderRadius: "99px", fontSize: "12px",
            fontWeight: "700"
          }}>
            {cfg.icon} {cfg.label}
          </span>
        );
      }
    },
    {
      name: "Acciones",
      cell: row => (
        <div className="dropdown">
          <button className="btn btn-sm text-white dropdown-toggle" style={{ background: "#0077B6" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fas fa-exchange-alt me-1"></i> Cambiar
          </button>
          <ul className="dropdown-menu">
            <li><button className="dropdown-item" onClick={() => cambiarEstado(row.id_equipo, "disponible")}>✅ Disponible</button></li>
            <li><button className="dropdown-item" onClick={() => cambiarEstado(row.id_equipo, "mantenimiento")}>🔧 Mantenimiento</button></li>
            <li><button className="dropdown-item" onClick={() => cambiarEstado(row.id_equipo, "no disponible")}>🚫 No Disponible</button></li>
          </ul>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "140px",
      center: true
    }
  ];

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Estado de Equipos</h2>
      </div>

      <div className="row mb-4 align-items-center">
        <div className="col-md-7">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar por nombre, placa, marca o estado..." 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-5 text-end">
          <button className="btn btn-outline-primary" onClick={cargarEquipos}>
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
              <p>No hay equipos registrados</p>
            </div>
          }
        />
      </div>
    </div>
  );
}