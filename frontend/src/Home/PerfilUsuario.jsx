import React, { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ nombres_apellidos: "", email: "" });
  const [passData, setPassData] = useState({ passwordActual: "", passwordNueva: "", confirmNueva: "" });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const res = await apiAxios.get("/api/auth/profile/me");
      setUser(res.data);
      setFormData({ nombres_apellidos: res.data.nombres_apellidos, email: res.data.email });
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await apiAxios.put("/api/auth/profile/update", formData);
      Swal.fire("¡Éxito!", "Perfil actualizado correctamente", "success");
      
      // Actualizar datos en sesión
      const stored = JSON.parse(sessionStorage.getItem("user"));
      const updated = { ...stored, nombres_apellidos: formData.nombres_apellidos, email: formData.email };
      sessionStorage.setItem("user", JSON.stringify(updated));
      window.location.reload(); // Recarga simple para actualizar TopBar/Sidebar
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo actualizar", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.passwordNueva !== passData.confirmNueva) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }
    try {
      await apiAxios.put("/api/auth/profile/change-password", {
        passwordActual: passData.passwordActual,
        passwordNueva: passData.passwordNueva
      });
      Swal.fire("¡Éxito!", "Contraseña cambiada", "success");
      setPassData({ passwordActual: "", passwordNueva: "", confirmNueva: "" });
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Error al cambiar contraseña", "error");
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ height: "3px", width: "24px", background: "#0077B6", borderRadius: "99px" }} />
        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0A1628", margin: 0 }}>Mi Perfil</h2>
      </div>

      <div className="row g-4">
        {/* Datos Personales */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Datos Personales</h5>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                  <input 
                    type="text" className="form-control" 
                    value={formData.nombres_apellidos} 
                    onChange={(e) => setFormData({...formData, nombres_apellidos: e.target.value})}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email</label>
                  <input 
                    type="email" className="form-control" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Documento</label>
                  <input type="text" className="form-control" value={user.documento} disabled style={{ borderRadius: "10px", background: "#f8fafc" }} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Rol</label>
                  <input type="text" className="form-control" value={user.rol} disabled style={{ borderRadius: "10px", background: "#f8fafc" }} />
                </div>
                <button type="submit" className="btn w-100 text-white fw-bold" style={{ background: "#0077B6", borderRadius: "10px" }}>
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "18px" }}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Seguridad</h5>
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Contraseña Actual</label>
                  <input 
                    type="password" className="form-control" 
                    value={passData.passwordActual}
                    onChange={(e) => setPassData({...passData, passwordActual: e.target.value})}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
                <hr className="my-4" />
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Nueva Contraseña</label>
                  <input 
                    type="password" className="form-control" 
                    value={passData.passwordNueva}
                    onChange={(e) => setPassData({...passData, passwordNueva: e.target.value})}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" className="form-control" 
                    value={passData.confirmNueva}
                    onChange={(e) => setPassData({...passData, confirmNueva: e.target.value})}
                    style={{ borderRadius: "10px" }}
                  />
                </div>
                <button type="submit" className="btn w-100 btn-outline-primary fw-bold" style={{ borderRadius: "10px" }}>
                  Cambiar Contraseña
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
