// Importa React y hooks para estado y efectos secundarios
import React, { useState, useEffect } from "react";
// Importa la instancia de Axios con el interceptor de JWT
import apiAxios from "../api/axiosConfig.js";
// Importa SweetAlert2 para notificaciones y alertas
import Swal from "sweetalert2";

// Componente de visualización y edición del perfil del usuario
const PerfilUsuario = () => {
  // Datos completos del usuario obtenidos del servidor
  const [user, setUser] = useState(null);
  // Indicador de carga mientras se obtiene el perfil
  const [loading, setLoading] = useState(true);
  
  // Datos del formulario de edición (separados para control de cambios)
  const [formData, setFormData] = useState({ 
    nombres_apellidos: "", 
    email: "",
    numero_ficha: "",
    nombre_ficha: "",
    es_sena_empresa: false
  });

  // Carga los datos del perfil al montar el componente
  useEffect(() => {
    cargarPerfil();
  }, []);

  // Obtiene los datos del perfil desde el backend
  const cargarPerfil = async () => {
    try {
      // Solicita los datos del perfil al endpoint protegido
      const res = await apiAxios.get("/api/auth/profile/me");
      if (res.data) {
        // Almacena los datos completos del usuario
        setUser(res.data);
        // Rellena el formulario con los datos actuales del usuario
        setFormData({ 
          nombres_apellidos: res.data.nombres_apellidos, 
          email: res.data.email,
          numero_ficha: res.data.numero_ficha || "",
          nombre_ficha: res.data.nombre_ficha || "",
          es_sena_empresa: res.data.es_sena_empresa || false
        });
      }
    } catch (error) {
      // Muestra error si no se pudo cargar el perfil
      console.error("Error al cargar perfil:", error);
      const msg = error.response?.data?.message || error.message;
      Swal.fire("Error de Perfil", `No se pudo obtener tu información: ${msg}`, "error");
    } finally {
      // Desactiva el estado de carga
      setLoading(false);
    }
  };

  // Envía los cambios del perfil al servidor
  const handleUpdateProfile = async (e) => {
    // Evita la recarga del formulario al enviar
    e.preventDefault();
    try {
      // Envía los datos actualizados al endpoint de perfil
      await apiAxios.put("/api/auth/profile/update", formData);
      Swal.fire("¡Éxito!", "Perfil actualizado correctamente", "success");
      
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
      // Guarda los datos actualizados en sessionStorage
      sessionStorage.setItem("user", JSON.stringify(updated));
      // Recarga la página para reflejar cambios en TopBar y Sidebar
      window.location.reload();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo actualizar", "error");
    }
  };

  // Muestra indicador de carga mientras se obtiene el perfil
  if (loading) return <div className="text-center mt-5">Cargando perfil...</div>;
  // Muestra mensaje si no se pudo cargar la información del usuario
  if (!user) return <div className="text-center mt-5">No se pudo cargar la información del usuario.</div>;

  return (
    <div className="container mt-4 d-flex justify-content-center">
      {/*
        Tarjeta principal del perfil con sombra y bordes redondeados
      */}
      <div className="card shadow-sm border-0 w-100" style={{ maxWidth: "600px", borderRadius: "18px", overflow: "hidden" }}>
        {/*
          Encabezado azul con avatar de inicial y datos básicos del usuario
        */}
        <div style={{ background: "#0077B6", padding: "30px 20px", textAlign: "center", color: "white" }}>
          {/*
            Círculo con la inicial del nombre del usuario
          */}
          <div style={{
            width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "32px", fontWeight: "bold", margin: "0 auto 15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}>
            {/*
              Muestra la primera letra del nombre en mayúscula
            */}
            {user.nombres_apellidos.charAt(0).toUpperCase()}
          </div>
          {/*
            Nombre completo del usuario
          */}
          <h3 style={{ margin: 0, fontWeight: "700" }}>{user.nombres_apellidos}</h3>
          {/*
            Rol del usuario en el sistema
          */}
          <p style={{ margin: 0, opacity: 0.8, fontSize: "14px" }}>{user.rol}</p>
        </div>

        {/*
          Cuerpo de la tarjeta con el formulario de edición
        */}
        <div className="card-body p-4 p-md-5">
          {/*
            Título de la sección de información personal
          */}
          <h5 className="fw-bold mb-4" style={{ color: "#0077B6" }}>Información Personal</h5>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              {/*
                Campo para editar el nombre completo
              */}
              <label className="form-label small fw-bold text-muted">Nombre Completo</label>
              <input 
                type="text" className="form-control" 
                value={formData.nombres_apellidos} 
                onChange={(e) => setFormData({...formData, nombres_apellidos: e.target.value})}
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}
              />
            </div>
            <div className="mb-4">
              {/*
                Campo para editar el correo electrónico
              */}
              <label className="form-label small fw-bold text-muted">Correo Electrónico</label>
              <input 
                type="email" className="form-control" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{ borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}
              />
            </div>
            {/*
              Fila de campos: documento (solo lectura) y rol
            */}
            <div className="row">
              {/*
                Muestra el documento solo si el usuario no es administrador
              */}
              {user.rol?.toLowerCase() !== "administrador" && (
                <div className="col-md-6 mb-4">
                  <label className="form-label small fw-bold text-muted">Documento</label>
                  {/*
                    Input deshabilitado que muestra el documento (solo lectura)
                  */}
                  <input type="text" className="form-control" value={user.documento} disabled style={{ borderRadius: "10px", padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }} />
                </div>
              )}
              {/*
                Campo de rol del sistema (siempre visible, solo lectura)
              */}
              <div className={user.rol?.toLowerCase() === "administrador" ? "col-12 mb-4" : "col-md-6 mb-4"}>
                <label className="form-label small fw-bold text-muted">Rol en el Sistema</label>
                <input type="text" className="form-control" value={user.rol} disabled style={{ borderRadius: "10px", padding: "12px", background: "#f8fafc", border: "1px solid #e2e8f0" }} />
              </div>
            </div>
            {/*
              Campos de ficha solo visibles para no administradores
            */}
            {user.rol?.toLowerCase() !== "administrador" && (
              <div className="row">
                <div className="col-md-6 mb-4">
                  {/*
                    Campo para editar el número de ficha
                  */}
                  <label className="form-label small fw-bold text-muted">Número de Ficha</label>
                  <input 
                    type="text" className="form-control" 
                    value={formData.numero_ficha} 
                    onChange={(e) => setFormData({...formData, numero_ficha: e.target.value})}
                    style={{ borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}
                  />
                </div>
                <div className="col-md-6 mb-4">
                  {/*
                    Campo para editar el nombre de la ficha o grupo
                  */}
                  <label className="form-label small fw-bold text-muted">Nombre de la Ficha / Grupo</label>
                  <input 
                    type="text" className="form-control" 
                    value={formData.nombre_ficha} 
                    onChange={(e) => setFormData({...formData, nombre_ficha: e.target.value})}
                    style={{ borderRadius: "10px", padding: "12px", border: "1px solid #e2e8f0" }}
                  />
                </div>
              </div>
            )}

            {/*
              Checkbox "¿Es SENA Empresa?" solo para no administradores
            */}
            {user.rol?.toLowerCase() !== "administrador" && (
              <div className="form-check d-flex align-items-center gap-2 mb-4" style={{ paddingLeft: "5px" }}>
                <input 
                  className="form-check-input" type="checkbox" id="es_sena_empresa"
                  checked={formData.es_sena_empresa} 
                  onChange={(e) => setFormData({...formData, es_sena_empresa: e.target.checked})}
                  style={{ width: "17px", height: "17px", cursor: "pointer", border: "1px solid #cbd5e1" }} 
                />
                <label className="form-check-label small fw-bold text-muted" htmlFor="es_sena_empresa" style={{ cursor: "pointer", userSelect: "none", margin: 0 }}>
                  ¿Es SENA Empresa?
                </label>
              </div>
            )}
            {/*
              Botón para guardar los cambios del perfil
            */}
            <button type="submit" className="btn w-100 text-white fw-bold mt-2" style={{ background: "#0077B6", borderRadius: "10px", padding: "12px" }}>
              <i className="fas fa-save me-2"></i> Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
