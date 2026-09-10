// Importa React y hooks para estado y efectos secundarios
import React, { useState, useEffect } from "react";
// Importa la instancia de Axios con el interceptor de JWT
import apiAxios from "../api/axiosConfig.js";
// Importa SweetAlert2 para notificaciones y alertas
import Swal from "sweetalert2";

// ===== ESTILOS GLOBALES inyectados dinamicamente =====
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  .perfil-page {
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
    background: #ffffff;
    padding: 60px 20px;
    color: #111;
  }
  
  .perfil-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .perfil-title {
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 40px;
    color: #222;
  }
  
  .perfil-avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 40px;
  }
  
  .perfil-avatar {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #4ab3e6;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 20px;
  }
  
  .perfil-avatar-subtitle {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  .perfil-btn-black {
    background: #111;
    color: #fff;
    border: none;
    padding: 10px 24px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    text-transform: uppercase;
    transition: background 0.2s;
  }
  
  .perfil-btn-black:hover { background: #333; }
  .perfil-btn-black:disabled { opacity: 0.5; cursor: not-allowed; }
  
  .perfil-avatar-hint {
    font-size: 12px;
    font-style: italic;
    color: #666;
    margin-top: 12px;
  }
  .perfil-avatar-hint a { color: #444; text-decoration: underline; }
  
  .perfil-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }
  
  .perfil-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #222;
  }
  
  .perfil-label span { color: #d32f2f; }
  
  .perfil-input {
    width: 100%;
    border: 1px solid #e0e0e0;
    padding: 10px 14px;
    font-size: 14px;
    color: #333;
    outline: none;
    font-family: 'Inter', sans-serif;
  }
  
  .perfil-input:focus { border-color: #999; }
  
  .perfil-chk-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #222;
    margin-bottom: 30px;
  }
  
  .perfil-chk-wrap input { cursor: pointer; }
  
  .perfil-actions {
    display: flex;
    justify-content: flex-end;
  }
  
  @media (max-width: 600px) {
    .perfil-form-grid { grid-template-columns: 1fr; }
  }
`;

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAvatarUrl(null);
  };
  
  const [formData, setFormData] = useState({ 
    nombres_apellidos: "", 
    email: "",
    numero_ficha: "",
    nombre_ficha: "",
    es_sena_empresa: false
  });

  useEffect(() => {
    const style = document.createElement("style");
    style.id = "perfil-css";
    style.textContent = CSS;
    if (!document.getElementById("perfil-css")) document.head.appendChild(style);
    cargarPerfil();
    return () => { const el = document.getElementById("perfil-css"); if (el) el.remove(); };
  }, []);

  const cargarPerfil = async () => {
    try {
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
      Swal.fire("Error", "No se pudo obtener tu información", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const { value: password, isConfirmed } = await Swal.fire({
      title: 'Verificación',
      text: 'Ingresa tu clave de acceso:',
      input: 'password',
      showCancelButton: true,
      confirmButtonColor: '#111',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    });

    if (!isConfirmed) return;
    if (!password) {
      Swal.fire('Cancelado', 'Debes ingresar tu contraseña.', 'warning');
      return;
    }
    
    formData.passwordConfirmacion = password;
    setSaving(true);

    try {
      await apiAxios.put("/api/auth/profile/update", formData);
      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        confirmButtonColor: "#111",
        timer: 2000,
        timerProgressBar: true,
      });
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
      window.location.reload();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{textAlign:"center", padding:"50px"}}>Cargando...</div>;
  if (!user) return <div style={{textAlign:"center", padding:"50px"}}>Error al cargar.</div>;

  const esAdmin      = user.rol?.toLowerCase() === "administrador";
  const esInstructor = user.rol?.toLowerCase() === "instructor";
  const mostrarCamposFicha = !esAdmin && !esInstructor;
  const iniciales = user.nombres_apellidos?.split(" ").slice(0, 2).map(n => n[0]?.toUpperCase() || "").join("") || "U";

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        
        <h2 className="perfil-title">Detalle del perfil</h2>
        
        <div className="perfil-avatar-section">
          {/* Label acts as a wrapper to click and upload */}
          <label htmlFor="avatarUpload" style={{ cursor: "pointer" }}>
            <div className="perfil-avatar" style={{ overflow: "hidden", position: "relative" }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                iniciales
              )}
            </div>
          </label>
          <input 
            type="file" 
            id="avatarUpload" 
            accept="image/*" 
            style={{ display: "none" }} 
            onChange={handleImageChange} 
          />
          <div className="perfil-avatar-subtitle">Subir tu nueva imagen de perfil</div>
          <button type="button" className="perfil-btn-black" onClick={handleRemoveImage}>Eliminar</button>
          <div className="perfil-avatar-hint">
            Puedes cambiar tu foto de perfil en <a href="#">Gravatar</a>
          </div>
        </div>
        
        <form onSubmit={handleUpdateProfile}>
          
          <div className="perfil-form-grid">
            <div>
              <label className="perfil-label">Nombre Completo <span>*</span></label>
              <input type="text" className="perfil-input"
                value={formData.nombres_apellidos}
                onChange={(e) => setFormData({ ...formData, nombres_apellidos: e.target.value })}
                required />
            </div>
            <div>
              <label className="perfil-label">Email <span>*</span></label>
              <input type="email" className="perfil-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required />
            </div>
          </div>
          
          {mostrarCamposFicha && (
            <div className="perfil-form-grid">
              <div>
                <label className="perfil-label">Número de Ficha</label>
                <input type="text" className="perfil-input"
                  value={formData.numero_ficha}
                  onChange={(e) => setFormData({ ...formData, numero_ficha: e.target.value })} />
              </div>
              <div>
                <label className="perfil-label">Nombre de la Ficha</label>
                <input type="text" className="perfil-input"
                  value={formData.nombre_ficha}
                  onChange={(e) => setFormData({ ...formData, nombre_ficha: e.target.value })} />
              </div>
            </div>
          )}
          
          {mostrarCamposFicha && (
            <label className="perfil-chk-wrap">
              <input type="checkbox" 
                checked={formData.es_sena_empresa}
                onChange={(e) => setFormData({ ...formData, es_sena_empresa: e.target.checked })} />
              ¿Perteneces a SENA Empresa? <span>*</span>
            </label>
          )}
          
          <div className="perfil-actions">
            <button type="submit" className="perfil-btn-black" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
          
        </form>
        
      </div>
    </div>
  );
};

export default PerfilUsuario;

