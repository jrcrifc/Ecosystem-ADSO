import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";
import socket from "../socket.js";

const GestionSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterText, setFilterText] = useState("");

  const getToken = () => sessionStorage.getItem("token");

  const getBadgeStyle = (estado) => {
    const map = {
      generado: { bg: "#f1f5f9", color: "#475569" },
      aceptado: { bg: "#dbeafe", color: "#0077B6" },
      prestado: { bg: "#fffbeb", color: "#d97706" },
      entregado: { bg: "#ecfdf5", color: "#059669" },
      devuelto: { bg: "#ecfdf5", color: "#059669" },
      cancelado: { bg: "#fef2f2", color: "#dc2626" },
      rechazado: { bg: "#fef2f2", color: "#dc2626" },
    };
    return map[estado] || { bg: "#f1f5f9", color: "#475569" };
  };

  const estadosSiguientes = {
    generado: ["aceptado", "cancelado"],
    aceptado: ["prestado", "cancelado"],
    prestado: ["entregado", "cancelado"],
    entregado: [],
    cancelado: [],
  };

  const columns = [
    { name: "ID", selector: (row) => row.id_solicitud, sortable: true, width: "80px" },
    {
      name: "Solicitante",
      selector: (row) => row.usuario?.nombres_apellidos || "-",
      sortable: true,
      width: "140px",
      wrap: true
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.fecha_inicio ? row.fecha_inicio.substring(0, 10) : "-",
      sortable: true,
      width: "120px",
      wrap: true
    },
    {
      name: "Fecha Fin",
      selector: (row) => row.fecha_fin ? row.fecha_fin.substring(0, 10) : "-",
      sortable: true,
      width: "120px",
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
            {row.ultimoEstado || "generado"}
          </span>
        );
      }
    },
    {
      name: "Acciones",
      cell: (row) => {
        const estadoActual = row.ultimoEstado || "generado";
        const siguientes = estadosSiguientes[estadoActual] || [];
        if (siguientes.length === 0) return <span className="text-muted small">Sin acciones</span>;
        return (
          <div className="dropdown">
            <button className="btn btn-sm text-white dropdown-toggle" style={{ background: "#0077B6" }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fas fa-exchange-alt me-1"></i> Cambiar
            </button>
            <ul className="dropdown-menu">
              {siguientes.map((estado) => (
                <li key={estado}>
                  <button className="dropdown-item" onClick={() => cambiarEstado(row.id_solicitud, estado)}>
                    {estado === "aceptado" && "✅ Aceptado"}
                    {estado === "rechazado" && "🚫 Rechazado"}
                    {estado === "prestado" && "📦 Prestado"}
                    {estado === "entregado" && "🔄 Entregado"}
                    {estado === "cancelado" && "❌ Cancelado"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px"
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