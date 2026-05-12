import React, { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";

const PerfilUsuario = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ nombres_apellidos: "", email: "" });

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

  if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;
  if (!user) return <div className="text-center mt-5">No se pudo cargar la información del usuario.</div>;

  return (
    <div className="container mt-4 d-flex justify-content-center">
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: "600px", borderRadius: "18px", overflow: "hidden" }}>
        {/* Encabezado Azul */}
        <div style={{ background: "#0077B6", padding: "30px 20px", textAlign: "center", color: "white" }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "32px", fontWeight: "bold", margin: "0 auto 15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            {user.nombres_apellidos.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ margin: 0, fontWeight: "700" }}>{user.nombres_apellidos}</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>{user.rol}</p>
        </div>

        <div className="card-body p-4 p-md-5">
          <h5 className="fw-bold mb-4" style={{ color: "#0077B6" }}>Información Personal</h5>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Nombre Completo</label>
              <input 
                type="text" className="form-control" 
                value={formData.nombres_apellidos} 
                onChange={(e) => setFormData({...formData, nombres_apellidos: e.target.value})}
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Correo Electrónico</label>
              <input 
                type="email" className="form-control" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label small fw-bold text-muted">Documento</label>
                <input type="text" className="form-control" value={user.documento} disabled style={{ borderRadius: "10px", padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }} />
              </div>
              <div className="col-md-6 mb-4">
                <label className="form-label small fw-bold text-muted">Rol en el Sistema</label>
                <input type="text" className="form-control" value={user.rol} disabled style={{ borderRadius: "10px", padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }} />
              </div>
            </div>
            <button type="submit" className="btn w-100 text-white fw-bold mt-2" style={{ background: "#0077B6", borderRadius: "10px", padding: "12px" }}>
              <i className="fas fa-save me-2"></i> Guardar Cambios
            </button>
          </form>

          <hr className="my-5" style={{ opacity: 0.1 }} />

          <h5 className="fw-bold mb-4" style={{ color: "#d90429" }}>Cambiar Contraseña</h5>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const passwordActual = e.target.passwordActual.value;
            const passwordNueva = e.target.passwordNueva.value;
            const confirm = e.target.confirmPassword.value;

            if(passwordNueva !== confirm) {
              return Swal.fire("Error", "Las contraseñas no coinciden", "error");
            }

            try {
              await apiAxios.put("/api/auth/profile/change-password", { passwordActual, passwordNueva });
              Swal.fire("¡Éxito!", "Contraseña actualizada", "success");
              e.target.reset();
            } catch (error) {
              Swal.fire("Error", error.response?.data?.message || "No se pudo cambiar", "error");
            }
          }}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Contraseña Actual</label>
              <input name="passwordActual" type="password" required className="form-control" style={{ borderRadius: "10px", padding: "10px" }} />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Nueva Contraseña</label>
              <input name="passwordNueva" type="password" required className="form-control" style={{ borderRadius: "10px", padding: "10px" }} />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Confirmar Nueva Contraseña</label>
              <input name="confirmPassword" type="password" required className="form-control" style={{ borderRadius: "10px", padding: "10px" }} />
            </div>
            <button type="submit" className="btn btn-outline-danger w-100 fw-bold" style={{ borderRadius: "10px", padding: "12px" }}>
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
