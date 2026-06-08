// Importa hooks de estado y efecto para manejar datos de configuración
import { useState, useEffect } from "react";
// Importa la instancia de Axios con el interceptor de JWT
import apiAxios from "../api/axiosConfig.js";
// Importa SweetAlert2 para notificaciones toast
import Swal from "sweetalert2";
// Importa iconos para cada tipo de configuración SMTP
import { FaEnvelope, FaKey, FaServer, FaPlug, FaSave } from "react-icons/fa";

// Componente de administración de configuración SMTP
const ConfiguracionEmail = () => {
  // Lista de configuraciones del correo (EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT)
  const [configs, setConfigs] = useState([]);
  // Indicador de carga mientras se obtienen las configuraciones
  const [loading, setLoading] = useState(true);

  // Carga las configuraciones al montar el componente
  useEffect(() => {
    cargarConfigs();
  }, []);

  // Obtiene la lista de configuraciones del servidor
  const cargarConfigs = async () => {
    try {
      // Solicita las configuraciones al endpoint de configuración
      const res = await apiAxios.get("/api/config");
      setConfigs(res.data);
    } catch (error) {
      console.error("Error al cargar configs:", error);
    } finally {
      // Desactiva el estado de carga
      setLoading(false);
    }
  };

  // Envía la actualización de una configuración al backend
  const handleUpdate = async (clave, valor) => {
    try {
      // Envía la clave y valor actualizados al servidor
      await apiAxios.put("/api/config", { clave, valor });
      // Muestra notificación toast de éxito
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Actualizado',
        showConfirmButton: false,
        timer: 1500
      });
      // Recarga la lista de configuraciones para reflejar el cambio
      cargarConfigs();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la configuración", "error");
    }
  };

  // Actualiza el estado local cuando el usuario modifica un campo (sin guardar aún)
  const handleChangeLocal = (clave, valor) => {
    // Mapea el array y actualiza solo la configuración que coincide con la clave
    setConfigs(prev => prev.map(c => c.clave === clave ? { ...c, valor } : c));
  };

  // Devuelve el ícono correspondiente según la clave de configuración
  const getIcon = (clave) => {
    // Icono de sobre para el usuario de email
    if (clave === 'EMAIL_USER') return <FaEnvelope className="text-primary" />;
    // Icono de llave para la contraseña de email
    if (clave === 'EMAIL_PASS') return <FaKey className="text-warning" />;
    // Icono de servidor para el host SMTP
    if (clave === 'EMAIL_HOST') return <FaServer className="text-info" />;
    // Icono de enchufe para el puerto SMTP
    if (clave === 'EMAIL_PORT') return <FaPlug className="text-secondary" />;
    // Icono por defecto
    return <FaSave />;
  };

  // Muestra indicador de carga mientras se obtienen las configuraciones
  if (loading) return <div className="text-center mt-5">Cargando configuración...</div>;

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      {/*
        Encabezado de la página con título y descripción
      */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        {/*
          Línea decorativa azul sobre el título
        */}
        <div style={{ height: "3px", width: "40px", background: "#0077B6", borderRadius: "99px", margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0077B6", margin: 0 }}>
          Configuración de Envío de Email
        </h2>
        <p className="text-muted">Administra el correo oficial del laboratorio para notificaciones y recuperación de claves.</p>
      </div>

      {/*
        Tarjeta principal con el listado de configuraciones
      */}
      <div className="card shadow-sm border-0" style={{ borderRadius: "20px" }}>
        <div className="card-body p-4">
          {/*
            Alerta informativa sobre cambios inmediatos
          */}
          <div className="alert alert-info" style={{ borderRadius: "12px", fontSize: "14px" }}>
            <i className="fas fa-info-circle me-2"></i>
            Los cambios realizados aquí se aplicarán inmediatamente sin necesidad de reiniciar el servidor.
          </div>

          {/*
            Grid con las configuraciones SMTP
          */}
          <div className="row g-4">
            {configs.map((config) => (
              <div key={config.id_config} className="col-12">
                {/*
                  Etiqueta con descripción y clave de la configuración
                */}
                <label className="form-label fw-bold text-muted small mb-2 d-block">
                  {config.descripcion} ({config.clave})
                </label>
                <div className="input-group">
                  {/*
                    Icono representativo del tipo de configuración
                  */}
                  <span className="input-group-text bg-white border-end-0" style={{ borderRadius: "12px 0 0 12px" }}>
                    {getIcon(config.clave)}
                  </span>
                  {/*
                    Input editable que guarda al perder el foco
                  */}
                  <input
                    // Muestra password como campo oculto para EMAIL_PASS
                    type={config.clave === 'EMAIL_PASS' ? "password" : "text"}
                    className="form-control border-start-0"
                    style={{ borderRadius: "0 12px 12px 0", background: "#f8fafc" }}
                    value={config.valor}
                    // Actualiza el estado local mientras se escribe
                    onChange={(e) => handleChangeLocal(config.clave, e.target.value)}
                    // Guarda automáticamente al salir del campo
                    onBlur={(e) => handleUpdate(config.clave, e.target.value)}
                  />
                </div>
                {/*
                  Sugerencia para contraseña de aplicación de Gmail
                */}
                {config.clave === 'EMAIL_PASS' && (
                  <small className="text-muted mt-1 d-block" style={{ fontSize: "11px" }}>
                    Recuerda usar una <strong>Contraseña de Aplicación</strong> de 16 caracteres si usas Gmail.
                  </small>
                )}
              </div>
            ))}
          </div>

          {/*
            Pie de la tarjeta con botón informativo
          */}
          <div className="mt-5 pt-3 border-top text-center">
            {/*
              Botón que muestra información sobre guardado automático
            */}
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
