import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

const GestionSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filterText, setFilterText] = useState("");

  const getToken = () => sessionStorage.getItem("token");

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

  const estadosSiguientes = {
    generado:  ["aceptado", "cancelado"],
    aceptado:  ["prestado", "cancelado"],
    prestado:  ["entregado", "cancelado"],
    entregado: [],
    cancelado: [],
  };

  const columns = [
    { name: "ID", selector: (row) => row.id_solicitud, sortable: true, width: "80px" },
    {
      name: "Solicitante",
      selector: (row) => row.usuario?.nombres_apellidos || "-",
      sortable: true,
      width: "180px"
    },
    {
      name: "Fecha Inicio",
      selector: (row) => row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleString() : "-",
      sortable: true,
      width: "170px"
    },
    {
      name: "Fecha Fin",
      selector: (row) => row.fecha_fin ? new Date(row.fecha_fin).toLocaleString() : "-",
      sortable: true,
      width: "170px"
    },
    {
      name: "Estado Actual",
      width: "150px",
      center: true,
      cell: (row) => (
        <span className={`badge ${getBadgeColor(row.ultimoEstado)}`} style={{ fontSize: "0.75rem" }}>
          {row.ultimoEstado || "generado"}
        </span>
      )
    },
    {
      name: "Cambiar Estado",
      center: true,
      width: "200px",
      cell: (row) => {
        const estadoActual = row.ultimoEstado || "generado";
        const siguientes = estadosSiguientes[estadoActual] || [];
        if (siguientes.length === 0) return <span className="text-muted small">Sin acciones</span>;
        return (
          <div className="d-flex gap-1 flex-wrap justify-content-center">
            {siguientes.map((estado) => (
              <button
                key={estado}
                className={`btn btn-sm ${getBadgeColor(estado)} text-white`}
                onClick={() => cambiarEstado(row.id_solicitud, estado)}
                style={{ fontSize: "0.7rem" }}
              >
                {estado}
              </button>
            ))}
          </div>
        );
      }
    }
  ];

  useEffect(() => { cargarSolicitudes(); }, []);

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
      generado:  1,
      aceptado:  2,
      prestado:  3,
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

  const filtered = solicitudes.filter((item) =>
    String(item.id_solicitud || "").includes(filterText) ||
    (item.usuario?.nombres_apellidos || "").toLowerCase().includes(filterText.toLowerCase()) ||
    (item.ultimoEstado || "").toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 fw-bold text-primary">Gestión de Solicitudes</h2>
      

      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, solicitante o estado..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-outline-primary" onClick={cargarSolicitudes}>
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
        noDataComponent="No hay solicitudes registradas"
      />
    </div>
  );
};

export default GestionSolicitudes;