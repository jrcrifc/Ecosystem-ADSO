import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

export default function LogActividades() {
  const [logs, setLogs] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("todos"); // "todos", "login", "otros"

  useEffect(() => {
    cargarLogs();
  }, []);

  const cargarLogs = async () => {
    try {
      setLoading(true);
      const res = await apiAxios.get("/api/auditoria");
      setLogs(res.data);
    } catch (error) {
      console.error("Error al cargar auditoría:", error);
      Swal.fire("Error", "No se pudo obtener el historial de auditoría", "error");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: "Fecha", selector: (row) => new Date(row.fecha).toLocaleString(), sortable: true, width: "180px" },
    { name: "Usuario / Email", selector: (row) => row.usuario, sortable: true, minWidth: "150px" },
    { 
      name: "Acción", 
      selector: (row) => row.accion, 
      sortable: true, 
      width: "150px",
      cell: (row) => {
        const accion = row.accion;
        let bg = 'linear-gradient(135deg, #6366f1, #4f46e5)'; // Indigo por defecto
        let label = accion;

        if (accion === 'LOGIN') {
          bg = 'linear-gradient(135deg, #10b981, #059669)'; // Verde
          label = '🔑 LOGIN';
        } else if (accion === 'INACTIVAR_USUARIO') {
          bg = 'linear-gradient(135deg, #f43f5e, #e11d48)'; // Rojo / Rosado oscuro
          label = '🔒 INACTIVAR';
        } else if (accion === 'ACTIVAR_USUARIO') {
          bg = 'linear-gradient(135deg, #0ea5e9, #0284c7)'; // Azul cielo
          label = '🔓 ACTIVAR';
        } else if (accion === 'APROBAR_USUARIO') {
          bg = 'linear-gradient(135deg, #10b981, #059669)'; // Verde
          label = '✅ APROBAR';
        } else if (accion === 'RECHAZAR_USUARIO') {
          bg = 'linear-gradient(135deg, #f43f5e, #e11d48)'; // Rojo
          label = '❌ RECHAZAR';
        }

        return (
          <span 
            className="badge" 
            style={{ 
              fontSize: '10px', 
              fontWeight: '800',
              padding: '6px 12px',
              borderRadius: '99px',
              background: bg,
              color: '#fff',
              letterSpacing: '0.5px'
            }}
          >
            {label}
          </span>
        );
      }
    },
    { name: "Módulo", selector: (row) => row.modulo, sortable: true, width: "120px" },
    { name: "Detalles", selector: (row) => row.detalles || "-", sortable: false, wrap: true },
  ];

  const filteredLogs = logs.filter((row) => {
    const search = filterText.toLowerCase().trim();
    const matchesSearch = (
      String(row.usuario || "").toLowerCase().includes(search) ||
      String(row.accion || "").toLowerCase().includes(search) ||
      String(row.modulo || "").toLowerCase().includes(search) ||
      String(row.detalles || "").toLowerCase().includes(search)
    );

    if (!matchesSearch) return false;

    if (filterTab === "login") {
      return row.accion === "LOGIN";
    }
    if (filterTab === "otros") {
      return row.accion !== "LOGIN";
    }
    return true;
  });

  return (
    <div className="container mt-4 mb-5">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Historial de Accesos y Actividades</h2>
      </div>

      <div className="card border-0 shadow-sm p-4" style={{ borderRadius: "20px" }}>
        {/* Filtros por Categoría */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[
            ["todos", "📋 Todos los Registros"],
            ["login", "🔑 Solo Accesos (Login)"],
            ["otros", "⚙️ Otras Actividades"]
          ].map(([key, label]) => (
            <button 
              key={key} 
              onClick={() => setFilterTab(key)} 
              style={{
                padding: "8px 18px", 
                borderRadius: "10px", 
                border: "none", 
                cursor: "pointer",
                fontWeight: "600", 
                fontSize: "13px",
                background: filterTab === key ? "#0077B6" : "#f1f5f9",
                color: filterTab === key ? "#fff" : "#64748b",
                transition: "all 0.2s"
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar en el historial..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ borderRadius: "10px", border: "1px solid #e2e8f0", padding: "10px 15px" }}
            />
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-outline-primary" onClick={cargarLogs} disabled={loading} style={{ borderRadius: "10px", padding: "8px 20px" }}>
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i> Actualizar
            </button>
          </div>
        </div>

        <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
          <DataTable
            columns={columns}
            data={filteredLogs}
            pagination
            paginationPerPage={15}
            paginationComponentOptions={paginationComponentOptions}
            customStyles={tableCustomStyles}
            highlightOnHover
            striped
            responsive
            noDataComponent={
              <div className="py-5 text-center text-muted">
                <i className="fas fa-history fa-3x mb-3 opacity-25"></i>
                <p>No hay registros de actividad para mostrar</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
