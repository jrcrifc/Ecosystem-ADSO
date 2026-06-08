// Archivo: GestionEstadoEquipo.jsx — Panel para gestionar el estado operativo de equipos (disponible, mantenimiento) con tabs de filtro

// Importa React y hooks de estado y efectos
import React, { useEffect, useState } from "react";
// Importa useNavigate para redirigir entre rutas
import { useNavigate } from "react-router-dom";
// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa DataTable para renderizar tablas con paginación
import DataTable from "react-data-table-component";
// Importa configuraciones predefinidas de paginación y estilos para la tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Configuración visual de los estados operativos
const estadoConfig = {
  disponible:      { icon: "✅", color: "#0077B6", bg: "#e0f2fe", border: "#bae6fd", label: "Disponible" },
  mantenimiento:   { icon: "🔧", color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "Mantenimiento" },
  solicitado:      { icon: "⏳", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "Solicitado" },
  prestado:        { icon: "🤝", color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe", label: "Prestado" },
};

// Mapa de nombres de estado a IDs numéricos
const mapaEstados = { disponible: 1, mantenimiento: 3 };

// Componente principal de gestión de estado de equipos
export default function GestionEstadoEquipo() {
  const navigate = useNavigate();
  // Estado que almacena el listado de equipos
  const [equipos, setEquipos] = useState([]);
  // Estado para el texto de búsqueda
  const [filterText, setFilterText] = useState("");
  // Estado para el tab activo de filtro (todos, disponibles, ocupados, mantenimiento)
  const [activeTab, setActiveTab] = useState("todos");
  // Efecto que carga los equipos al montar el componente
  useEffect(() => { cargarEquipos(); }, []);
  // Función asíncrona para obtener los equipos con su último estado
  const cargarEquipos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Sesión expirada", "Por favor inicia sesión nuevamente", "warning");
        return;
      }
      const res = await apiAxios.get("/api/estadoxequipo/ultimos/estados", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };
  // Función para cambiar el estado operativo de un equipo (disponible ↔ mantenimiento)
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
      const token = sessionStorage.getItem("token");
      await apiAxios.post("/api/estadoxequipo/cambiarEstado",
        { id_equipo, id_estado_equipo: mapaEstados[nuevoEstado] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({ icon: "success", title: "¡Estado actualizado!", timer: 1500, showConfirmButton: false });
      cargarEquipos();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire("Error", error.response?.data?.message || "No se pudo cambiar el estado", "error");
    }
  };
  // Filtra los equipos localmente por texto y por tab activo
  const filtered = equipos.filter(r => {
    const search = filterText.toLowerCase().trim();
    const matchesSearch = (
      String(r.id_equipo || "").includes(search) ||
      String(r.nom_equipo || "").toLowerCase().includes(search) ||
      String(r.no_placa || "").toLowerCase().includes(search) ||
      String(r.marca_equipo || "").toLowerCase().includes(search) ||
      String(r.ultimoEstado || "").toLowerCase().includes(search)
    );
    // Filtra según el tab seleccionado
    if (activeTab === "disponibles") return matchesSearch && r.ultimoEstado === "disponible";
    if (activeTab === "ocupados") return matchesSearch && (r.ultimoEstado === "solicitado" || r.ultimoEstado === "prestado");
    if (activeTab === "mantenimiento") return matchesSearch && r.ultimoEstado === "mantenimiento";
    return matchesSearch;
  });
  // Definición de las columnas de la tabla DataTable
  const columns = [
    {
      name: "Equipo",
      selector: row => row.nom_equipo,
      sortable: true,
    },
    {
      name: "Placa",
      selector: row => row.no_placa && row.no_placa !== '0' && row.no_placa !== 0 ? row.no_placa : "Sin placa",
      sortable: true,
      // Renderiza la placa o un texto gris itálico si no tiene
      cell: row => (
        <span style={{ color: (!row.no_placa || row.no_placa === '0' || row.no_placa === 0) ? "#94a3b8" : "inherit", fontStyle: (!row.no_placa || row.no_placa === '0' || row.no_placa === 0) ? "italic" : "normal" }}>
          {row.no_placa && row.no_placa !== '0' && row.no_placa !== 0 ? row.no_placa : "Sin placa"}
        </span>
      )
    },
    {
      name: "Marca",
      selector: row => row.marca_equipo || "—",
      sortable: true,
    },
    {
      name: "Estado Actual",
      selector: row => row.ultimoEstado || "disponible",
      sortable: true,
      // Renderiza el badge del estado con icono y color
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
      center: true,
      width: "180px",
      // Renderiza botón bloqueado o botones de cambiar estado según disponibilidad
      cell: row => {
        if (row.estaOcupado) {
          return (
            <button 
              className="btn btn-sm" 
              style={{ background: "#f1f5f9", color: "#94a3b8", border: "1px solid #e2e8f0", cursor: "not-allowed" }}
              onClick={() => Swal.fire("Equipo en uso", "No se puede cambiar el estado mientras esté solicitado o prestado.", "info")}
            >
              <i className="fas fa-lock me-1"></i> Bloqueado
            </button>
          );
        }
        return (
          <div className="d-flex gap-2">
            {/* Botón para cambiar a mantenimiento si está disponible */}
            {row.ultimoEstado === "disponible" ? (
              <button 
                className="btn btn-sm" 
                style={{ background: "#fef3c7", color: "#d97706", border: "1px solid #fde68a", fontWeight: "700" }}
                onClick={() => cambiarEstado(row.id_equipo, "mantenimiento")}
              >
                <i className="fas fa-tools me-1"></i> Mantenimiento
              </button>
            ) : (
              // Botón para cambiar a disponible si está en otro estado
              <button 
                className="btn btn-sm" 
                style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0", fontWeight: "700" }}
                onClick={() => cambiarEstado(row.id_equipo, "disponible")}
              >
                <i className="fas fa-check-circle me-1"></i> Disponible
              </button>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
    }
  ];
  return (
    <div className="container mt-4">
      {/* Encabezado de la página con barra decorativa y título */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Estado de Equipos</h2>
      </div>
      {/* Tabs de filtro por categoría */}
      <div className="d-flex gap-2 mb-4">
        {[
          { id: "todos", label: "Todos", icon: "list" },
          { id: "disponibles", label: "Disponibles", icon: "check-circle" },
          { id: "ocupados", label: "En Uso / Solicitados", icon: "user-clock" },
          { id: "mantenimiento", label: "Mantenimiento", icon: "tools" }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "600",
              transition: "all 0.2s",
              border: "1px solid",
              background: activeTab === tab.id ? "#0077B6" : "#fff",
              color: activeTab === tab.id ? "#fff" : "#64748b",
              borderColor: activeTab === tab.id ? "#0077B6" : "#e2e8f0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: activeTab === tab.id ? "0 4px 12px rgba(0, 119, 182, 0.2)" : "none"
            }}
          >
            <i className={`fas fa-${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>
      {/* Fila con campo de búsqueda y botones de navegación */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-7">
          <div className="position-relative">
            <i className="fas fa-search position-absolute top-50 translate-middle-y ms-3" style={{ color: "#94a3b8" }}></i>
            <input 
              type="text" 
              className="form-control ps-5" 
              placeholder="Buscar por nombre, placa, marca..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ borderColor: "#dbeafe", borderRadius: "12px", height: "45px" }}
            />
          </div>
        </div>
        <div className="col-md-5 text-end">
          <div className="btn-group" role="group" style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #0077B6" }}>
            <button type="button" className="btn" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", fontSize: "13px" }}>
              <i className="fas fa-edit me-2"></i>Gestión
            </button>
            <button 
              type="button" 
              className="btn" 
              style={{ background: "#fff", color: "#0077B6", fontWeight: "600", fontSize: "13px" }}
              onClick={() => navigate("/historial-equipo")}
            >
              <i className="fas fa-history me-2"></i>Historial
            </button>
          </div>
        </div>
      </div>
      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ 
        borderRadius: "14px", 
        overflow: "visible",
        border: "1px solid #dbeafe",
        marginBottom: "120px"
      }}>
        <DataTable 
          columns={columns} 
          data={filtered} 
          pagination 
          paginationPerPage={10}
          paginationComponentOptions={paginationComponentOptions}
          customStyles={{
            ...tableCustomStyles,
            rows: {
              style: {
                minHeight: '72px',
              },
            },
          }}
          highlightOnHover 
          striped
          responsive 
          defaultSortFieldId={1}
          defaultSortAsc={false}
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
