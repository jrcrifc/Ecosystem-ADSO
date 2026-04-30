import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const BitacoraAuditoria = () => {
  const [logs, setLogs] = useState([]);
  const [filterText, setFilterText] = useState("");

  const columns = [
    { name: "Fecha", selector: (row) => new Date(row.createdAt).toLocaleString(), sortable: true, width: "180px" },
    { name: "Acción", selector: (row) => row.accion, sortable: true, width: "120px", cell: (row) => (
      <span style={{ 
        padding: "4px 10px", borderRadius: "99px", fontSize: "11px", fontWeight: "700",
        background: row.accion === 'ELIMINAR' ? '#fee2e2' : row.accion === 'CREAR' ? '#dcfce7' : '#fef9c3',
        color: row.accion === 'ELIMINAR' ? '#ef4444' : row.accion === 'CREAR' ? '#22c55e' : '#ca8a04'
      }}>
        {row.accion}
      </span>
    )},
    { name: "Módulo", selector: (row) => row.modulo, sortable: true, width: "130px" },
    { name: "Detalle", selector: (row) => row.detalle, sortable: false, wrap: true },
    { name: "IP", selector: (row) => row.ip || "-", sortable: true, width: "140px" },
  ];

  useEffect(() => {
    cargarLogs();
  }, []);

  const cargarLogs = async () => {
    try {
      const res = await apiAxios.get("/api/admin/audit-logs");
      setLogs(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la bitácora", "error");
    }
  };

  const filtered = logs.filter((l) => 
    l.modulo.toLowerCase().includes(filterText.toLowerCase()) ||
    l.accion.toLowerCase().includes(filterText.toLowerCase()) ||
    l.detalle.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#023E8A", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0A1628", margin: 0 }}>
          Bitácora de Auditoría
        </h2>
      </div>

      <div className="card shadow-sm border-0" style={{ borderRadius: "18px", overflow: "hidden" }}>
        <div className="card-body p-0">
          <div style={{ padding: "20px" }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Filtrar por módulo, acción o detalle..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ borderRadius: "10px", padding: "10px 15px" }}
            />
          </div>
          <DataTable 
            columns={columns} 
            data={filtered} 
            pagination 
            highlightOnHover 
            responsive 
            noDataComponent="No hay registros de actividad"
            customStyles={{
              headCells: {
                style: {
                  background: "#f8fafc",
                  fontWeight: "700",
                  color: "#475569"
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BitacoraAuditoria;
