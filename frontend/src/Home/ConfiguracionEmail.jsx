import { useState, useEffect } from "react";
import apiAxios from "../api/axiosConfig.js";
import Swal from "sweetalert2";
import { FaEnvelope, FaKey, FaServer, FaPlug, FaSave } from "react-icons/fa";

const ConfiguracionEmail = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarConfigs();
  }, []);

  const cargarConfigs = async () => {
    try {
      const res = await apiAxios.get("/api/config");
      setConfigs(res.data);
    } catch (error) {
      console.error("Error al cargar configs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (clave, valor) => {
    try {
      await apiAxios.put("/api/config", { clave, valor });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Actualizado',
        showConfirmButton: false,
        timer: 1500
      });
      cargarConfigs();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la configuración", "error");
    }
  };

  const handleChangeLocal = (clave, valor) => {
    setConfigs(prev => prev.map(c => c.clave === clave ? { ...c, valor } : c));
  };

  const getIcon = (clave) => {
    if (clave === 'EMAIL_USER') return <FaEnvelope className="text-primary" />;
    if (clave === 'EMAIL_PASS') return <FaKey className="text-warning" />;
    if (clave === 'EMAIL_HOST') return <FaServer className="text-info" />;
    if (clave === 'EMAIL_PORT') return <FaPlug className="text-secondary" />;
    return <FaSave />;
  };

  if (loading) return <div className="text-center mt-5">Cargando configuración...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>
          Configuración de Envío de Email
        </h2>
        <p className="text-muted">Administra el correo oficial del laboratorio para notificaciones y recuperación de claves.</p>
      </div>

      <div className="card shadow-sm border-0" style={{ borderRadius: "20px" }}>
        <div className="card-body p-4">
          <div className="alert alert-info" style={{ borderRadius: "12px", fontSize: "14px" }}>
            <i className="fas fa-info-circle me-2"></i>
            Los cambios realizados aquí se aplicarán inmediatamente sin necesidad de reiniciar el servidor.
          </div>

          <div className="row g-4">
            {configs.map((config) => (
              <div key={config.id_config} className="col-12">
                <label className="form-label fw-bold text-muted small mb-2 d-block">
                  {config.descripcion} ({config.clave})
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px" }}>
                    {getIcon(config.clave)}
                  </span>
                  <input
                    type={config.clave === 'EMAIL_PASS' ? "password" : "text"}
                    className="form-control border-start-0"
                    style={{ borderRadius: "0 12px 12px 0", background: "#f8fafc" }}
                    value={config.valor}
                    onChange={(e) => handleChangeLocal(config.clave, e.target.value)}
                    onBlur={(e) => handleUpdate(config.clave, e.target.value)}
                  />
                </div>
                {config.clave === 'EMAIL_PASS' && (
                  <small className="text-muted mt-1 d-block" style={{ fontSize: "11px" }}>
                    Recuerda usar una <strong>Contraseña de Aplicación</strong> de 16 caracteres si usas Gmail.
                  </small>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-top text-center">
            <button 
              className="btn btn-outline-primary px-4" 
              style={{ borderRadius: "12px", fontWeight: "600" }}
              onClick={() => Swal.fire("Información", "Los cambios se guardan automáticamente al salir de cada campo de texto.", "info")}
            >
              <i className="fas fa-check-circle me-2"></i> Cambios guardados automáticamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionEmail;
