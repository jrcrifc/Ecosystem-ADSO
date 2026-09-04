// Archivo de panel de gestion de usuarios con aprobar, rechazar, activar, inactivar e importar Excel

// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa la instancia centralizada de Socket.IO
import socket from "../socket.js";

// Importa los subcomponentes de formación para renderizar en pestañas
import Instructores from "./Instructores.jsx";

// Define el componente principal de gestion de usuarios
export default function GestionUsuarios() {
  // Estado que almacena los usuarios pendientes de aprobacion
  const [usuariosPendientes, setUsuariosPendientes] = useState([]);
  // Estado que almacena todos los usuarios para la pestana de gestion
  const [todosUsuarios, setTodosUsuarios] = useState([]);
  // Estado que almacena el texto de busqueda para filtrar usuarios
  const [filterText, setFilterText] = useState("");
  // Estado que controla la pestana activa
  const [tab, setTab] = useState("instructores");
  // Estado para la pagina actual de la paginacion
  const [page, setPage] = useState(1);
  const perPage = 20;
  // Obtiene el token de autenticacion desde sessionStorage
  const token = sessionStorage.getItem("token");
  // Prepara el encabezado de autorizacion con el token
  const headers = { Authorization: `Bearer ${token}` };

  // ===== Modal de registro manual de Pasante/Gestor =====
  // Controla la visibilidad del modal de registro
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  // Pestaña activa dentro del modal (Pasante | Gestor)
  const [registerTab, setRegisterTab] = useState("Pasante");
  // Estado del formulario de registro
  const [registerForm, setRegisterForm] = useState({
    tipo_documento: "CC",
    documento: "",
    nombres_apellidos: "",
    email: "",
    password: "",
    es_sena_empresa: "no",
  });
  // Controla el loading del formulario de registro
  const [registerLoading, setRegisterLoading] = useState(false);

  // Efecto que carga los usuarios cada vez que cambia la pestana activa
  useEffect(() => { cargar(); setPage(1); }, [tab]);
  // Resetear pagina cuando cambia el filtro de busqueda
  useEffect(() => { setPage(1); }, [filterText]);

  // Actualizacion en tiempo real al recibir notificaciones por socket
  useEffect(() => {
    // Manejador de notificaciones entrantes
    const handleNotification = (nueva) => {
      // Si la notificacion es sobre un nuevo acceso, recarga la lista
      if (nueva.tipo === "solicitud_acceso") {
        cargar();
      }
    };

    // Escucha el evento de notificacion del socket
    socket.on("notification", handleNotification);

    // Limpieza al desmontar el componente
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [tab]);

  // ===== Ordenar usuarios por estado =====

  // Funcion que ordena los usuarios segun la prioridad de su estado
  const ordenarUsuarios = (lista) => {
    // Define pesos para cada estado (menor = mas prioritario)
    const pesos = {
      aprobado: 1,
      pendiente: 2,
      inactivo: 3,
      rechazado: 4
    };
    // Retorna una copia ordenada de la lista
    return [...lista].sort((a, b) => {
      const pesoA = pesos[a.estado] || 99;
      const pesoB = pesos[b.estado] || 99;
      return pesoA - pesoB;
    });
  };

  // Funcion asincrona para cargar los usuarios segun la pestana activa
  const cargar = async () => {
    try {
      // Si la pestana activa es pendientes, carga solo los usuarios pendientes
      if (tab === "pendientes") {
        const resUsuarios = await apiAxios.get("/api/auth/usuarios", { headers });
        let pendientes = resUsuarios.data.filter(u =>
          ['Pasante', 'Gestor', 'Aprendiz', 'Instructor'].includes(u.rol) &&
          u.estado === 'pendiente'
        );
        pendientes = ordenarUsuarios(pendientes);
        setUsuariosPendientes(pendientes);
      }

      // Si la pestana activa es alguna de las de rol, carga todos los usuarios excepto Administrador
      if (["instructores", "gestores", "pasantes"].includes(tab)) {
        const resUsuarios = await apiAxios.get("/api/auth/usuarios", { headers });
        let filtrados = resUsuarios.data.filter(u => u.rol !== 'Administrador');
        filtrados = ordenarUsuarios(filtrados);
        setTodosUsuarios(filtrados);
      }
    } catch {
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudieron cargar los datos", "error");
    }
  };

  // ===== Aprobar solicitud de acceso de un usuario =====

  // Funcion asincrona para aprobar la solicitud de acceso de un usuario
  const aprobarUsuario = async (id_usuario) => {
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: "¿Aprobar usuario?", icon: "question",
      showCancelButton: true, confirmButtonColor: "#0077B6",
      confirmButtonText: "Sí, aprobar", cancelButtonText: "Cancelar"
    });
    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;
    try {
      // Envia peticion PUT para aprobar al usuario
      await apiAxios.put(`/api/auth/usuarios/${id_usuario}/aprobar`, {}, { headers });
      Swal.fire("✅ Aprobado", "El usuario ya puede acceder al sistema", "success");
      // Recarga la lista de usuarios
      cargar();
    } catch (err) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  // ===== Rechazar solicitud de acceso de un usuario =====

  // Funcion asincrona para rechazar la solicitud de acceso de un usuario
  const rechazarUsuario = async (id_usuario) => {
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: "¿Rechazar usuario?", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, rechazar", cancelButtonText: "Cancelar"
    });
    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;
    try {
      // Envia peticion PUT para rechazar al usuario
      await apiAxios.put(`/api/auth/usuarios/${id_usuario}/rechazar`, {}, { headers });
      Swal.fire("Rechazado", "El usuario fue rechazado", "info");
      // Recarga la lista de usuarios
      cargar();
    } catch (err) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  // Funcion asincrona para alternar activo/inactivo de un usuario
  const toggleActivo = async (id_usuario, estadoActual) => {
    if (!id_usuario) {
      Swal.fire("Error en cliente", "El ID del usuario es inválido o no está definido.", "error");
      return;
    }
    // Determina si se va a activar o inactivar
    const activar = estadoActual === 'inactivo';
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: activar ? "¿Activar usuario?" : "¿Inactivar usuario?",
      text: activar
        ? "El usuario podrá iniciar sesión nuevamente"
        : "El usuario no podrá iniciar sesión hasta que lo reactives",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: activar ? "#0077B6" : "#f59e0b",
      confirmButtonText: activar ? "Sí, activar" : "Sí, inactivar",
      cancelButtonText: "Cancelar"
    });
    // Sale si el usuario cancelo la confirmacion
    if (!result.isConfirmed) return;
    try {
      // Envia peticion PUT para cambiar el estado del usuario
      const res = await apiAxios.put(`/api/auth/usuarios/${id_usuario}/toggle-activo`, {}, { headers });
      Swal.fire({
        icon: "success",
        title: res.data.estado === 'inactivo' ? "Usuario inactivado" : "Usuario activado",
        timer: 1500, showConfirmButton: false
      });
      // Recarga la lista de usuarios
      cargar();
    } catch (err) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", err.response?.data?.message, "error");
    }
  };

  // ===== Cambiar contraseña de un usuario (Solo Admin) =====
  const cambiarPasswordAdmin = async (id_usuario) => {
    const { value: nuevaPassword } = await Swal.fire({
      title: 'Cambiar Contraseña',
      input: 'password',
      inputLabel: 'Nueva contraseña',
      inputPlaceholder: 'Mínimo 8 caracteres',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) return 'Debes ingresar una contraseña';
        if (value.length < 8) return 'La contraseña debe tener mínimo 8 caracteres';
      }
    });

    if (nuevaPassword) {
      try {
        await apiAxios.put(`/api/auth/usuarios/${id_usuario}/change-password`, { nuevaPassword }, { headers });
        Swal.fire('¡Éxito!', 'La contraseña se ha actualizado correctamente.', 'success');
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || 'Error al cambiar la contraseña', 'error');
      }
    }
  };

  // ===== Importar usuarios desde archivo Excel =====

  // Funcion asincrona para manejar la importacion de usuarios desde Excel
  const handleImportarExcel = async () => {
    // Muestra dialogo de SweetAlert para seleccionar archivo
    const { value: file } = await Swal.fire({
      title: '📥 Importar Usuarios desde Excel',
      html: `
        <div style="text-align: left; font-size: 14px; color: #475569; line-height: 1.5;">
          <p>Sube un archivo de Excel (<strong>.xlsx</strong> o <strong>.xls</strong>) con las siguientes columnas:</p>
          <ul style="padding-left: 20px; margin-bottom: 15px; font-size: 13px;">
            <li><strong>documento</strong> (identificación, solo números)</li>
            <li><strong>nombres_apellidos</strong> (nombre completo)</li>
            <li><strong>email</strong> (correo único)</li>
            <li><strong>rol</strong> (Aprendiz, Pasante, Gestor, Instructor)</li>
            <li><strong>numero_ficha</strong> (opcional)</li>
            <li><strong>nombre_ficha</strong> (opcional)</li>
            <li><strong>es_sena_empresa</strong> (opcional: si/no)</li>
          </ul>
          <p style="font-size: 12px; color: #dc3545; font-weight: 600;">
            * Nota: La contraseña predeterminada del usuario será: <strong>Sena[Documento]</strong> (Ej: Sena123456789).
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
      customClass: {
        input: 'form-control form-control-sm'
      }
    });

    // Sale si no se selecciono ningun archivo
    if (!file) return;

    // Muestra indicador de carga mientras se procesa el archivo
    Swal.fire({
      title: 'Procesando archivo...',
      text: 'Espere un momento por favor',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Prepara el FormData para enviar el archivo
    const formData = new FormData();
    formData.append('archivo', file);

    try {
      // Envia peticion POST para importar el archivo Excel
      const res = await apiAxios.post("/api/auth/usuarios/importar-excel", formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data"
        }
      });

      // Extrae los resultados de la importacion
      const { creados, omitidos, errores } = res.data.data;

      // Construye el HTML del resultado para mostrar en SweetAlert
      let htmlResult = `
        <div style="text-align: left; font-size: 14px;">
          <p style="color: #2e7d32; font-weight: 600;">✅ Creados exitosamente: ${creados} usuarios</p>
          <p style="color: #64748b;">ℹ️ Omitidos (ya existen): ${omitidos} usuarios</p>
      `;

      // Agrega seccion de errores si existen
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

      // Muestra el resultado de la importacion
      Swal.fire({
        title: '¡Importación Finalizada!',
        html: htmlResult,
        icon: (errores && errores.length > 0) ? 'warning' : 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#0077B6'
      });

      // Recarga la lista de usuarios
      cargar();
    } catch (err) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", err.response?.data?.message || "Ocurrió un error al procesar el archivo Excel", "error");
    }
  };

  // ===== Registrar manualmente un Pasante o Gestor =====

  // Resetea el formulario de registro al cerrar o cambiar de pestaña
  const resetRegisterForm = () => setRegisterForm({
    tipo_documento: "CC",
    documento: "",
    nombres_apellidos: "",
    email: "",
    password: "",
    es_sena_empresa: "no",
  });

  // Maneja el envio del formulario de registro manual
  const handleRegistrarUsuario = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      await apiAxios.post("/api/auth", {
        ...registerForm,
        rol: registerTab,
        estado: "aprobado",
      }, { headers });
      Swal.fire({
        icon: "success",
        title: `✅ ${registerTab} registrado`,
        text: `El usuario fue creado correctamente y ya está aprobado.`,
        confirmButtonColor: "#0077B6",
      });
      setShowRegisterModal(false);
      resetRegisterForm();
      cargar();
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "No se pudo registrar el usuario", "error");
    } finally {
      setRegisterLoading(false);
    }
  };

  // ===== Renderizar badge de estado del usuario =====

  // Funcion que renderiza un badge visual segun el estado del usuario
  const estadoBadge = (estado) => {
    // Mapa de estilos para cada estado posible
    const map = {
      pendiente: ["#fffbeb", "#d97706", "⏳ Pendiente"],
      aprobado: ["#ecfdf5", "#059669", "✅ Activo"],
      rechazado: ["#fef2f2", "#dc2626", "❌ Rechazado"],
      inactivo: ["#f1f5f9", "#64748b", "⏸️ Inactivo"]
    };
    const [bg, color, label] = map[estado] || ["#f5f5f5", "#666", estado];
    return <span style={{ background: bg, color, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "99px" }}>{label}</span>;
  };

  // ===== Gradiente de color segun el rol =====

  // Funcion que retorna un gradiente de color segun el rol del usuario
  const gradientFor = (rol) => {
    return "#0077B6";
  };

  // ===== Definicion de secciones por rol =====

  // Define las secciones de roles con sus propiedades visuales
  const rolSections = [
    { key: "Gestor",     icon: "🔑", label: "Gestores",     color: "#0077B6" },
    { key: "Pasante",    icon: "🔬", label: "Pasantes",     color: "#0077B6" },
    { key: "Instructor", icon: "👨‍🏫", label: "Instructores", color: "#0077B6" },
  ];

  // ===== Renderizar tarjeta de usuario =====

  // Funcion que renderiza una tarjeta visual para un usuario
  const cardUsuario = (u) => (
    <div key={u.id_usuario} style={{
      background: "#fff", borderRadius: "16px", padding: "24px",
      marginBottom: "14px", border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
    }}>
      {/* Encabezado de la tarjeta con avatar, nombre y badge de estado */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Avatar circular con inicial del usuario */}
          <div style={{
            width: "48px", height: "48px", borderRadius: "50%",
            background: gradientFor(u.rol),
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: "800", fontSize: "18px"
          }}>
            {u.nombres_apellidos?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 style={{ margin: "0 0 2px", fontWeight: "700", color: "#0f172a" }}>{u.nombres_apellidos}</h5>
            <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#64748b" }}>{u.email} · {u.documento}</p>
            <span style={{
              background: "#eef2ff", color: "#0077B6",
              fontSize: "11px", fontWeight: "700", padding: "2px 10px", borderRadius: "99px"
            }}>⚙️ {u.rol}</span>
          </div>
        </div>
        {estadoBadge(u.estado)}
      </div>

      {/* Informacion adicional de ficha si existe */}
      {(u.numero_ficha || u.nombre_ficha) && (
        <div style={{
          marginTop: "10px", background: "#f0fdf4", borderRadius: "10px",
          padding: "10px 14px", border: "1px solid #dcfce7", display: "flex", gap: "16px", flexWrap: "wrap"
        }}>
          {u.numero_ficha && (
            <span style={{ fontSize: "12px", color: "#166534" }}>
              🆔 <strong>Ficha:</strong> {u.numero_ficha}
            </span>
          )}
          {u.nombre_ficha && (
            <span style={{ fontSize: "12px", color: "#166534" }}>
              📋 <strong>Nombre Ficha:</strong> {u.nombre_ficha}
            </span>
          )}
          {u.es_sena_empresa !== undefined && (
            <span style={{ fontSize: "12px", color: "#166534" }}>
              🏢 <strong>SENA Empresa:</strong> {u.es_sena_empresa ? "Sí" : "No"}
            </span>
          )}
        </div>
      )}

      {/* Botones de accion segun el estado del usuario */}
      <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>
        {/* Botones de aprobar y rechazar para usuarios pendientes */}
        {u.estado === 'pendiente' && (
          <>
            <button onClick={() => aprobarUsuario(u.id_usuario)} style={{
              background: "#0077B6",
              border: "none", borderRadius: "10px", padding: "10px 24px",
              color: "#fff", fontWeight: "700", cursor: "pointer", fontSize: "13px"
            }}>✅ Aprobar</button>
            <button onClick={() => rechazarUsuario(u.id_usuario)} style={{
              background: "#fff", border: "1px solid #ef4444",
              borderRadius: "10px", padding: "10px 24px",
              color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "13px"
            }}>❌ Rechazar</button>
          </>
        )}
        {/* Boton de activar/inactivar para usuarios aprobados o inactivos */}
        {(u.estado === 'aprobado' || u.estado === 'inactivo') && (
          <button onClick={() => toggleActivo(u.id_usuario, u.estado)} style={{
            background: u.estado === 'inactivo' ? "#dcfce7" : "#fee2e2",
            border: "none",
            borderRadius: "10px", padding: "10px 24px",
            color: u.estado === 'inactivo' ? "#16a34a" : "#dc2626",
            fontWeight: "700", cursor: "pointer", fontSize: "13px"
          }}>
            <i className={`fas ${u.estado === 'inactivo' ? "fa-check" : "fa-ban"} me-2`}></i>
            {u.estado === 'inactivo' ? "Activar" : "Inactivar"}
          </button>
        )}
        {/* Boton para cambiar contraseña (solo en gestión o si está aprobado/inactivo) */}
        {(u.estado === 'aprobado' || u.estado === 'inactivo') && (
          <button onClick={() => cambiarPasswordAdmin(u.id_usuario)} style={{
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: "10px", padding: "10px 24px",
            color: "#475569",
            fontWeight: "700", cursor: "pointer", fontSize: "13px"
          }}>
            🔑 Cambiar Clave
          </button>
        )}
      </div>
    </div>
  );

  // Renderiza la interfaz del componente
  return (
    <div className="container mt-4">
      {/* Encabezado con barra decorativa y titulo principal */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0077B6", margin: 0 }}>Gestión de Usuarios</h2>
      </div>
      <p style={{ color: "#64748b", marginBottom: "24px" }}>Aprueba, rechaza, activa o inactiva usuarios del sistema</p>

      {/* Barra de búsqueda — visible en pendientes, gestores y pasantes */}
      {["pendientes", "gestores", "pasantes"].includes(tab) && (
        <div className="row mb-4 align-items-center">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID, nombre, documento o email..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 15px" }}
            />
          </div>
          <div className="col-md-5 text-end" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>

            {/* Botón "Registrar Gestor" — solo en pestaña Gestores */}
            {tab === "gestores" && (
              <button
                onClick={() => { resetRegisterForm(); setRegisterTab("Gestor"); setShowRegisterModal(true); }}
                className="btn text-white"
                style={{
                  background: "linear-gradient(135deg, #0077B6, #023E8A)",
                  borderRadius: "10px", fontWeight: "600", padding: "10px 20px",
                  border: "none", boxShadow: "0 2px 4px rgba(0,119,182,0.25)",
                  transition: "transform 0.15s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                🔑 Registrar Gestor
              </button>
            )}

            {/* Botón "Registrar Pasante" — solo en pestaña Pasantes */}
            {tab === "pasantes" && (
              <button
                onClick={() => { resetRegisterForm(); setRegisterTab("Pasante"); setShowRegisterModal(true); }}
                className="btn text-white"
                style={{
                  background: "linear-gradient(135deg, #059669, #065f46)",
                  borderRadius: "10px", fontWeight: "600", padding: "10px 20px",
                  border: "none", boxShadow: "0 2px 4px rgba(5,150,105,0.25)",
                  transition: "transform 0.15s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                🔬 Registrar Pasante
              </button>
            )}

            {/* Botón Importar Excel — solo en pestaña Solicitudes (pendientes) */}
            {tab === "pendientes" && (
              <button
                onClick={handleImportarExcel}
                className="btn text-white"
                style={{
                  background: "linear-gradient(135deg, #0077B6, #023E8A)",
                  borderRadius: "10px", fontWeight: "600", padding: "10px 20px",
                  border: "none", boxShadow: "0 2px 4px rgba(0,119,182,0.2)",
                  transition: "transform 0.15s ease, opacity 0.15s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                📥 Importar Excel
              </button>
            )}

          </div>
        </div>
      )}


      {/* Pestañas de navegacion */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          ["instructores", "👨‍🏫 Instructores"],
          ["gestores", "🔑 Gestores"],
          ["pasantes", "🔬 Pasantes"]
        ].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{
            padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
            fontWeight: "600", fontSize: "13px",
            background: tab === key ? "#0f172a" : "#f1f5f9",
            color: tab === key ? "#818cf8" : "#64748b",
            transition: "all 0.2s ease"
          }}>{label}</button>
        ))}
      </div>

      {/* Pestaña de Solicitudes de Acceso (pendientes) */}
      {tab === "pendientes" && (
        <div style={{ marginBottom: "24px" }}>
          <p style={{
            fontSize: "11px", fontWeight: "700", color: "#0077B6",
            letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px"
          }}>⚙️ Usuarios Pendientes de Aprobación</p>
          {usuariosPendientes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
              <p style={{ fontSize: "16px" }}>No hay usuarios pendientes</p>
            </div>
          ) : (
            usuariosPendientes
              .filter(u => {
                const search = filterText.toLowerCase().trim();
                return (
                  String(u.id_usuario || "").includes(search) ||
                  String(u.nombres_apellidos || "").toLowerCase().includes(search) ||
                  String(u.documento || "").includes(search) ||
                  String(u.email || "").toLowerCase().includes(search)
                );
              })
              .map(u => cardUsuario(u))
          )}
        </div>
      )}

      {tab === "instructores" && <Instructores />}

      {/* Pestañas por rol: Gestores, Pasantes */}
      {["gestores", "pasantes"].includes(tab) && (() => {
        const rolMap = {
          gestores: { key: "Gestor", icon: "🔑", label: "Gestores", color: "#0077B6" },
          pasantes: { key: "Pasante", icon: "🔬", label: "Pasantes", color: "#d97706" },
        };
        const section = rolMap[tab];
        const usuarios = todosUsuarios.filter(u => {
          const search = filterText.toLowerCase().trim();
          return u.rol === section.key && (
            String(u.id_usuario || "").includes(search) ||
            String(u.nombres_apellidos || "").toLowerCase().includes(search) ||
            String(u.documento || "").includes(search) ||
            String(u.email || "").toLowerCase().includes(search)
          );
        });

        const totalPages = Math.ceil(usuarios.length / perPage);
        const paginados = usuarios.slice((page - 1) * perPage, page * perPage);

        return (
          <div>
            {/* Encabezado de la seccion de rol */}
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "14px", paddingBottom: "10px",
              borderBottom: `2px solid ${section.color}22`
            }}>
              <span style={{ fontSize: "20px" }}>{section.icon}</span>
              <span style={{
                fontSize: "13px", fontWeight: "800", color: section.color,
                letterSpacing: "1px", textTransform: "uppercase"
              }}>
                {section.label}
              </span>
              <span style={{
                background: section.color, color: "#fff",
                fontSize: "11px", fontWeight: "700", padding: "2px 10px",
                borderRadius: "99px", marginLeft: "4px"
              }}>
                {usuarios.length}
              </span>
            </div>

            {usuarios.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
                <p style={{ fontSize: "16px" }}>No hay {section.label.toLowerCase()} registrados</p>
              </div>
            ) : (
              <>
              {paginados.map(u => (
                <div key={u.id_usuario} style={{
                  background: "#fff", borderRadius: "14px", padding: "18px 22px",
                  marginBottom: "10px", border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap"
                }}>
                  {/* Avatar circular con inicial */}
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "50%",
                    background: gradientFor(u.rol),
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontWeight: "800", fontSize: "16px", flexShrink: 0
                  }}>
                    {u.nombres_apellidos?.charAt(0).toUpperCase()}
                  </div>
                  {/* Informacion del usuario */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>{u.nombres_apellidos}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{u.email} · {u.documento}</div>
                    {/* Informacion de ficha si existe */}
                    {(u.numero_ficha || u.nombre_ficha) && (
                      <div style={{ fontSize: "11px", color: "#0077B6", marginTop: "4px", fontWeight: "600" }}>
                        🆔 Ficha: {u.numero_ficha || "N/A"} · Ficha Nombre: {u.nombre_ficha || "N/A"} · SENA Empresa: {u.es_sena_empresa ? "Sí" : "No"}
                      </div>
                    )}
                  </div>
                  {/* Badge de estado */}
                  {estadoBadge(u.estado)}
                  {/* Boton de activar/inactivar */}
                  {(u.estado === 'aprobado' || u.estado === 'inactivo') && (
                    <button onClick={() => toggleActivo(u.id_usuario, u.estado)} style={{
                      background: u.estado === 'inactivo' ? "linear-gradient(135deg, #0077B6, #023E8A)" : "transparent",
                      border: u.estado === 'inactivo' ? "none" : "1px solid #f59e0b",
                      borderRadius: "8px", padding: "7px 18px",
                      color: u.estado === 'inactivo' ? "#fff" : "#d97706",
                      fontWeight: "700", cursor: "pointer", fontSize: "12px",
                      transition: "all 0.2s"
                    }}>
                      {u.estado === 'inactivo' ? "🔓 Activar" : "🔒 Inactivar"}
                    </button>
                  )}
                  {(u.estado === 'aprobado' || u.estado === 'inactivo') && (
                    <button onClick={() => cambiarPasswordAdmin(u.id_usuario)} style={{
                      background: "#f1f5f9", border: "1px solid #cbd5e1",
                      borderRadius: "8px", padding: "7px 18px",
                      color: "#475569", fontWeight: "700", cursor: "pointer", fontSize: "12px",
                      transition: "all 0.2s"
                    }}>
                      🔑 Cambiar Clave
                    </button>
                  )}
                  {/* Botones de aprobar/rechazar para pendientes */}
                  {u.estado === 'pendiente' && (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button onClick={() => aprobarUsuario(u.id_usuario)} style={{
                        background: "linear-gradient(135deg, #0077B6, #023E8A)", border: "none",
                        borderRadius: "8px", padding: "7px 16px", color: "#fff",
                        fontWeight: "700", cursor: "pointer", fontSize: "12px"
                      }}>✅</button>
                      <button onClick={() => rechazarUsuario(u.id_usuario)} style={{
                        background: "#fff", border: "1px solid #ef4444",
                        borderRadius: "8px", padding: "7px 16px", color: "#ef4444",
                        fontWeight: "700", cursor: "pointer", fontSize: "12px"
                      }}>❌</button>
                    </div>
                  )}
                </div>
              ))}

              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div style={{
                  display: "flex", justifyContent: "center", alignItems: "center",
                  gap: "6px", marginTop: "20px", flexWrap: "wrap"
                }}>
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    style={{
                      padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                      background: page === 1 ? "#f1f5f9" : "#fff", cursor: page === 1 ? "default" : "pointer",
                      color: page === 1 ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                    }}
                  >«</button>
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{
                      padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                      background: page === 1 ? "#f1f5f9" : "#fff", cursor: page === 1 ? "default" : "pointer",
                      color: page === 1 ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                    }}
                  >‹</button>
                  <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600", padding: "0 8px" }}>
                    Página {page} de {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{
                      padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                      background: page === totalPages ? "#f1f5f9" : "#fff", cursor: page === totalPages ? "default" : "pointer",
                      color: page === totalPages ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                    }}
                  >›</button>
                  <button
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                    style={{
                      padding: "6px 12px", borderRadius: "8px", border: "1px solid #dbeafe",
                      background: page === totalPages ? "#f1f5f9" : "#fff", cursor: page === totalPages ? "default" : "pointer",
                      color: page === totalPages ? "#94a3b8" : "#0077B6", fontWeight: "600", fontSize: "12px"
                    }}
                  >»</button>
                </div>
              )}
              </>
            )}
          </div>
        );
      })()}
      {/* ===== MODAL: Registrar Pasante / Gestor ===== */}
      {showRegisterModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "420px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden"
          }}>
            {/* Cabecera del modal */}
            <div style={{
              background: "linear-gradient(135deg, #059669, #065f46)",
              padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div>
                <h5 style={{ color: "#fff", fontWeight: "800", margin: 0, fontSize: "16px" }}>
                  ➕ Registrar {registerTab}
                </h5>
                <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: "12px" }}>
                  El usuario quedará registrado y aprobado automáticamente
                </p>
              </div>
              <button onClick={() => { setShowRegisterModal(false); resetRegisterForm(); }}
                style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: "50%",
                  width: "28px", height: "28px", color: "#fff", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕
              </button>
            </div>



            {/* Formulario */}
            <form onSubmit={handleRegistrarUsuario} style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>

              {/* Tipo de documento */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Tipo de Documento
                </label>
                <select
                  value={registerForm.tipo_documento}
                  onChange={e => setRegisterForm(f => ({ ...f, tipo_documento: e.target.value }))}
                  required style={{ width: "100%", padding: "8px 12px", borderRadius: "8px",
                    border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                </select>
              </div>

              {/* Número de documento */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Número de Documento
                </label>
                <input type="text" required placeholder="Ej: 1234567890" autoComplete="off"
                  value={registerForm.documento}
                  onChange={e => setRegisterForm(f => ({ ...f, documento: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px",
                    border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
                />
              </div>

              {/* Nombres y apellidos */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Nombres y Apellidos
                </label>
                <input type="text" required placeholder="Nombre completo" autoComplete="off"
                  value={registerForm.nombres_apellidos}
                  onChange={e => setRegisterForm(f => ({ ...f, nombres_apellidos: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px",
                    border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Correo Electrónico
                </label>
                <input type="email" required placeholder="correo@ejemplo.com" autoComplete="off"
                  value={registerForm.email}
                  onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px",
                    border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
                />
              </div>

              {/* Contraseña */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Contraseña Inicial
                </label>
                <input type="password" required placeholder="Mínimo 8 caracteres" minLength={8} autoComplete="new-password"
                  value={registerForm.password}
                  onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px",
                    border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
                />
              </div>

              {/* Campo exclusivo de Pasante: es_sena_empresa, o un placeholder para mantener el mismo tamaño */}
              <div style={{ visibility: registerTab === "Pasante" ? "visible" : "hidden", height: registerTab === "Pasante" ? "auto" : "55px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  ¿Es SENA Empresa?
                </label>
                <select
                  value={registerForm.es_sena_empresa}
                  onChange={e => setRegisterForm(f => ({ ...f, es_sena_empresa: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px",
                    border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
                >
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              {/* Nota informativa */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#065f46" }}>
                  ℹ️ El {registerTab} quedará en estado <strong>pendiente</strong> hasta que un administrador lo apruebe.
                </p>
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <button type="button" onClick={() => { setShowRegisterModal(false); resetRegisterForm(); }}
                  style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1.5px solid #e2e8f0",
                    background: "#f8fafc", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={registerLoading}
                  style={{ flex: 2, padding: "8px", borderRadius: "8px", border: "none",
                    background: "linear-gradient(135deg, #059669, #065f46)", color: "#fff",
                    fontWeight: "700", cursor: registerLoading ? "not-allowed" : "pointer",
                    fontSize: "13px", opacity: registerLoading ? 0.75 : 1 }}>
                  {registerLoading ? "Registrando..." : `✅ Registrar ${registerTab}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
