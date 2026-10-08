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
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  // Pestaña activa dentro del modal (Pasante | Gestor)
  const [registerTab, setRegisterTab] = useState("Pasante");
  // Estado del formulario de registro
  const [registerForm, setRegisterForm] = useState({
    tipo_documento: "CC",
    documento: "",
    nombres_apellidos: "",
    email: "",
    password: ""
  });
  // Controla el loading del formulario de registro
  const [registerLoading, setRegisterLoading] = useState(false);

  // Efecto que carga los usuarios cada vez que cambia la pestana activa
  useEffect(() => { cargar(); setPage(1); }, [tab]);
  // Resetear pagina cuando cambia el filtro de busqueda
  useEffect(() => { setPage(1); }, [filterText]);

  // ===== Ordenar usuarios por estado =====

  // Funcion que ordena los usuarios segun la prioridad de su estado
  const ordenarUsuarios = (lista) => {
    // Define pesos para cada estado (menor = mas prioritario)
    const pesos = {
      activo: 1,
      inactivo: 2
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



  // Funcion asincrona para alternar activo/inactivo de un usuario
  const toggleActivo = async (id_usuario, estadoActual) => {
    if (!id_usuario) {
      Swal.fire("Error en cliente", "El ID del usuario es inválido o no está definido.", "error");
      return;
    }
    // Determina si se va a activar o inactivar (aprobado cuenta como activo)
    const activar = estadoActual === 'inactivo';
    // Muestra dialogo de confirmacion al usuario
    const result = await Swal.fire({
      title: activar ? "¿Activar usuario?" : "¿Inactivar usuario?",
      text: activar
        ? "El usuario podrá iniciar sesión nuevamente"
        : "El usuario no podrá iniciar sesión hasta que lo reactives",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: activar ? "#0077B6" : "#dc2626",
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
      inputAttributes: {
        autocomplete: 'new-password',
        autocapitalize: 'off',
        autocorrect: 'off'
      },
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
            <li><strong>rol</strong> (Pasante, Gestor, Instructor)</li>
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
  const resetRegisterForm = () => {
    setSelectedUsuario(null);
    setRegisterForm({
      tipo_documento: "CC",
      documento: "",
      nombres_apellidos: "",
      email: "",
      password: ""
    });
  };

  // Maneja el envio del formulario de registro manual
  const handleRegistrarUsuario = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      if (selectedUsuario) {
        await apiAxios.put(`/api/auth/usuarios/${selectedUsuario.id_usuario}`, {
          tipo_documento: registerForm.tipo_documento,
          documento: registerForm.documento.trim(),
          nombres_apellidos: registerForm.nombres_apellidos.trim(),
          email: registerForm.email.trim().toLowerCase(),
          rol: registerTab
        }, { headers });
        Swal.fire({
          icon: "success",
          title: `✅ ${registerTab} actualizado`,
          text: `La información se guardó correctamente.`,
          confirmButtonColor: "#0077B6",
        });
      } else {
        await apiAxios.post("/api/auth", {
          tipo_documento: registerForm.tipo_documento,
          documento: registerForm.documento.trim(),
          nombres_apellidos: registerForm.nombres_apellidos.trim(),
          email: registerForm.email.trim().toLowerCase(),
          password: registerForm.documento.trim(),
          rol: registerTab,
          estado: "activo",
        }, { headers });
        Swal.fire({
          icon: "success",
          title: `✅ ${registerTab} registrado`,
          text: `El usuario fue creado correctamente y ya puede iniciar sesión con su documento.`,
          confirmButtonColor: "#0077B6",
        });
      }
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
      activo:   ["#ecfdf5", "#059669", "✅ Activo"],
      inactivo: ["#fee2e2", "#dc2626", "🚫 Inactivo"],
      aprobado: ["#ecfdf5", "#059669", "✅ Activo"],  // legacy
    };
    const [bg, color, label] = map[estado] || ["#f5f5f5", "#666", estado];
    return <span style={{ background: bg, color, fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "99px" }}>{label}</span>;
  };

  // Funcion que retorna un color solido o degradado segun el rol del usuario
  const gradientFor = (rol) => {
    if (rol === 'Gestor') return "#059669";
    if (rol === 'Pasante') return "#F97316";
    if (rol === 'Instructor') return "#0077B6";
    return "#0077B6";
  };

  // ===== Definicion de secciones por rol =====

  // Define las secciones de roles con sus propiedades visuales
  const rolSections = [
    { key: "Gestor",     icon: "🔑", label: "Gestores",     color: "#059669" },
    { key: "Pasante",    icon: "🔬", label: "Pasantes",     color: "#F97316" },
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

      {/* Informacion adicional si es Gestor (Sena Empresa) */}
      {u.rol === 'Gestor' && (
        <div style={{
          marginTop: "10px", background: "#f0fdf4", borderRadius: "10px",
          padding: "10px 14px", border: "1px solid #dcfce7", display: "flex", gap: "16px", flexWrap: "wrap"
        }}>
          <span style={{ fontSize: "12px", color: "#166534", fontWeight: "600" }}>
             🏢 Integrante de SENA Empresa
          </span>
        </div>
      )}

      {/* Botones de accion segun el estado del usuario */}
      <div style={{ display: "flex", gap: "10px", marginTop: "14px", flexWrap: "wrap" }}>

        {/* Boton de activar/inactivar */}
        <button onClick={() => toggleActivo(u.id_usuario, (u.estado === 'inactivo') ? 'inactivo' : 'activo')} style={{
          background: u.estado === 'inactivo' ? "#dcfce7" : "#fee2e2",
          border: u.estado === 'inactivo' ? "1px solid #bbf7d0" : "1px solid #fecaca",
          borderRadius: "10px", padding: "10px 20px",
          color: u.estado === 'inactivo' ? "#16a34a" : "#dc2626",
          fontWeight: "700", cursor: "pointer", fontSize: "13px"
        }}>
          <i className={`fas ${u.estado === 'inactivo' ? "fa-check" : "fa-ban"} me-2`}></i>
          {u.estado === 'inactivo' ? "Activar" : "Inactivar"}
        </button>
        {/* Boton de editar */}
        <button onClick={() => {
          setSelectedUsuario(u);
          setRegisterTab(u.rol);
          setRegisterForm({
            tipo_documento: u.tipo_documento || "CC",
            documento: u.documento || "",
            nombres_apellidos: u.nombres_apellidos || "",
            email: u.email || "",
            password: ""
          });
          setShowRegisterModal(true);
        }} style={{
          background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: "10px", padding: "10px 24px",
          color: "#0284c7", fontWeight: "700", cursor: "pointer", fontSize: "13px"
        }}>
          ✏️ Editar
        </button>

        {/* Boton para cambiar contraseña (solo en gestión o si está activo/inactivo) */}
        {/* Boton para cambiar contraseña */}
        <button onClick={() => cambiarPasswordAdmin(u.id_usuario)} style={{
          background: "#f1f5f9",
          border: "1px solid #cbd5e1",
          borderRadius: "10px", padding: "10px 24px",
          color: "#475569",
          fontWeight: "700", cursor: "pointer", fontSize: "13px"
        }}>
          🔑 Cambiar Clave
        </button>
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

      {/* Barra de búsqueda — visible en gestores y pasantes */}
      {["gestores", "pasantes"].includes(tab) && (
        <div className="row mb-4 align-items-center">
          <div className="col-md-7">
            <div style={{ position: "relative" }}>
              <input
                type="search"
                name="search_filter_text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                data-lpignore="true"
                data-form-type="other"
                className="form-control"
                placeholder="Buscar por ID, nombre, documento o email..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                style={{ borderColor: "#dbeafe", borderRadius: "10px", padding: "10px 40px 10px 15px" }}
              />
              {filterText && (
                <button
                  type="button"
                  onClick={() => setFilterText("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    padding: "4px"
                  }}
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="col-md-5 text-end" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>

            {/* Botón "Registrar Gestor" — solo en pestaña Gestores */}
            {tab === "gestores" && (
              <button
                onClick={() => { resetRegisterForm(); setRegisterTab("Gestor"); setShowRegisterModal(true); }}
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
                🔑 Registrar Gestor
              </button>
            )}

            {/* Botón "Registrar Pasante" — solo en pestaña Pasantes */}
            {tab === "pasantes" && (
              <button
                onClick={() => { resetRegisterForm(); setRegisterTab("Pasante"); setShowRegisterModal(true); }}
                className="btn text-white"
                style={{
                  background: "linear-gradient(135deg, #F97316, #c2410c)",
                  borderRadius: "10px", fontWeight: "600", padding: "10px 20px",
                  border: "none", boxShadow: "0 2px 4px rgba(249,115,22,0.25)",
                  transition: "transform 0.15s ease"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                🔬 Registrar Pasante
              </button>
            )}

            {/* Botón Importar Excel — eliminado de Pasantes, solo va en Instructores */}

          </div>
        </div>
      )}


      {/* Pestañas de navegacion con diseño mejorado */}
      <div style={{ display: "flex", gap: "0", marginBottom: "28px", background: "#f1f5f9", borderRadius: "14px", padding: "6px" }}>
        {[
          ["instructores", "👨‍🏫", "Instructores"],
          ["gestores",     "🔑",        "Gestores"],
          ["pasantes",     "🔬",        "Pasantes"]
        ].map(([key, icon, label]) => {
          const count = key === "instructores" ? null : todosUsuarios.filter(u => u.rol === (key === "gestores" ? "Gestor" : "Pasante")).length;
          return (
            <button key={key} onClick={() => setTab(key)} style={{
              flex: 1,
              padding: "10px 16px", borderRadius: "10px", border: "none", cursor: "pointer",
              fontWeight: "700", fontSize: "13px",
              background: tab === key ? "#fff" : "transparent",
              color: tab === key ? "#0077B6" : "#64748b",
              boxShadow: tab === key ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.25s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
            }}>
              <span style={{ fontSize: "15px" }}>{icon}</span>
              <span>{label}</span>
              {count !== null && count > 0 && (
                <span style={{
                  background: tab === key ? "#0077B6" : "#cbd5e1",
                  color: "#fff", fontSize: "10px", fontWeight: "800",
                  padding: "1px 7px", borderRadius: "99px", minWidth: "20px", textAlign: "center"
                }}>{count}</span>
              )}
            </button>
          );
        })}
      </div>



      {tab === "instructores" && <Instructores />}

      {/* Pestañas por rol: Gestores, Pasantes */}
      {["gestores", "pasantes"].includes(tab) && (() => {
        const rolMap = {
          gestores: { key: "Gestor", icon: "🔑", label: "Gestores", color: "#059669" },
          pasantes: { key: "Pasante", icon: "🔬", label: "Pasantes", color: "#F97316" },
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
                    {/* Informacion Sena Empresa */}
                    {u.rol === 'Gestor' && (
                      <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px", fontWeight: "600" }}>
                        🏢 Integrante de SENA Empresa
                      </div>
                    )}
                  </div>
                  {/* Estado ordenado */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Estado:</span>
                    {estadoBadge(u.estado)}
                  </div>

                  {/* Acciones */}
                  <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
                    {/* Boton Editar */}
                    <button 
                      onClick={() => {
                        setSelectedUsuario(u);
                        setRegisterTab(u.rol);
                        setRegisterForm({
                          tipo_documento: u.tipo_documento || "CC",
                          documento: u.documento || "",
                          nombres_apellidos: u.nombres_apellidos || "",
                          email: u.email || "",
                          password: ""
                        });
                        setShowRegisterModal(true);
                      }} 
                      title="Editar"
                      className="btn btn-sm"
                      style={{ background: "#dbeafe", color: "#0077B6", border: "none" }}
                    >
                      <i className="fas fa-edit"></i>
                    </button>

                    {/* Boton Activar/Inactivar */}
                    <button 
                      onClick={() => toggleActivo(u.id_usuario, u.estado === 'inactivo' ? 'inactivo' : 'activo')} 
                      title={u.estado === 'inactivo' ? "Activar" : "Inactivar"} 
                      className="btn btn-sm" 
                      style={{ 
                        background: u.estado === 'inactivo' ? "#dcfce7" : "#fee2e2", 
                        color: u.estado === 'inactivo' ? "#16a34a" : "#dc2626", 
                        border: "none" 
                      }}
                    >
                      <i className={`fas ${u.estado === 'inactivo' ? "fa-check" : "fa-ban"}`}></i>
                    </button>

                    {/* Boton Cambiar Clave */}
                    <button 
                      onClick={() => cambiarPasswordAdmin(u.id_usuario)} 
                      title="Cambiar Clave"
                      className="btn btn-sm"
                      style={{ background: "#f1f5f9", color: "#475569", border: "none" }}
                    >
                      <i className="fas fa-key"></i>
                    </button>
                  </div>

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
          position: "fixed", inset: 0, zIndex: 1050,
          background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "16px"
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "420px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden"
          }}>
            {/* Cabecera del modal */}
            <div style={{
              background: registerTab === "Pasante" 
                ? "linear-gradient(135deg, #F97316, #ea580c)" 
                : "linear-gradient(135deg, #059669, #065f46)",
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
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
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
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
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
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
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
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Correo Electrónico
                </label>
                <input type="email" required placeholder="correo@ejemplo.com" autoComplete="off"
                  value={registerForm.email}
                  onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px",
                    border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
                />
              </div>

              {/* Contraseña Inicial (asignada automáticamente como el documento) */}
              <div>
                <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Contraseña Inicial
                </label>
                <div style={{
                  padding: "8px 12px", borderRadius: "8px", background: "#f8fafc",
                  border: "1.5px dashed #cbd5e1", fontSize: "13px", color: "#475569",
                  display: "flex", alignItems: "center", gap: "8px"
                }}>
                  <span style={{ fontSize: "14px" }}>🔑</span>
                  <span>{registerForm.documento ? `Igual al documento: ${registerForm.documento}` : "Se asignará el número de documento"}</span>
                </div>
              </div>

              {/* Nota informativa */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px" }}>
                <p style={{ margin: 0, fontSize: "11px", color: "#065f46" }}>
                  ℹ️ El {registerTab} quedará registrado y su contraseña inicial será su <strong>número de documento</strong>.
                  {registerTab === 'Gestor' && <span><br/>🏢 <strong>SENA Empresa:</strong> Este usuario pertenece a SENA Empresa.</span>}
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
                    background: registerTab === "Pasante" 
                      ? "linear-gradient(135deg, #F97316, #ea580c)" 
                      : "linear-gradient(135deg, #059669, #065f46)", color: "#fff",
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
