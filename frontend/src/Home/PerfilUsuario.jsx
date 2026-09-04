// Importa React y hooks para estado y efectos secundarios
import React, { useState, useEffect } from "react";
// Importa la instancia de Axios con el interceptor de JWT
import apiAxios from "../api/axiosConfig.js";
// Importa SweetAlert2 para notificaciones y alertas
import Swal from "sweetalert2";

// ===== ESTILOS GLOBALES inyectados dinamicamente =====
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .perfil-page { font-family: 'Inter', sans-serif; min-height: 100vh;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%);
    padding: 32px 16px; }
  .perfil-hero {
    background: linear-gradient(135deg, #0077B6 0%, #023E8A 65%, #0096C7 100%);
    border-radius: 28px; padding: 32px 32px 80px; position: relative;
    overflow: hidden; margin-bottom: -60px;
    box-shadow: 0 20px 60px rgba(0,119,182,0.35); }
  .perfil-hero::before { content:''; position:absolute; top:-60px; right:-60px;
    width:240px; height:240px; background:rgba(255,255,255,0.07); border-radius:50%; }
  .perfil-hero::after { content:''; position:absolute; bottom:-80px; left:-40px;
    width:300px; height:300px; background:rgba(255,255,255,0.04); border-radius:50%; }
  .perfil-avatar {
    width:100px; height:100px; border-radius:50%;
    background: linear-gradient(135deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08));
    border: 3px solid rgba(255,255,255,0.5);
    display:flex; align-items:center; justify-content:center;
    font-size:38px; font-weight:800; color:#fff;
    margin:0 auto 16px; box-shadow:0 8px 30px rgba(0,0,0,0.2);
    transition:transform 0.3s; position:relative; z-index:1; cursor:default; }
  .perfil-avatar:hover { transform: scale(1.07); }
  .perfil-badge {
    display:inline-flex; align-items:center; gap:6px;
    background:rgba(255,255,255,0.15); backdrop-filter:blur(8px);
    border:1px solid rgba(255,255,255,0.25); border-radius:99px;
    padding:5px 16px; font-size:12px; font-weight:600; color:#fff; margin-top:8px; }
  .perfil-stats {
    display:flex; justify-content:flex-end; gap:0;
    position:relative; z-index:1; margin-bottom:20px; }
  .perfil-stat { text-align:center; padding:12px 20px; }
  .perfil-stat-val { font-size:20px; font-weight:800; color:#fff; margin:0; }
  .perfil-stat-lbl { font-size:11px; color:rgba(255,255,255,0.65); margin:2px 0 0; font-weight:500; }
  .perfil-divider { width:1px; background:rgba(255,255,255,0.2); margin:10px 0; }
  .perfil-card {
    background:#fff; border-radius:24px;
    box-shadow:0 8px 40px rgba(0,0,0,0.08);
    border:1px solid #f0f9ff; overflow:hidden; }
  .perfil-body { padding: 76px 36px 36px; }
  .perfil-section {
    font-size:11px; font-weight:700; letter-spacing:1.4px; text-transform:uppercase;
    color:#94a3b8; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .perfil-section::after { content:''; flex:1; height:1px; background:#f1f5f9; }
  .perfil-info-grid { display:grid; gap:10px; margin-bottom:28px; }
  .perfil-info-item {
    background:linear-gradient(135deg,#f0f9ff,#e0f2fe);
    border:1.5px solid #bae6fd; border-radius:16px;
    padding:14px 20px; display:flex; align-items:center; gap:14px;
    transition:transform 0.2s; }
  .perfil-info-item:hover { transform:translateY(-2px); }
  .perfil-info-icon {
    width:40px; height:40px; border-radius:12px; background:#0077B6;
    display:flex; align-items:center; justify-content:center;
    font-size:17px; flex-shrink:0; }
  .perfil-info-lbl { font-size:11px; font-weight:700; text-transform:uppercase;
    letter-spacing:0.5px; color:#64748b; margin:0 0 2px; }
  .perfil-info-val { font-size:14px; font-weight:700; color:#0f172a; margin:0; }
  .perfil-label { font-size:11px; font-weight:700; letter-spacing:0.5px;
    text-transform:uppercase; color:#94a3b8; margin-bottom:6px; display:block; }
  .perfil-input {
    width:100%; border:1.5px solid #e2e8f0; border-radius:12px;
    padding:12px 16px; font-size:14px; font-weight:500; color:#1e293b;
    background:#f8fafc; outline:none; transition:all 0.2s;
    font-family:'Inter',sans-serif; }
  .perfil-input:focus { border-color:#0077B6; background:#fff; box-shadow:0 0 0 3px rgba(0,119,182,0.1); }
  .perfil-input:disabled { background:#f1f5f9; color:#64748b; cursor:not-allowed; }
  .perfil-chk-wrap {
    display:flex; align-items:center; gap:12px; background:#f8fafc;
    border:1.5px solid #e2e8f0; border-radius:12px;
    padding:14px 16px; cursor:pointer; transition:all 0.2s; }
  .perfil-chk-wrap:hover { border-color:#0077B6; background:#f0f9ff; }
  .perfil-chk-wrap input[type="checkbox"] { width:18px; height:18px; accent-color:#0077B6; cursor:pointer; }
  .perfil-btn {
    width:100%; background:linear-gradient(135deg,#0077B6,#023E8A);
    color:#fff; border:none; border-radius:14px; padding:14px 24px;
    font-size:14px; font-weight:700; cursor:pointer; transition:all 0.25s;
    box-shadow:0 4px 20px rgba(0,119,182,0.35); font-family:'Inter',sans-serif;
    display:flex; align-items:center; justify-content:center; gap:8px; }
  .perfil-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(0,119,182,0.45); background:linear-gradient(135deg,#0096C7,#0077B6); }
  .perfil-btn:disabled { opacity:0.75; cursor:not-allowed; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  .fadein  { animation:fadeUp 0.4s ease both; }
  .fadein2 { animation:fadeUp 0.4s ease 0.1s both; }
`;

// Mapeo de rol a emoji y etiqueta
const rolConfig = {
  administrador: { emoji: "🛡️", label: "Administrador" },
  instructor:    { emoji: "🎓", label: "Instructor" },
  aprendiz:      { emoji: "📚", label: "Aprendiz" },
  pasante:       { emoji: "💼", label: "Pasante" },
  gestor:        { emoji: "⚙️",  label: "Gestor" },
};

// Componente de visualización y edición del perfil del usuario
const PerfilUsuario = () => {
  // Datos completos del usuario obtenidos del servidor
  const [user, setUser] = useState(null);
  // Indicador de carga mientras se obtiene el perfil
  const [loading, setLoading] = useState(true);
  // Indica si se está guardando el formulario
  const [saving, setSaving] = useState(false);
  
  // Datos del formulario de edición (separados para control de cambios)
  const [formData, setFormData] = useState({ 
    nombres_apellidos: "", 
    email: "",
    numero_ficha: "",
    nombre_ficha: "",
    es_sena_empresa: false
  });

  // Carga los datos del perfil al montar el componente e inyecta los estilos
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "perfil-css";
    style.textContent = CSS;
    if (!document.getElementById("perfil-css")) document.head.appendChild(style);
    cargarPerfil();
    return () => { const el = document.getElementById("perfil-css"); if (el) el.remove(); };
  }, []);

  // Obtiene los datos del perfil desde el backend
  const cargarPerfil = async () => {
    try {
      // Solicita los datos del perfil al endpoint protegido
      const res = await apiAxios.get("/api/auth/profile/me");
      if (res.data) {
        setUser(res.data);
        setFormData({ 
          nombres_apellidos: res.data.nombres_apellidos, 
          email: res.data.email,
          numero_ficha: res.data.numero_ficha || "",
          nombre_ficha: res.data.nombre_ficha || "",
          es_sena_empresa: res.data.es_sena_empresa || false
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      Swal.fire("Error de Perfil", `No se pudo obtener tu información: ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Envía los cambios del perfil al servidor
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // Verificación de seguridad para todos los usuarios
    const { value: password, isConfirmed } = await Swal.fire({
        title: 'Verificación de Seguridad',
        text: 'Ingresa tu clave de acceso para autorizar los cambios:',
        input: 'password',
        inputPlaceholder: 'Contraseña...',
        showCancelButton: true,
        confirmButtonColor: '#0077B6',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Verificar y Guardar',
        cancelButtonText: 'Cancelar'
      });

      if (!isConfirmed) return; // Acción cancelada
      if (!password) {
        Swal.fire('Cancelado', 'Debes ingresar tu contraseña para continuar.', 'warning');
        return;
      }
      
      // Adjuntamos la clave para que el backend la verifique si está configurado para ello
      formData.passwordConfirmacion = password;

    setSaving(true);
    try {
      // Envía los datos actualizados al endpoint de perfil
      await apiAxios.put("/api/auth/profile/update", formData);
      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        text: "Tus cambios han sido guardados correctamente.",
        confirmButtonColor: "#0077B6",
        timer: 2500,
        timerProgressBar: true,
      });
      // Sincroniza los datos actualizados con sessionStorage
      const stored = JSON.parse(sessionStorage.getItem("user"));
      const updated = { 
        ...stored, 
        nombres_apellidos: formData.nombres_apellidos, 
        email: formData.email,
        numero_ficha: formData.numero_ficha,
        nombre_ficha: formData.nombre_ficha,
        es_sena_empresa: formData.es_sena_empresa
      };
      sessionStorage.setItem("user", JSON.stringify(updated));
      // Recarga la página para reflejar cambios en TopBar y Sidebar
      window.location.reload();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo actualizar", "error");
    } finally {
      setSaving(false);
    }
  };

  // Spinner de carga inicial
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#f0f9ff,#e0f2fe)" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:"44px", height:"44px", border:"4px solid #bae6fd",
          borderTopColor:"#0077B6", borderRadius:"50%",
          animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ color:"#0077B6", fontWeight:600, fontSize:"14px" }}>Cargando perfil...</p>
      </div>
    </div>
  );

  // Error al cargar
  if (!user) return (
    <div style={{ textAlign:"center", padding:"80px 20px" }}>
      <div style={{ fontSize:"48px", marginBottom:"12px" }}>😕</div>
      <p style={{ color:"#64748b" }}>No se pudo cargar la información del usuario.</p>
    </div>
  );

  const esAdmin      = user.rol?.toLowerCase() === "administrador";
  const esInstructor = user.rol?.toLowerCase() === "instructor";
  const mostrarCamposFicha = !esAdmin && !esInstructor;
  const rolKey   = user.rol?.toLowerCase() || "";
  const rolInfo  = rolConfig[rolKey] || { emoji: "👤", label: user.rol };
  // Genera hasta 2 iniciales del nombre
  const iniciales = user.nombres_apellidos
    ?.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase() || "").join("") || "U";

  return (
    <div className="perfil-page">
      <div style={{ maxWidth:"700px", margin:"0 auto" }}>

        {/* ===== HERO BANNER ===== */}
        <div className="perfil-hero fadein">
          {/* Stats rápidos en la esquina superior derecha */}
          <div className="perfil-stats">
            <div className="perfil-stat">
              <p className="perfil-stat-val">{rolInfo.emoji}</p>
              <p className="perfil-stat-lbl">{rolInfo.label}</p>
            </div>
            <div className="perfil-divider" />
            <div className="perfil-stat">
              <p className="perfil-stat-val" style={{ fontSize:"16px" }}>
                {user.estado === "aprobado" ? "✅" : "⏳"}
              </p>
              <p className="perfil-stat-lbl">{user.estado || "activo"}</p>
            </div>
          </div>

          {/* Avatar e identidad */}
          <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
            <div className="perfil-avatar">{iniciales}</div>
            <h2 style={{ color:"#fff", fontWeight:800, fontSize:"22px", margin:"0 0 4px" }}>
              {user.nombres_apellidos}
            </h2>
            <div className="perfil-badge">
              <span>{rolInfo.emoji}</span>
              <span>{user.rol}</span>
            </div>
            {user.email && (
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"13px", marginTop:"10px", marginBottom:0 }}>
                ✉️ {user.email}
              </p>
            )}
          </div>
        </div>

        {/* ===== TARJETA PRINCIPAL ===== */}
        <div className="perfil-card fadein2">
          <div className="perfil-body">

            {/* Cards de datos del sistema (solo lectura) */}
            <div className="perfil-section">📋 Datos del sistema</div>
            <div className="perfil-info-grid" style={{ gridTemplateColumns: esAdmin ? "1fr" : "1fr 1fr" }}>
              {!esAdmin && (
                <div className="perfil-info-item">
                  <div className="perfil-info-icon">
                    <i className="fas fa-id-card text-white" style={{ fontSize: "18px" }}></i>
                  </div>
                  <div>
                    <p className="perfil-info-lbl">Documento</p>
                    <p className="perfil-info-val">{user.documento || "—"}</p>
                  </div>
                </div>
              )}
              <div className="perfil-info-item">
                <div className="perfil-info-icon">
                  <i className="fas fa-user-shield text-white" style={{ fontSize: "18px" }}></i>
                </div>
                <div>
                  <p className="perfil-info-lbl">Rol en el sistema</p>
                  <p className="perfil-info-val">{user.rol}</p>
                </div>
              </div>
            </div>

            {/* Formulario de edición */}
            <div className="perfil-section">✏️ Información editable</div>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>

                {/* Nombre completo — ancho completo */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <label className="perfil-label">Nombre Completo</label>
                  <input type="text" className="perfil-input"
                    value={formData.nombres_apellidos}
                    onChange={(e) => setFormData({ ...formData, nombres_apellidos: e.target.value })}
                    placeholder="Tu nombre completo" />
                </div>

                {/* Email — ancho completo */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <label className="perfil-label">Correo Electrónico</label>
                  <input type="email" className="perfil-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="correo@ejemplo.com" />
                </div>

                {/* Campos de ficha y SENA Empresa solo para aprendices (ocultos para admin e instructor) */}
                {mostrarCamposFicha && (
                  <>
                    <div>
                      <label className="perfil-label">Número de Ficha</label>
                      <input type="text" className="perfil-input"
                        value={formData.numero_ficha}
                        onChange={(e) => setFormData({ ...formData, numero_ficha: e.target.value })}
                        placeholder="Ej: 2895432" />
                    </div>
                    <div>
                      <label className="perfil-label">Nombre de la Ficha / Grupo</label>
                      <input type="text" className="perfil-input"
                        value={formData.nombre_ficha}
                        onChange={(e) => setFormData({ ...formData, nombre_ficha: e.target.value })}
                        placeholder="Ej: ADSO" />
                    </div>
                    <div style={{ gridColumn:"1 / -1" }}>
                      <label className="perfil-chk-wrap" htmlFor="es_sena_empresa">
                        <input type="checkbox" id="es_sena_empresa"
                          checked={formData.es_sena_empresa}
                          onChange={(e) => setFormData({ ...formData, es_sena_empresa: e.target.checked })} />
                        <div>
                          <div style={{ fontSize:"13px", fontWeight:600, color:"#1e293b" }}>
                            🏢 ¿Es SENA Empresa?
                          </div>
                          <div style={{ fontSize:"12px", color:"#64748b", marginTop:"2px" }}>
                            Marca esta opción si perteneces a SENA Empresa
                          </div>
                        </div>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Botón guardar con spinner integrado */}
              <button type="submit" className="perfil-btn" disabled={saving}>
                {saving ? (
                  <>
                    <div style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.4)",
                      borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                    Guardando...
                  </>
                ) : (
                  <> 💾 Guardar Cambios </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PerfilUsuario;

