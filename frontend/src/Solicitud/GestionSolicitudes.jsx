import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
import socket from "../socket.js";

const formatDateTime = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (isoString.endsWith("T00:00:00.000Z") || isoString.includes("T00:00:00")) {
    return `${isoString.substring(0, 10)} 07:00 AM`;
  }
  return d.toLocaleString('es-CO', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const GestionSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterText, setFilterText] = useState("");

  const getToken = () => sessionStorage.getItem("token");

  const getBadgeStyle = (estado) => {
    const map = {
      generado: { bg: "#f1f5f9", color: "#475569", label: "Generado" },
      aceptado: { bg: "#dbeafe", color: "#0077B6", label: "Solicitado" },
      prestado: { bg: "#fffbeb", color: "#d97706", label: "Prestado" },
      entregado: { bg: "#ecfdf5", color: "#059669", label: "Disponible" },
      cancelado: { bg: "#fef2f2", color: "#dc2626", label: "Cancelado" },
      rechazado: { bg: "#fef2f2", color: "#dc2626", label: "Rechazado" },
    };
    return map[estado] || { bg: "#f1f5f9", color: "#475569", label: estado };
  };

  const estadosSiguientes = {
    generado: ["aceptado", "cancelado"],
    aceptado: ["prestado"],
    prestado: ["entregado"],
    entregado: [],
    cancelado: [],
  };

  const columns = [
    { name: "ID", selector: (row) => row.id_solicitud, sortable: true, width: "80px" },
    {
      name: "Solicitante",
      cell: (row) => {
        const u = row.usuario;
        if (!u) return <span>-</span>;
        return (
          <div style={{ padding: "6px 0" }}>
            <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "13px" }}>{u.nombres_apellidos}</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{u.rol}</div>
            {(u.numero_ficha || u.nombre_ficha) && (
              <div style={{ fontSize: "11px", color: "#0077B6", marginTop: "2px", fontWeight: "600" }}>
                🆔 Ficha: {u.numero_ficha || "N/A"} ({u.nombre_ficha || "N/A"})
                {u.es_sena_empresa ? " 🏢 SENA Empresa" : ""}
              </div>
            )}
          </div>
        );
      },
      sortable: true,
      width: "250px",
    },
    {
      name: "Fecha Inicio",
      selector: (row) => formatDateTime(row.fecha_inicio),
      sortable: true,
      width: "155px",
      wrap: true
    },
    {
      name: "Fecha Fin",
      selector: (row) => formatDateTime(row.fecha_fin),
      sortable: true,
      width: "155px",
      wrap: true
    },
    {
      name: "Estado Actual",
      width: "150px",
      cell: (row) => {
        const style = getBadgeStyle(row.ultimoEstado);
        return (
          <span style={{
            background: style.bg, color: style.color,
            fontSize: "11px", fontWeight: "700",
            padding: "4px 12px", borderRadius: "99px"
          }}>
            {style.label}
          </span>
        );
      }
    },
    {
      name: "Acciones",
      cell: (row) => {
        const estadoActual = row.ultimoEstado || "generado";
        const siguientes = estadosSiguientes[estadoActual] || [];
        if (siguientes.length === 0) return <span className="text-muted small">Finalizado</span>;
        return (
          <div className="d-flex gap-1 py-1">
            {siguientes.includes("aceptado") && (
              <button
                className="btn btn-sm text-white fw-bold d-flex align-items-center gap-1 shadow-sm"
                style={{ background: "#0077B6", borderRadius: "8px", border: "none", fontSize: "11px", padding: "6px 10px" }}
                onClick={() => cambiarEstado(row.id_solicitud, "aceptado")}
                title="Aceptar Solicitud"
              >
                <i className="fas fa-check-circle"></i> Aceptar
              </button>
            )}
            {siguientes.includes("cancelado") && (
              <button
                className="btn btn-sm text-white fw-bold d-flex align-items-center gap-1 shadow-sm"
                style={{ background: "#dc2626", borderRadius: "8px", border: "none", fontSize: "11px", padding: "6px 10px" }}
                onClick={() => cambiarEstado(row.id_solicitud, "cancelado")}
                title="Rechazar/Cancelar"
              >
                <i className="fas fa-times-circle"></i> Rechazar
              </button>
            )}
            {siguientes.includes("prestado") && (
              <button
                className="btn btn-sm text-white fw-bold d-flex align-items-center gap-1 shadow-sm"
                style={{ background: "#d97706", borderRadius: "8px", border: "none", fontSize: "11px", padding: "6px 10px" }}
                onClick={() => cambiarEstado(row.id_solicitud, "prestado")}
                title="Entregar Equipo (Prestar)"
              >
                <i className="fas fa-box"></i> Prestar
              </button>
            )}
            {siguientes.includes("entregado") && (
              <button
                className="btn btn-sm text-white fw-bold d-flex align-items-center gap-1 shadow-sm"
                style={{ background: "#059669", borderRadius: "8px", border: "none", fontSize: "11px", padding: "6px 10px" }}
                onClick={() => cambiarEstado(row.id_solicitud, "entregado")}
                title="Recibir Equipo (Liberar)"
              >
                <i className="fas fa-undo"></i> Liberar
              </button>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "200px"
    }
  ];

  useEffect(() => {
    cargarSolicitudes();

    // ✅ Escuchar cambios en tiempo real para refrescar la tabla del administrador
    socket.on('solicitud_actualizada', cargarSolicitudes);

    return () => {
      socket.off('solicitud_actualizada', cargarSolicitudes);
    };
  }, []);

  const cargarSolicitudes = async () => {
    try {
      const token = getToken();
      const res = await apiAxios.get("/api/solicitud", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSolicitudes(res.data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    }
  };

  const cambiarEstado = async (id_solicitud, nuevoEstado) => {
    // Mapeo de estado a id_estado_solicitud
    const mapaEstados = {
      generado: 1,
      aceptado: 2,
      prestado: 3,
      entregado: 5,
      cancelado: 6
    };

    const result = await Swal.fire({
      title: "¿Cambiar estado?",
      text: `La solicitud pasará a "${nuevoEstado.toUpperCase()}"`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    try {
      const token = getToken();
      await apiAxios.post(
        `/api/solicitud/cambiarEstado/${id_solicitud}`,
        { id_estado_solicitud: mapaEstados[nuevoEstado] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "¡Estado actualizado!",
        text: `Solicitud ahora está en "${nuevoEstado}"`,
        timer: 1800,
        showConfirmButton: false
      });

      cargarSolicitudes();
    } catch (error) {
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  const filtered = solicitudes.filter((item) => {
    const search = filterText.toLowerCase().trim();
    return (
      String(item.id_solicitud || "").includes(search) ||
      String(item.usuario?.nombres_apellidos || "").toLowerCase().includes(search) ||
      String(item.ultimoEstado || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mt-4">
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Solicitudes</h2>
      </div>


      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, solicitante o estado..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
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
              <p>No hay solicitudes registradas</p>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default GestionSolicitudes;