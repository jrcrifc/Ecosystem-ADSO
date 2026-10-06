// Archivo: EquiposForm.jsx — Formulario de creación/edición de equipos con carga de foto y búsqueda de cuentadante por documento

// Importa hooks de React para estado y efectos
import { useEffect, useState } from "react";
// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";
// Importa Bootstrap para manipular modales
import * as bootstrap from 'bootstrap';

// Componente del formulario de equipo
export default function EquipoForm({ selectedEquipo, refreshParent, hideModal }) {
  // Estado local del formulario con todos los campos del equipo
  const [form, setForm] = useState({
    grupo_equipo: "Equipo de Laboratorio",
    nom_equipo: "",
    marca_equipo: "",
    no_placa: "",
    id_usuario: "",
    observaciones: "",
    foto_equipo: null,
    previewFoto: "",
    estado: 1
  });
  // Estado que almacena la lista de instructores disponibles
  const [instructores, setInstructores] = useState([]);
  // Estado que indica si se están cargando los instructores
  const [loadingInstructores, setLoadingInstructores] = useState(false);
  // Estado que indica si se está guardando el formulario
  const [loading, setLoading] = useState(false);
  // Estado para el campo de búsqueda de documento del cuentadante
  const [docBusqueda, setDocBusqueda] = useState("");
  // Estado del instructor encontrado al buscar por documento
  const [instructorEncontrado, setInstructorEncontrado] = useState(null);

  // Efecto que carga la lista de instructores al montar el componente
  useEffect(() => {
    cargarInstructores();
  }, []);
  // Función asíncrona para obtener los instructores desde la API
  const cargarInstructores = async () => {
    setLoadingInstructores(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await apiAxios.get("/api/instructores", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstructores(res.data);
    } catch (error) {
      console.error("Error al cargar instructores:", error);
      Swal.fire("Error", "No se pudieron cargar los instructores", "error");
    } finally {
      setLoadingInstructores(false);
    }
  };

  // Función que busca un instructor por su número de documento
  const buscarPorDocumento = (documento) => {
    setDocBusqueda(documento);
    if (!documento.trim()) {
      setInstructorEncontrado(null);
      setForm(prev => ({ ...prev, id_usuario: "" }));
      return;
    }
    // Busca coincidencia exacta o parcial en la lista de instructores
    const encontrado = instructores.find(
      (inst) => inst.documento === documento.trim()
    );
    if (encontrado) {
      setInstructorEncontrado(encontrado);
      setForm(prev => ({ ...prev, id_usuario: encontrado.id_usuario }));
    } else {
      setInstructorEncontrado(null);
      setForm(prev => ({ ...prev, id_usuario: "" }));
    }
  };

  // Efecto que carga los datos del equipo al editar o limpia el formulario al crear nuevo
  useEffect(() => {
    if (selectedEquipo) {
      setForm({
        grupo_equipo: selectedEquipo.grupo_equipo || "",
        nom_equipo: selectedEquipo.nom_equipo || "",
        marca_equipo: selectedEquipo.marca_equipo || "",
        no_placa: (selectedEquipo.no_placa && selectedEquipo.no_placa !== 0 && selectedEquipo.no_placa !== '0') ? selectedEquipo.no_placa : "",
        id_usuario: selectedEquipo.id_usuario || "",
        observaciones: selectedEquipo.observaciones || "",
        foto_equipo: null,
        previewFoto: selectedEquipo.foto_equipo
          ? (selectedEquipo.foto_equipo.startsWith("http") 
              ? selectedEquipo.foto_equipo 
              : `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${selectedEquipo.foto_equipo}`)
          : "",
        estado: selectedEquipo.estado ?? 1
      });
      // Si el equipo tiene instructor asignado, carga sus datos en la búsqueda
      if (selectedEquipo.instructor) {
        setDocBusqueda(selectedEquipo.instructor.documento || "");
        setInstructorEncontrado({
          documento: selectedEquipo.instructor.documento,
          nombres_apellidos: selectedEquipo.instructor.nombres_apellidos,
          id_usuario: selectedEquipo.id_usuario,
        });
      } else {
        // Busca en la lista de instructores cargados
        const inst = instructores.find(i => i.id_usuario === selectedEquipo.id_usuario);
        if (inst) {
          setDocBusqueda(inst.documento || "");
          setInstructorEncontrado(inst);
        } else {
          setDocBusqueda("");
          setInstructorEncontrado(null);
        }
      }
    } else {
      setForm({
        grupo_equipo: "Equipo de Laboratorio",
        nom_equipo: "",
        marca_equipo: "",
        no_placa: "",
        id_usuario: "",
        observaciones: "",
        foto_equipo: null,
        previewFoto: "",
        estado: 1
      });
      setDocBusqueda("");
      setInstructorEncontrado(null);
    }
  }, [selectedEquipo, instructores]);
  // Función que maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto_equipo" && files?.[0]) {
      // Si es el campo de foto, guarda el archivo y genera preview
      const file = files[0];
      setForm(prev => ({
        ...prev,
        foto_equipo: file,
        previewFoto: URL.createObjectURL(file)
      }));
    } else if (name === "marca_equipo") {
      // Permite solo letras y espacios
      const soloLetras = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      setForm(prev => ({ ...prev, [name]: soloLetras }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  // Función asíncrona para guardar (crear o actualizar) un equipo
  const saveData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }
      const data = new FormData();
      // Agrega todos los campos del formulario al FormData excepto foto y preview
      Object.keys(form).forEach(key => {
        if (key !== "foto_equipo" && key !== "previewFoto") {
          if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
            data.append(key, form[key]);
          }
        }
      });
      // Si hay un archivo de foto nuevo, lo agrega al FormData
      if (form.foto_equipo instanceof File) {
        data.append("foto_equipo", form.foto_equipo);
      }
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      };
      if (selectedEquipo) {
        // Actualiza el equipo existente vía PUT
        await apiAxios.put(`/api/equipos/${selectedEquipo.id_equipo}`, data, config);
      } else {
        // Crea un nuevo equipo vía POST
        await apiAxios.post("/api/equipos", data, config);
      }
      if (hideModal) hideModal();
      if (refreshParent) refreshParent();
      Swal.fire({
        icon: "success",
        title: selectedEquipo ? "¡Actualizado!" : "¡Guardado!",
        timer: 1800,
        showConfirmButton: false
      });
      // Limpia el formulario después de guardar
      setForm({
        grupo_equipo: "", 
        nom_equipo: "", 
        marca_equipo: "", 
        no_placa: "",
        id_usuario: "", 
        observaciones: "", 
        foto_equipo: null, 
        previewFoto: "", 
        estado: 1
      });
      setDocBusqueda("");
      setInstructorEncontrado(null);
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar el equipo"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtra sugerencias de instructores mientras se escribe el documento o nombre
  // Busca coincidencias parciales tanto en el campo documento como en nombres_apellidos
  const sugerencias = docBusqueda.trim().length > 0 && !instructorEncontrado
    ? instructores.filter(i => {
        const termino = docBusqueda.trim().toLowerCase();
        return i.documento.toLowerCase().includes(termino) ||
          (i.nombres_apellidos || '').toLowerCase().includes(termino);
      }).slice(0, 8)
    : [];

  return (
    <form style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }} onSubmit={(e) => { e.preventDefault(); saveData(); }}>
      
      {/* ===================== SECCIÓN 1: INFORMACIÓN GENERAL ===================== */}
      <div style={{ background: "#f0f7ff", border: "1px solid #dbeafe", borderRadius: "10px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "14px" }}>📦</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0077B6", letterSpacing: "0.3px", textTransform: "uppercase" }}>
          Información Básica del Equipo
        </span>
      </div>

      <div className="row g-3">
        {/* Grupo del equipo */}
        <div className="col-md-6">
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span>🏢</span> Grupo del Equipo <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <select
            name="grupo_equipo"
            value={form.grupo_equipo}
            onChange={handleChange}
            required
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b",
              backgroundColor: "#ffffff", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#0077B6"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
          >
            <option value="Equipo de Laboratorio">Equipo de Laboratorio</option>
          </select>
        </div>

        {/* Nombre del equipo */}
        <div className="col-md-6">
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span>🏷️</span> Nombre del Equipo <span style={{ color: "#dc2626" }}>*</span>
          </label>
          <input
            type="text"
            name="nom_equipo"
            value={form.nom_equipo}
            onChange={handleChange}
            placeholder="Ej: Microscopio Binocular"
            required
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b",
              outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#0077B6"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Marca del equipo */}
        <div className="col-md-6">
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span>🔖</span> Marca
          </label>
          <input
            type="text"
            name="marca_equipo"
            value={form.marca_equipo}
            onChange={handleChange}
            placeholder="Ej: Olympus (solo letras)"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b",
              outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#0077B6"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Número de placa o serial */}
        <div className="col-md-6">
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span>🔢</span> N° Placa / Serial
          </label>
          <input
            type="text"
            name="no_placa"
            value={form.no_placa}
            onChange={handleChange}
            placeholder="Ej: LAB-2026-004"
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b",
              outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#0077B6"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
          />
        </div>
      </div>

      {/* ===================== SECCIÓN 2: ASIGNACIÓN DE CUENTADANTE ===================== */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
        <span style={{ fontSize: "14px" }}>👨‍🏫</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#065f46", letterSpacing: "0.3px", textTransform: "uppercase" }}>
          Cuentadante Responsable (Instructor)
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <span>🔍</span> Buscar Instructor por Documento o Nombre
        </label>
        <input
          type="text"
          placeholder="Escribe para buscar instructor..."
          value={docBusqueda}
          onChange={(e) => buscarPorDocumento(e.target.value)}
          disabled={loadingInstructores}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "10px",
            border: `1.5px solid ${instructorEncontrado ? "#16a34a" : "#dbeafe"}`,
            backgroundColor: instructorEncontrado ? "#f0fdf4" : "#fff",
            fontSize: "13px", color: "#1e293b", outline: "none",
            transition: "all 0.2s ease"
          }}
          onFocus={(e) => {
            if (!instructorEncontrado) {
              e.target.style.borderColor = "#0077B6";
              e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)";
            }
          }}
          onBlur={(e) => {
            if (!instructorEncontrado) {
              e.target.style.borderColor = "#dbeafe";
              e.target.style.boxShadow = "none";
            }
          }}
        />
        {loadingInstructores && <small style={{ color: "#64748b", fontSize: "11px", marginTop: "4px", display: "block" }}>Cargando instructores...</small>}

        {/* Lista de sugerencias mientras escribe */}
        {sugerencias.length > 0 && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "#fff",
            border: "1.5px solid #dbeafe",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            maxHeight: "190px",
            overflowY: "auto",
            marginTop: "4px"
          }}>
            {sugerencias.map(inst => (
              <div
                key={inst.id_instructor}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: "12.5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #f1f5f9",
                  transition: "background 0.15s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#f0f7ff"}
                onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
                onClick={() => {
                  setDocBusqueda(inst.documento);
                  setInstructorEncontrado(inst);
                  setForm(prev => ({ ...prev, id_usuario: inst.id_usuario }));
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #0077B6, #023E8A)",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "700", fontSize: "12px"
                  }}>
                    {inst.nombres_apellidos?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ color: "#0f172a" }}>{inst.nombres_apellidos}</strong>
                    <div style={{ color: "#64748b", fontSize: "11px" }}>Doc: {inst.documento}</div>
                  </div>
                </div>
                <span style={{ fontSize: "10px", background: "#dbeafe", color: "#0077B6", padding: "2px 8px", borderRadius: "99px", fontWeight: "600" }}>
                  Instructor
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tarjeta del instructor seleccionado */}
        {instructorEncontrado && (
          <div style={{
            marginTop: "8px",
            padding: "10px 14px",
            background: "#f0fdf4",
            border: "1.5px solid #86efac",
            borderRadius: "10px",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "#16a34a", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "700", fontSize: "13px"
              }}>
                ✓
              </div>
              <div>
                <strong style={{ color: "#166534", display: "block" }}>{instructorEncontrado.nombres_apellidos}</strong>
                <span style={{ color: "#475569", fontSize: "11.5px" }}>Documento: {instructorEncontrado.documento}</span>
              </div>
            </div>
            <button
              type="button"
              style={{
                background: "#fee2e2", border: "none", color: "#dc2626",
                cursor: "pointer", width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "bold"
              }}
              title="Quitar cuentadante"
              onClick={() => {
                setDocBusqueda("");
                setInstructorEncontrado(null);
                setForm(prev => ({ ...prev, id_usuario: "" }));
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Mensaje cuando no se encuentra */}
        {docBusqueda.trim().length > 2 && !instructorEncontrado && sugerencias.length === 0 && !loadingInstructores && (
          <div style={{ color: "#dc2626", fontSize: "11.5px", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
            <span>⚠️</span> No se encontró ningún instructor con ese documento o nombre
          </div>
        )}
      </div>

      {/* ===================== SECCIÓN 3: DETALLES, FOTO Y ESTADO ===================== */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
        <span style={{ fontSize: "14px" }}>📸</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#475569", letterSpacing: "0.3px", textTransform: "uppercase" }}>
          Observaciones y Fotografía
        </span>
      </div>

      {/* Campo de observaciones */}
      <div>
        <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <span>📝</span> Observaciones
        </label>
        <textarea
          name="observaciones"
          value={form.observaciones}
          onChange={handleChange}
          rows="3"
          placeholder="Escribe notas sobre el estado físico, accesorios o detalles relevantes del equipo..."
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "10px",
            border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b",
            outline: "none", resize: "vertical", transition: "border-color 0.2s, box-shadow 0.2s"
          }}
          onFocus={(e) => { e.target.style.borderColor = "#0077B6"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)"; }}
          onBlur={(e) => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
        />
      </div>

      <div className="row g-3">
        {/* Campo de carga de foto */}
        <div className="col-md-7">
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span>📷</span> Fotografía del Equipo
          </label>
          <div style={{
            border: "1.5px dashed #93c5fd",
            background: "#f0f7ff",
            borderRadius: "10px",
            padding: "12px 16px",
            textAlign: "center",
            cursor: "pointer",
            transition: "background 0.2s"
          }}>
            <input
              type="file"
              id="foto_equipo_input"
              style={{ display: "none" }}
              name="foto_equipo"
              accept="image/*"
              onChange={handleChange}
            />
            <label htmlFor="foto_equipo_input" style={{ cursor: "pointer", margin: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "20px" }}>🖼️</span>
              <span style={{ fontSize: "12.5px", fontWeight: "600", color: "#0077B6" }}>
                {form.foto_equipo ? "Foto seleccionada (Clic para cambiar)" : "Haz clic para subir una fotografía"}
              </span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>PNG, JPG, WEBP hasta 5MB</span>
            </label>
          </div>
        </div>

        {/* Vista previa de foto */}
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          {form.previewFoto ? (
            <div style={{ position: "relative", textAlign: "center" }}>
              <img
                src={form.previewFoto}
                alt="Vista previa"
                style={{
                  maxWidth: "100%", maxHeight: "95px", borderRadius: "8px",
                  objectFit: "cover", border: "2px solid #0077B6", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                onError={(e) => { e.target.src = "/img/no-image.png"; }}
              />
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, foto_equipo: null, previewFoto: "" }))}
                style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  background: "#dc2626", color: "#fff", border: "none",
                  borderRadius: "50%", width: "20px", height: "20px", fontSize: "10px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}
                title="Eliminar foto"
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={{
              width: "100%", height: "85px", border: "1px dashed #cbd5e1",
              borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#94a3b8", fontSize: "11.5px", background: "#f8fafc"
            }}>
              Sin fotografía
            </div>
          )}
        </div>

        {/* Selector de estado activo/inactivo */}
        <div className="col-12">
          <label style={{ fontSize: "11.5px", fontWeight: "700", color: "#1e293b", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            <span>⚡</span> Estado en Inventario
          </label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "10px",
              border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b",
              backgroundColor: "#ffffff", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s"
            }}
            onFocus={(e) => { e.target.style.borderColor = "#0077B6"; e.target.style.boxShadow = "0 0 0 3px rgba(0, 119, 182, 0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#dbeafe"; e.target.style.boxShadow = "none"; }}
          >
            <option value={1}>🟢 Activo (Disponible para el laboratorio)</option>
            <option value={0}>🔴 Inactivo (Fuera de servicio / Retirado)</option>
          </select>
        </div>
      </div>
      
      {/* ===================== BOTONES DE ACCIÓN ===================== */}
      <div style={{ display: "flex", gap: "10px", marginTop: "8px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
        <button
          type="button"
          onClick={hideModal}
          style={{
            flex: 1, padding: "10px 16px", borderRadius: "10px",
            border: "1.5px solid #e2e8f0", background: "#f8fafc",
            color: "#64748b", fontWeight: "700", cursor: "pointer", fontSize: "13px",
            transition: "all 0.15s ease"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#334155"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#64748b"; }}
        >
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={loading}
          style={{
            flex: 2, padding: "10px 16px", borderRadius: "10px",
            border: "none", background: "linear-gradient(135deg, #0077B6, #023E8A)",
            color: "#fff", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
            fontSize: "13.5px", opacity: loading ? 0.75 : 1,
            boxShadow: "0 4px 12px rgba(0, 119, 182, 0.25)",
            transition: "transform 0.15s, box-shadow 0.15s"
          }}
          onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 119, 182, 0.35)"; } }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 119, 182, 0.25)"; }}
        >
          {loading ? "Guardando..." : selectedEquipo ? "✅ Actualizar Equipo" : "✅ Registrar Equipo"}
        </button>
      </div>
    </form>
  );
}
