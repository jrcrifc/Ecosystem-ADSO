// Archivo: crudequipos.jsx — CRUD de equipos con tabla, filtros, exportación PDF/Excel y lightbox de fotos

// Importa hooks de React para estado y efectos
import { useEffect, useState } from "react";
// Importa useNavigate para redirigir entre rutas
import { useNavigate } from "react-router-dom";
// Importa DataTable para renderizar tablas con paginación
import DataTable from "react-data-table-component";
// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa el formulario de equipo para usarlo dentro del modal
import EquipoForm from "./EquiposForm.jsx";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa Bootstrap para manipular modales
import * as bootstrap from "bootstrap";
// Importa Socket.io para actualizaciones en tiempo real
import socket from "../socket.js";
// Importa utilidades de exportación a PDF y Excel
import { exportToPDF, exportToExcel } from "../api/ExportUtils.js";
// Importa configuraciones predefinidas de paginación y estilos para la tabla
import { paginationComponentOptions, tableCustomStyles } from "../config/dataTableConfig";

// Componente principal del CRUD de equipos
export default function CrudEquipo() {
  const navigate = useNavigate();
  // Estado que almacena el listado de equipos
  const [equipos, setEquipos] = useState([]);
  // Estado para el texto de búsqueda
  const [filterText, setFilterText] = useState("");
  // Estado para la pestaña activa
  const [tabActiva, setTabActiva] = useState('Todos');
  // Estado que almacena el equipo seleccionado para editar
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  // Estado que almacena la ruta de la foto ampliada
  const [largePhoto, setLargePhoto] = useState(null);
  // Estado para visibilidad de modales
  const [showModal, setShowModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  // Efecto que carga los equipos al montar y configura listeners de socket
  useEffect(() => {
    getAllEquipos();
    // Escucha cambios en tiempo real para refrescar la tabla
    socket.on('equipo_actualizado', getAllEquipos);
    // Limpieza de listeners al desmontar el componente
    return () => {
      socket.off('equipo_actualizado', getAllEquipos);
    };
  }, []);
  // Función asíncrona para obtener todos los equipos desde la API
  const getAllEquipos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }
      const res = await apiAxios.get("/api/equipos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEquipos(res.data);
    } catch (error) {
      console.error("Error al cargar equipos:", error);
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    }
  };
  // Función para alternar el estado (Inactivo <-> Disponible | Mantenimiento <-> Disponible)
  const cambiarEstado = async (equipo) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return Swal.fire("Error", "No se encontró token", "warning");

      const estaInactivo = equipo.estado === 0;
      const esMantenimiento = equipo.estadoReal === 'mantenimiento';
      const esDisponible = equipo.estado === 1 && (equipo.estadoReal === 'disponible' || !equipo.estadoReal);

      // Si está inactivo -> Pasa a activo (disponible)
      if (estaInactivo) {
        const result = await Swal.fire({
          title: "¿Activar Equipo?", text: "El equipo pasará a estado DISPONIBLE",
          icon: "question", showCancelButton: true, confirmButtonColor: "#0077B6"
        });
        if (!result.isConfirmed) return;
        
        await apiAxios.put(`/api/equipos/${equipo.id_equipo}`, { estado: 1 }, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire({ icon: "success", title: "Activado", timer: 1500, showConfirmButton: false });
        getAllEquipos();
      }
      // Si está en mantenimiento -> Pasa a disponible
      else if (esMantenimiento) {
        const result = await Swal.fire({
          title: "¿Finalizar Mantenimiento?", text: "El equipo pasará a estado DISPONIBLE",
          icon: "question", showCancelButton: true, confirmButtonColor: "#0077B6",
          confirmButtonText: "Sí, finalizar", cancelButtonText: "Cancelar"
        });
        if (!result.isConfirmed) return;

        await apiAxios.post("/api/estadoxequipo/cambiarEstado", 
          { id_equipo: equipo.id_equipo, id_estado_equipo: 1, observaciones: "Mantenimiento finalizado desde Gestión de Equipos" }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        Swal.fire({ icon: "success", title: "Ahora está Disponible", timer: 1500, showConfirmButton: false });
        getAllEquipos();
      }
      // Si está disponible -> Solo pasa a mantenimiento
      else if (esDisponible) {
        const result = await Swal.fire({
          title: "¿Pasar a Mantenimiento?",
          text: "El equipo pasará al estado de mantenimiento y no estará disponible para solicitudes.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, pasar",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#d97706"
        });

        if (result.isConfirmed) {
          await apiAxios.post("/api/estadoxequipo/cambiarEstado", 
            { id_equipo: equipo.id_equipo, id_estado_equipo: 2, observaciones: "Enviado a mantenimiento desde Gestión de Equipos" }, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire({ icon: "success", title: "En Mantenimiento", timer: 1500, showConfirmButton: false });
          getAllEquipos();
        }
      }

    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire("Error", "No se pudo cambiar el estado", "error");
    }
  };

  // Función para importar equipos desde un archivo Excel
  const handleImportarExcel = async () => {
    const { value: file } = await Swal.fire({
      title: '📥 Importar Equipos desde Excel',
      html: `
        <div style="text-align: left; font-size: 14px; color: #475569; line-height: 1.5;">
          <p>Sube un archivo de Excel (<strong>.xlsx</strong> o <strong>.xls</strong>) con las columnas:</p>
          <ul style="padding-left: 20px; margin-bottom: 12px; font-size: 13px;">
            <li><strong>nombre</strong> (nombre del equipo - obligatorio)</li>
            <li><strong>marca</strong> (opcional)</li>
            <li><strong>placa</strong> (N° placa o serial - opcional)</li>
            <li><strong>cuentadante</strong> (documento del instructor - opcional)</li>
            <li><strong>observaciones</strong> (opcional)</li>
          </ul>
          <p style="font-size: 12px; color: #0284c7; margin-bottom: 0;">
            * El grupo se asignará automáticamente a <strong>Equipo de Laboratorio</strong> y su estado a <strong>Disponible</strong>.
          </p>
        </div>
      `,
      input: 'file',
      inputAttributes: {
        'accept': '.xlsx, .xls',
        'aria-label': 'Subir archivo Excel'
      },
      showCancelButton: true,
      confirmButtonText: 'Subir archivo',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0077B6',
      customClass: { input: 'form-control form-control-sm' }
    });

    if (!file) return;

    Swal.fire({
      title: 'Procesando archivo...',
      text: 'Espere un momento por favor',
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const token = sessionStorage.getItem("token");
      const res = await apiAxios.post("/api/equipos/importar-excel", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      const { creados, omitidos, errores } = res.data.data;

      let htmlResult = `
        <div style="text-align: left; font-size: 14px;">
          <p style="color: #2e7d32; font-weight: 600;">✅ Creados exitosamente: ${creados} equipos</p>
          <p style="color: #64748b;">ℹ️ Omitidos (placa duplicada): ${omitidos} equipos</p>
      `;

      if (errores && errores.length > 0) {
        htmlResult += `
          <hr style="margin: 10px 0; border-top: 1px solid #cbd5e1;"/>
          <p style="color: #c62828; font-weight: bold; margin-bottom: 5px;">⚠️ Advertencias/Errores (${errores.length}):</p>
          <div style="max-height: 150px; overflow-y: auto; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 10px; font-size: 11.5px; font-family: monospace; color: #9f1239; line-height: 1.4;">
            ${errores.map(e => `• ${e}`).join('<br/>')}
          </div>
        `;
      }
      htmlResult += `</div>`;

      Swal.fire({
        title: '¡Importación Finalizada!',
        html: htmlResult,
        icon: creados > 0 ? 'success' : 'info',
        confirmButtonColor: '#0077B6'
      });

      getAllEquipos();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Error al procesar el archivo Excel", "error");
    }
  };

  // Función para cerrar los modales
  const hideModal = () => {
    setShowModal(false);
    setShowPhotoModal(false);
    setSelectedEquipo(null);
    setLargePhoto(null);
  };
  // Configuración visual de los estados operativos
  const estadoConfig = {
    disponible:      { icon: "✅", color: "#0077B6", bg: "#e0f2fe", border: "#bae6fd", label: "Disponible" },
    mantenimiento:   { icon: "🔧", color: "#d97706", bg: "#fef3c7", border: "#fde68a", label: "Mantenimiento" },
    solicitado:      { icon: "⏳", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe", label: "Solicitado" },
    prestado:        { icon: "🤝", color: "#ca8a04", bg: "#fef08a", border: "#fde047", label: "Prestado" },
    inactivo:        { icon: "🚫", color: "#dc2626", bg: "#fee2e2", border: "#fecaca", label: "Inactivo" },
  };
  // Definición de las columnas de la tabla DataTable
  const columns = [
    { name: "ID", selector: (row) => row.id_equipo, sortable: true, width: "80px", center: true },
    {
      name: "Foto",
      width: "100px",
      center: true,
      // Renderiza la foto del equipo con lightbox al hacer clic
      cell: (row) => (
        <div style={{ padding: "5px", cursor: row.foto_equipo ? "pointer" : "default" }}>
          {row.foto_equipo ? (
            <img
              src={row.foto_equipo.startsWith("http") ? row.foto_equipo : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${row.foto_equipo}`}
              alt={row.nom_equipo || "Foto del equipo"}
              style={{
                width: "45px",
                height: "45px",
                objectFit: "cover",
                borderRadius: "6px",
                border: "2px solid #0077B6",
                transition: "transform 0.2s",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
              onClick={() => {
                const imgUrl = row.foto_equipo.startsWith("http") ? row.foto_equipo : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${row.foto_equipo}`;
                setLargePhoto(imgUrl);
                setShowPhotoModal(true);
              }}
              onError={(e) => { e.target.src = "/img/no-image.png"; }}
            />
          ) : (
            <span style={{ color: "#999", fontSize: "12px" }}>Sin foto</span>
          )}
        </div>
      ),
    },
    { name: "Grupo", selector: (row) => row.grupo_equipo, sortable: true, minWidth: "180px" },
    { name: "Nombre", selector: (row) => row.nom_equipo, sortable: true, minWidth: "180px" },
    { name: "Marca", selector: (row) => row.marca_equipo || "-", sortable: true, minWidth: "130px" },
    {
      name: "Placa",
      selector: (row) => (row.no_placa && row.no_placa !== 0 && row.no_placa !== '0') ? row.no_placa : "Sin placa",
      sortable: true,
      minWidth: "130px",
      // Renderiza la placa o un texto gris si no tiene
      cell: (row) => {
        const placa = (row.no_placa && row.no_placa !== 0 && row.no_placa !== '0') ? row.no_placa : null;
        return placa
          ? <span>{placa}</span>
          : <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: "12px" }}>Sin placa</span>;
      }
    },
    {
      name: "Cuentadante",
      selector: (row) => row.instructor
        ? `${row.instructor.nombres_apellidos} (${row.instructor.documento})`
        : "-",
      sortable: true,
      minWidth: "200px"
    },
    {
      name: "Observaciones",
      selector: (row) => row.observaciones || "-",
      sortable: true,
      minWidth: "180px",
      wrap: true
    },
    {
      name: "Estado",
      selector: (row) => row.estado === 0 ? "inactivo" : (row.estadoReal || "disponible"),
      sortable: true,
      center: true,
      minWidth: "150px",
      // Renderiza el badge del estado operativo con icono y color
      cell: (row) => {
        const estado = row.estado === 0 ? "inactivo" : (row.estadoReal || "disponible");
        const cfg = estadoConfig[estado] || estadoConfig.disponible;
        return (
          <span style={{
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
            padding: "4px 12px", borderRadius: "99px", fontSize: "12px",
            fontWeight: "700"
          }}>
            {cfg.icon} {cfg.label.toUpperCase()}
          </span>
        );
      },
    },
    {
      name: "Acciones",
      center: true,
      width: "140px",
      cell: (row) => {
        const estadoActual = row.estado === 0 ? "inactivo" : (row.estadoReal || "disponible");
        const estaOcupado = row.estaOcupado;
        const esMantenimiento = estadoActual === 'mantenimiento';
        const esDisponible = estadoActual === 'disponible';
        const esInactivo = estadoActual === 'inactivo';

        if (estaOcupado) {
          return (
            <span style={{ fontSize: "11px", color: "#94a3b8", fontStyle: "italic" }}>
              <i className="fa-solid fa-lock me-1"></i> En uso
            </span>
          );
        }

        return (
          <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>

            {/* Editar: siempre visible */}
            <button
              className="btn btn-sm"
              style={{ background: "#dbeafe", color: "#0077B6", border: "none", padding: "6px 9px", borderRadius: "7px" }}
              onClick={() => { setSelectedEquipo(row); setShowModal(true); }}
              title="Editar equipo"
            >
              <i className="fa-solid fa-pencil" style={{ fontSize: "12px" }}></i>
            </button>

            {/* Disponible: 🔧 Mantenimiento + 🚫 Inactivar */}
            {esDisponible && (
              <>
                <button
                  className="btn btn-sm"
                  style={{ background: "#fef3c7", color: "#d97706", border: "none", padding: "6px 9px", borderRadius: "7px" }}
                  onClick={() => cambiarEstado(row)}
                  title="Pasar a mantenimiento"
                >
                  <i className="fa-solid fa-wrench" style={{ fontSize: "12px" }}></i>
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 9px", borderRadius: "7px" }}
                  onClick={async () => {
                    const token = sessionStorage.getItem("token");
                    const r = await Swal.fire({ title: "¿Inactivar equipo?", text: "El equipo pasará a inactivo.", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Inactivar", cancelButtonText: "Cancelar" });
                    if (!r.isConfirmed) return;
                    await apiAxios.put(`/api/equipos/${row.id_equipo}`, { estado: 0 }, { headers: { Authorization: `Bearer ${token}` } });
                    Swal.fire({ icon: "success", title: "Inactivado", timer: 1500, showConfirmButton: false });
                    getAllEquipos();
                  }}
                  title="Inactivar equipo"
                >
                  <i className="fa-solid fa-ban" style={{ fontSize: "12px" }}></i>
                </button>
              </>
            )}

            {/* Mantenimiento: ✅ Finalizar + 🚫 Inactivar */}
            {esMantenimiento && (
              <>
                <button
                  className="btn btn-sm"
                  style={{ background: "#dcfce7", color: "#16a34a", border: "none", padding: "6px 9px", borderRadius: "7px" }}
                  onClick={() => cambiarEstado(row)}
                  title="Finalizar mantenimiento (pasar a Disponible)"
                >
                  <i className="fa-solid fa-check" style={{ fontSize: "12px" }}></i>
                </button>
                <button
                  className="btn btn-sm"
                  style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 9px", borderRadius: "7px" }}
                  onClick={async () => {
                    const token = sessionStorage.getItem("token");
                    const r = await Swal.fire({ title: "¿Inactivar equipo?", text: "El equipo pasará a inactivo.", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", confirmButtonText: "Inactivar", cancelButtonText: "Cancelar" });
                    if (!r.isConfirmed) return;
                    await apiAxios.put(`/api/equipos/${row.id_equipo}`, { estado: 0 }, { headers: { Authorization: `Bearer ${token}` } });
                    Swal.fire({ icon: "success", title: "Inactivado", timer: 1500, showConfirmButton: false });
                    getAllEquipos();
                  }}
                  title="Inactivar equipo"
                >
                  <i className="fa-solid fa-ban" style={{ fontSize: "12px" }}></i>
                </button>
              </>
            )}

            {/* Inactivo: solo ✅ Activar */}
            {esInactivo && (
              <button
                className="btn btn-sm"
                style={{ background: "#dcfce7", color: "#16a34a", border: "none", padding: "6px 9px", borderRadius: "7px" }}
                onClick={async () => {
                  const token = sessionStorage.getItem("token");
                  const r = await Swal.fire({ title: "¿Activar equipo?", text: "El equipo pasará a disponible.", icon: "question", showCancelButton: true, confirmButtonColor: "#0077B6", confirmButtonText: "Activar", cancelButtonText: "Cancelar" });
                  if (!r.isConfirmed) return;
                  await apiAxios.put(`/api/equipos/${row.id_equipo}`, { estado: 1 }, { headers: { Authorization: `Bearer ${token}` } });
                  Swal.fire({ icon: "success", title: "Activado", timer: 1500, showConfirmButton: false });
                  getAllEquipos();
                }}
                title="Activar equipo"
              >
                <i className="fa-solid fa-check" style={{ fontSize: "12px" }}></i>
              </button>
            )}

          </div>
        );
      },
    },
  ];
  // Función que formatea los datos de equipos para exportación PDF/Excel
  const formatEquiposForExport = (data) => {
    return data.map(row => ({
      "ID": row.id_equipo,
      "Grupo": row.grupo_equipo || "-",
      "Nombre": row.nom_equipo || "-",
      "Marca": row.marca_equipo || "-",
      "Placa": (row.no_placa && row.no_placa !== 0 && row.no_placa !== '0') ? row.no_placa : "Sin placa",
      "Cuentadante": row.instructor ? `${row.instructor.nombres_apellidos}` : "-",
      "Observaciones": row.observaciones || "-",
      "Estado Equipo": row.estado === 1 ? "Activo" : "Inactivo",
      "Estado Operativo": (row.estadoReal || "disponible").charAt(0).toUpperCase() + (row.estadoReal || "disponible").slice(1),
    }));
  };
  // Filtra los equipos localmente según la pestaña y el texto de búsqueda
  const filteredEquipos = equipos.filter((row) => {
    // 1. Filtrado por Pestaña
    const estado = row.estado === 0 ? "inactivo" : (row.estadoReal || "disponible");
    let matchTab = false;
    if (tabActiva === 'Todos') matchTab = true;
    else if (tabActiva === 'Disponibles') matchTab = estado === 'disponible';
    else if (tabActiva === 'En mantenimiento') matchTab = estado === 'mantenimiento';
    else if (tabActiva === 'Inactivos') matchTab = estado === 'inactivo';
    else if (tabActiva === 'Solicitados/Prestados') matchTab = estado === 'solicitado' || estado === 'prestado';

    if (!matchTab) return false;

    // 2. Filtrado por Búsqueda de Texto
    const search = filterText.toLowerCase().trim();
    const nombreCuentadante = row.instructor ? `${row.instructor.nombres_apellidos}` : "";
    return (
      String(row.id_equipo || "").includes(search) ||
      String(row.nom_equipo || "").toLowerCase().includes(search) ||
      String(row.grupo_equipo || "").toLowerCase().includes(search) ||
      String(row.marca_equipo || "").toLowerCase().includes(search) ||
      String(row.no_placa || "").toLowerCase().includes(search) ||
      nombreCuentadante.toLowerCase().includes(search)
    );
  });
  return (
    <div className="container mt-4" style={{ maxWidth: "1150px" }}>
      {/* Encabezado de la página con título y descripción */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Equipos</h2>
        <p style={{ color: "#64748b", marginTop: "8px", fontSize: "14px" }}>
          Administra el inventario de equipos y herramientas del laboratorio.
        </p>
      </div>
      {/* Fila con el campo de búsqueda y botones de acción */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por ID, nombre, grupo, marca, placa o cuentadante..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>
        <div className="col-md-6 text-end d-flex gap-2 justify-content-end flex-wrap">
          <button 
            className="btn btn-outline-primary" 
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={() => navigate("/gestion-equipo")}
          >
            <i className="fas fa-exchange-alt me-2"></i>Estados
          </button>
          <button 
            className="btn btn-outline-danger" 
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={() => {
            const cols = [
              { header: "ID", dataKey: "ID" },
              { header: "Grupo", dataKey: "Grupo" },
              { header: "Nombre", dataKey: "Nombre" },
              { header: "Marca", dataKey: "Marca" },
              { header: "Placa", dataKey: "Placa" },
              { header: "Cuentadante", dataKey: "Cuentadante" },
              { header: "Observaciones", dataKey: "Observaciones" },
              { header: "Estado Equipo", dataKey: "Estado Equipo" },
              { header: "Estado Operativo", dataKey: "Estado Operativo" },
            ];
            exportToPDF(formatEquiposForExport(filteredEquipos), cols, "Inventario_Equipos", "INVENTARIO DE EQUIPOS");
          }}>
            <i className="fa-solid fa-file-pdf me-2"></i> PDF
          </button>
          <button 
            className="btn btn-outline-success" 
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={() => exportToExcel(formatEquiposForExport(filteredEquipos), "Inventario_Equipos")}
          >
            <i className="fa-solid fa-file-excel me-2"></i> Excel
          </button>
          <button 
            className="btn btn-outline-secondary" 
            style={{ fontWeight: "600", borderRadius: "10px" }}
            onClick={handleImportarExcel} title="Importar equipos desde archivo Excel"
          >
            <i className="fa-solid fa-file-import me-2"></i> Importar Excel
          </button>
          <button
            className="btn"
            style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
            onClick={() => { setSelectedEquipo(null); setShowModal(true); }}
          >
            + Nuevo Equipo
          </button>
        </div>
      </div>

      {/* Navegación por pestañas con mejor diseño */}
      <div style={{ display: "flex", gap: "0", marginBottom: "20px", background: "#f1f5f9", borderRadius: "14px", padding: "6px", overflowX: "auto" }}>
        {[
          { key: 'Todos',                icon: '📊', count: equipos.length },
          { key: 'Disponibles',          icon: '✅', count: equipos.filter(r => r.estado !== 0 && (r.estadoReal || 'disponible') === 'disponible').length },
          { key: 'En mantenimiento',     icon: '🔧', count: equipos.filter(r => r.estadoReal === 'mantenimiento').length },
          { key: 'Solicitados/Prestados',icon: '⏳', count: equipos.filter(r => ['solicitado','prestado'].includes(r.estadoReal)).length },
          { key: 'Inactivos',            icon: '🚫', count: equipos.filter(r => r.estado === 0).length },
        ].map(({ key, icon, count }) => (
          <button
            key={key}
            onClick={() => setTabActiva(key)}
            style={{
              flex: 1, padding: "10px 12px", border: "none",
              background: tabActiva === key ? "#fff" : "transparent",
              color: tabActiva === key ? "#0077B6" : "#64748b",
              fontWeight: "700", borderRadius: "10px", cursor: "pointer",
              boxShadow: tabActiva === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap", fontSize: "12px",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"
            }}
          >
            <span>{icon}</span>
            <span>{key}</span>
            <span style={{
              background: tabActiva === key ? "#0077B6" : "#cbd5e1",
              color: "#fff", fontSize: "10px", fontWeight: "800",
              padding: "1px 7px", borderRadius: "99px", minWidth: "18px", textAlign: "center"
            }}>{count}</span>
          </button>
        ))}
      </div>

      {/* Contenedor de la tabla con bordes redondeados */}
      <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #dbeafe" }}>
        <DataTable
          columns={columns}
          data={filteredEquipos}
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
              <p>No hay equipos registrados</p>
            </div>
          }
        />
      </div>
      {/* Modal editar/crear equipo */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "700px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #0077B6, #023E8A)",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  {selectedEquipo ? "✏️ Editar Equipo" : "➕ Nuevo Equipo"}
                </h5>
                <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "12px" }}>
                  Gestiona la información del equipo
                </p>
              </div>
              <button onClick={hideModal}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕
              </button>
            </div>
            <div style={{ overflowY: "auto", padding: "0" }}>
              <EquipoForm
                selectedEquipo={selectedEquipo}
                refreshParent={getAllEquipos}
                hideModal={hideModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lightbox para foto ampliada */}
      {showPhotoModal && largePhoto && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }}>
            <button onClick={hideModal}
              style={{ position: "absolute", top: "-40px", right: "0", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                width: "36px", height: "36px", color: "#fff", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕
            </button>
            <img
              src={largePhoto.startsWith("http") ? largePhoto : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${largePhoto}`}
              alt="Foto del equipo"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "12px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
              onError={(e) => { e.target.src = "/img/no-image.png"; }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
