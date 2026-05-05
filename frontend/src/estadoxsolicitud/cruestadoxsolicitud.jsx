import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

export default function CrudEstadoxSolicitud() {
  const [registros, setRegistros] = useState([]);
  const [filterText, setFilterText] = useState("");

  // ✅ Obtener datos del usuario actual
  const stored = sessionStorage.getItem("user");
  const userData = stored ? JSON.parse(stored) : null;
  const userRol = (userData?.user?.rol || userData?.rol || "").toLowerCase();
  const userId = userData?.id_usuario || userData?.user?.id_usuario;
  const esAdmin = userRol === "administrador" || userRol === "admin";

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await apiAxios.get("/api/estadoxsolicitud", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Si NO es admin, filtrar solo las solicitudes del usuario actual
      if (esAdmin) {
        setRegistros(res.data);
      } else {
        const misSolicitudes = res.data.filter(r =>
          r.solicitud?.id_usuario === userId
        );
        setRegistros(misSolicitudes);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
      Swal.fire("Error", "No se pudo cargar el historial de estados", "error");
    }
  };

  const getBadgeStyle = (estado) => {
    const map = {
      generado:  { bg: "#f1f5f9", color: "#475569" },
      aceptado:  { bg: "#dbeafe", color: "#0077B6" },
      prestado:  { bg: "#fffbeb", color: "#d97706" },
      entregado: { bg: "#ecfdf5", color: "#059669" },
      devuelto:  { bg: "#ecfdf5", color: "#059669" },
      cancelado: { bg: "#fef2f2", color: "#dc2626" },
      rechazado: { bg: "#fef2f2", color: "#dc2626" },
    };
    return map[estado] || { bg: "#f1f5f9", color: "#475569" };
  };

  const columns = [
    { 
      name: "ID", 
      selector: (row) => row.id_estadoxsolicitud, 
      sortable: true, 
      width: "80px",
    },
    { 
      name: "Solicitante", 
      selector: (row) => row.solicitud?.usuario?.nombres_apellidos || "-", 
      sortable: true, 
      minWidth: "220px",
      omit: !esAdmin,
    },
    { 
      name: "Fecha Inicio", 
      selector: (row) => row.solicitud?.fecha_inicio ? new Date(row.solicitud.fecha_inicio).toLocaleDateString() : "-", 
      sortable: true, 
      minWidth: "150px"
    },
    { 
      name: "Fecha Fin", 
      selector: (row) => row.solicitud?.fecha_fin ? new Date(row.solicitud.fecha_fin).toLocaleDateString() : "-", 
      sortable: true, 
      minWidth: "150px"
    },
    {
      name: "Estado",
      sortable: true,
      width: "160px",
      cell: (row) => {
        const style = getBadgeStyle(row.estadoSolicitud?.estado);
        return (
          <span style={{
            background: style.bg, color: style.color,
            fontSize: "11px", fontWeight: "700",
            padding: "5px 15px", borderRadius: "99px",
          }}>
            {row.estadoSolicitud?.estado || "-"}
          </span>
        );
      }
    },
    { 
      name: "Fecha Cambio", 
      selector: (row) => row.createdat ? new Date(row.createdat).toLocaleString() : "-", 
      sortable: true, 
      minWidth: "220px"
    },
  ];

  const filtered = registros.filter((row) =>
    [
      row.solicitud?.id_solicitud?.toString(),
      row.solicitud?.usuario?.nombres_apellidos,
      row.estadoSolicitud?.estado
    ].some((field) => field?.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="container mt-4" style={{ maxWidth: "1000px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>
          {esAdmin ? "Historial de Todas las Solicitudes" : "Mi Historial de Solicitudes"}
        </h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          {esAdmin
            ? "Vista completa de todos los cambios de estado de solicitudes del sistema."
            : "Aquí puedes ver el estado de tus solicitudes realizadas."
          }
        </p>
      </div>

      <div className="row mb-3 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, estado o solicitante..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-6 text-end">
          <button
            className="btn"
            onClick={cargarRegistros}
            style={{
              background: "#eef2ff", color: "#0077B6",
              fontWeight: "600", borderRadius: "10px", border: "1px solid #e0e7ff"
            }}
          >
            🔄 Actualizar
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
              <p>No tienes solicitudes registradas</p>
            </div>
          }
        />
      </div>
    </div>
  );
}