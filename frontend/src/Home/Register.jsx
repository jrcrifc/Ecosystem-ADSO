// Importa React y hooks para manejar estado y efectos
import React, { useState, useEffect } from "react";
// Importa useNavigate para redirigir al usuario después del registro
import { useNavigate } from "react-router-dom";
// Importa la instancia de Axios configurada para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa la imagen de fondo para la página de registro
import fondoRegistro from "../Home/laboratorio.png";
// Importa el logo de Ecosystem
import logo from "../Home/ecosystem_logo.png";

// Define el componente Register con el formulario de registro de usuarios
const Register = () => {
  // Hook para navegar a otras rutas programáticamente
  const navigate = useNavigate();

  // Estado del formulario con todos los campos de registro (sin password, ya que será el documento)
  const [form, setForm] = useState({
    documento: "",
    nombres_apellidos: "",
    email: "",
    rol: "Pasante",
    id_programa: "",
    id_ficha: ""
  });

  // Estados para programas y fichas
  const [programas, setProgramas] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [fichasFiltradas, setFichasFiltradas] = useState([]);

  // Cargar programas y fichas al montar el componente
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resProg = await apiAxios.get('/api/programas');
        setProgramas(resProg.data);
        const resFich = await apiAxios.get('/api/fichas');
        setFichas(resFich.data);
      } catch (error) {
        console.error("Error cargando programas o fichas", error);
      }
    };
    fetchDatos();
  }, []);

  // Estado para mensajes de error generales
  const [error, setError] = useState("");
  // Estado para mensajes de éxito
  const [success, setSuccess] = useState("");
  // Estado que indica si la petición de registro está en curso
  const [loading, setLoading] = useState(false);
  // Estado para errores de validación en tiempo real por campo
  const [fieldErrors, setFieldErrors] = useState({});

  // Estilo compartido para los mensajes de error inline
  const errorStyle = { color: "#dc2626", fontSize: "11px", marginTop: "4px", fontWeight: "600" };

  // Maneja los cambios en los campos del formulario con validación en tiempo real
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Solo permite dígitos en el campo de documento
    if (name === "documento" && value !== "" && !/^\d+$/.test(value)) return;
    // Rechaza números en el campo de nombres
    if (name === "nombres_apellidos" && /\d/.test(value)) return;

    // Determina el valor según el tipo de campo (checkbox o texto)
    let val = type === "checkbox" ? checked : value;
    // Convierte el email a minúsculas y elimina espacios automáticamente
    if (name === "email") {
      val = (value || "").replace(/\s/g, "").toLowerCase();
    }

    // Actualiza el estado del formulario con el nuevo valor
    setForm({ ...form, [name]: val });

    // Filtrar fichas si se selecciona un programa
    if (name === "id_programa") {
      setFichasFiltradas(fichas.filter(f => String(f.id_programa) === String(val)));
      setForm(prev => ({ ...prev, id_programa: val, id_ficha: "" }));
    }

    // Actualiza los errores de validación en tiempo real
    const errors = { ...fieldErrors };
    // Valida que el documento tenga al menos 6 dígitos
    if (name === "documento") {
      if (value.length > 0 && value.length < 6) errors.documento = "Mínimo 6 dígitos.";
      else delete errors.documento;
    }
    // Valida que se ingresen nombres y apellidos completos
    if (name === "nombres_apellidos") {
      if (value && value.trim().split(" ").length < 2) errors.nombres_apellidos = "Ingresa nombres y apellidos completos.";
      else delete errors.nombres_apellidos;
    }
    // Valida que el email tenga formato correcto
    if (name === "email") {
      if (value && !value.includes("@")) errors.email = "Falta el @ en el correo.";
      else if (value && (!value.includes(".") || value.split(".").pop().length < 2)) errors.email = "Falta el dominio (ej. .com, .co)";
      else delete errors.email;
    }
    setFieldErrors(errors);
  };

  // Envía los datos de registro al backend
  const registrarUsuario = async (e) => {
    // Previene el envío por defecto del formulario
    e.preventDefault();
    // Limpia mensajes anteriores
    setError("");
    setSuccess("");

    // Prepara los datos limpiando espacios y normalizando
    const docTrim = form.documento.trim();
    const nombreTrim = form.nombres_apellidos.trim();
    const emailTrim = form.email.trim().toLowerCase();
    // Validaciones finales antes de enviar al servidor
    if (docTrim.length < 5) return setError("El documento es demasiado corto.");
    if (nombreTrim.split(" ").length < 2) return setError("Por favor, ingresa nombres y apellidos completos.");
    if (!form.id_programa) return setError("El programa es obligatorio.");
    if (!form.id_ficha) return setError("La ficha es obligatoria.");

    // Activa el indicador de carga
    setLoading(true);

    try {
      // Construye el payload con los datos del formulario
      const data = {
        documento: docTrim,
        nombres_apellidos: nombreTrim,
        email: emailTrim,
        rol: form.rol,
        id_programa: form.id_programa,
        id_ficha: form.id_ficha
      };

      // Envía la petición POST al backend para crear el nuevo usuario
      await apiAxios.post("/api/auth", data);

      // Muestra mensaje de éxito y reinicia el formulario
      setSuccess("✅ Registro exitoso. Tu cuenta está en revisión por el administrador.");
      setForm({
        documento: "",
        nombres_apellidos: "",
        email: "",
        rol: "Pasante",
        id_programa: "",
        id_ficha: ""
      });

      // Redirige al login después de 4 segundos
      setTimeout(() => navigate("/UserLogin"), 4000);
    } catch (err) {
      // Muestra el error del servidor o un mensaje genérico
      setError(err.response?.data?.message || "Error al registrar el usuario. Revisa los datos.");
    } finally {
      // Desactiva el indicador de carga
      setLoading(false);
    }
  };

  return (
    // Contenedor principal que ocupa toda la pantalla
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        height: "100vh", width: "100vw",
        overflowY: "auto", overflowX: "hidden",
        zIndex: 9999,
        display: "grid", placeItems: "center", padding: "20px"
      }}
    >
      {/* Definición de animaciones CSS para el registro */}
      <style>{`
        @keyframes bubble {
          0% { transform: translateY(0) translateX(0px); opacity: 0; }
          10% { opacity: 0.75; }
          50% { transform: translateY(-60vh) translateX(8px); opacity: 0.75; }
          100% { transform: translateY(-120vh) translateX(-8px); opacity: 0; }
        }

        @keyframes textFlow {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .flowing-title {
          background: linear-gradient(120deg, #0077B6, #00B4D8, #6366F1, #0077B6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: textFlow 6s linear infinite;
          display: inline-block;
        }

        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }

        .register-card {
          width: 100%;
          max-width: 420px;
          padding: 25px 30px;
          border-radius: 24px;
          background: rgba(255,255,255,0.91);
          color: #1f2937;
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255,255,255,0.6);
          animation: cardEntrance 0.7s cubic-bezier(0.16,1,0.3,1) both;
          position: relative;
          z-index: 10;
          margin: auto;
        }

        @media (max-width: 480px) {
          .register-card {
            padding: 20px 15px !important;
          }
        }

        .form-control:focus {
          border-color: #6366F1 !important;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.25) !important;
          background: #fff !important;
        }

        .input-icon {
          transition: all 0.3s ease;
        }
        .position-relative:has(.form-control:focus) .input-icon {
          transform: scale(1.22);
          color: #6366F1 !important;
        }

        .hologram-grid {
          position: fixed; inset: 0; z-index: 1;
          background-image: linear-gradient(rgba(0, 180, 216, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 216, 0.035) 1px, transparent 1px);
          background-size: 45px 45px; pointer-events: none;
        }
      `}</style>

      {/* Fondo de pantalla con imagen del laboratorio */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `url(${fondoRegistro})`,
        backgroundSize: "cover", backgroundPosition: "center",
      }} />

      {/* Capa decorativa de cuadrícula holográfica */}
      <div className="hologram-grid" />

      {/* Contenedor de burbujas flotantes animadas */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9, pointerEvents: "none", overflow: "hidden" }}>
        {[
          { size: 45, left: 3, delay: 0.5, dur: 12 }, { size: 75, left: 18, delay: 2.1, dur: 18 },
          { size: 30, left: 25, delay: 4.3, dur: 10 }, { size: 90, left: 36, delay: 1.2, dur: 22 },
          { size: 55, left: 45, delay: 3.8, dur: 15 }, { size: 40, left: 52, delay: 0.8, dur: 11 },
          { size: 80, left: 63, delay: 5.4, dur: 19 }, { size: 65, left: 72, delay: 2.7, dur: 16 },
          { size: 35, left: 81, delay: 6.1, dur: 13 }, { size: 85, left: 91, delay: 8.2, dur: 24 },
          { size: 60, left: 12, delay: 3.3, dur: 14 }, { size: 50, left: 30, delay: 4.1, dur: 15 },
          { size: 70, left: 68, delay: 2.5, dur: 17 }, { size: 40, left: 76, delay: 0.6, dur: 10 },
          { size: 80, left: 88, delay: 6.4, dur: 20 }, { size: 45, left: 96, delay: 4.8, dur: 12 },
          { size: 30, left: 10, delay: 11.2, dur: 9 }, { size: 90, left: 54, delay: 2.3, dur: 23 },
          { size: 75, left: 20, delay: 7.1, dur: 18 }, { size: 55, left: 50, delay: 6.0, dur: 14 },
        ].map((p, i) => (
          // Burbuja individual con tamaño, posición y animación personalizados
          <div key={i} style={{
            position: "absolute", bottom: "-100px", left: `${p.left}%`,
            width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(0,180,216,0.15)" : "rgba(255,255,255,0.12)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            animation: `bubble ${p.dur}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }} />
        ))}
      </div>

      {/* Tarjeta de registro con el formulario */}
      <div className="register-card">
        {/* Título y logo de la página */}
        <div className="text-center mb-3">
          <h2 className="flowing-title" style={{ fontWeight: "800", fontSize: "22px", display: "inline-block" }}>
            Crear Cuenta
          </h2>
          <div style={{ marginTop: "10px" }}>
            <img src={logo} alt="Logo" style={{ width: "70px", height: "70px", borderRadius: "14px", border: "2.5px solid #0077B6", display: "block", margin: "0 auto" }} />
          </div>
        </div>

        {/* Muestra mensajes de error o éxito */}
        {error && <div className="alert alert-danger p-2 mb-3" style={{ fontSize: "12px", textAlign: "center", borderRadius: "10px", border: "none", background: "#fee2e2", color: "#991b1b" }}>{error}</div>}
        {success && <div className="alert alert-success p-2 mb-3" style={{ fontSize: "12px", textAlign: "center", borderRadius: "10px", border: "none", background: "#dcfce7", color: "#166534" }}>{success}</div>}

        {/* Formulario de registro */}
        <form onSubmit={registrarUsuario}>
          {/* Selector de tipo de usuario con botones de opción */}
          <div className="mb-3">
            <label style={{ fontSize: "12px", color: "#64748b", fontWeight: "600", marginBottom: "8px", display: "block" }}>¿Cuál es tu rol?</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {["Pasante", "Gestor"].map((rolValue) => (
                // Botón de rol individual con estilo activo/inactivo
                <div
                  key={rolValue}
                  onClick={() => setForm({ ...form, rol: rolValue })}
                  style={{
                    flex: 1, padding: "10px 4px", borderRadius: "12px",
                    textAlign: "center", cursor: "pointer", fontSize: "11px", fontWeight: "700",
                    border: form.rol === rolValue ? "2px solid #0077B6" : "2px solid #f1f5f9",
                    background: form.rol === rolValue ? "#0077B6" : "#f8fafc",
                    color: form.rol === rolValue ? "#fff" : "#64748b",
                    transition: "all 0.2s ease"
                  }}
                >
                  {rolValue}
                </div>
              ))}
            </div>
          </div>

          {/* Campo de documento de identidad */}
          <div className="row g-2 mb-2">
            <div className="col-12">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Documento de Identidad</label>
              <input className="form-control" name="documento" placeholder="Ingresa solo números"
                value={form.documento} onChange={handleChange} required style={inputStyle} maxLength={11} />
              {fieldErrors.documento && <div style={errorStyle}>{fieldErrors.documento}</div>}
            </div>
          </div>

          {/* Campo de nombres y apellidos */}
          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Nombres y Apellidos Completos</label>
            <input className="form-control" name="nombres_apellidos" placeholder="Ej: Juan Pérez"
              value={form.nombres_apellidos} onChange={handleChange} required style={inputStyle} />
            {fieldErrors.nombres_apellidos && <div style={errorStyle}>{fieldErrors.nombres_apellidos}</div>}
          </div>

          {/* Campo de correo electrónico */}
          <div className="mb-2">
            <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Correo Electrónico</label>
            <input className="form-control" type="email" name="email" placeholder="ejemplo@gmail.com"
              value={form.email} onChange={handleChange} required style={inputStyle} />
            {fieldErrors.email && <div style={errorStyle}>{fieldErrors.email}</div>}
          </div>

          {/* Selectores de Programa y Ficha */}
          <div className="row g-2 mb-4 mt-2">
            <div className="col-6">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Programa</label>
              <select className="form-control" name="id_programa" value={form.id_programa} onChange={handleChange} required style={inputStyle}>
                <option value="">Selecciona un Programa</option>
                {programas.map(p => (
                  <option key={p.id_programa} value={p.id_programa}>{p.nombre_programa}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="mb-1" style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Ficha</label>
              <select className="form-control" name="id_ficha" value={form.id_ficha} onChange={handleChange} required style={inputStyle} disabled={!form.id_programa}>
                <option value="">Selecciona una Ficha</option>
                {fichasFiltradas.map(f => (
                  <option key={f.id_ficha} value={f.id_ficha}>{f.numero_ficha}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón de envío del formulario */}
          <button type="submit" className="btn w-100 py-3" disabled={loading}
            style={{
              background: "#0077B6",
              color: "#fff", fontWeight: "800", borderRadius: "14px",
              fontSize: "15px", border: "none",
              boxShadow: "0 10px 20px rgba(0,119,182,0.2)",
              transition: "transform 0.2s"
            }}>
            {loading ? "Creando cuenta..." : "Crear mi Cuenta"}
          </button>

          {/* Enlace a la página de inicio de sesión */}
          <p className="mt-4 text-center" style={{ fontSize: "13px", color: "#64748b" }}>
            ¿Ya tienes cuenta?{" "}
            <span style={{ color: "#0077B6", cursor: "pointer", fontWeight: "700", textDecoration: "underline" }}
              onClick={() => navigate("/UserLogin")}>
              Inicia sesión aquí
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

// Estilos inline compartidos para los inputs del formulario
const inputStyle = {
  background: "#f9fafb", border: "1px solid #e5e7eb",
  borderRadius: "8px", padding: "8px 10px",
  fontSize: "13px", outline: "none"
};

export default Register;