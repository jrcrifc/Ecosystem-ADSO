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
    <form className="p-3">
      {/* Vista previa de la foto si existe */}
      {form.previewFoto && (
        <div className="mb-3 text-center">
          <img
            src={form.previewFoto}
            alt="Vista previa del equipo"
            style={{ maxWidth: "250px", maxHeight: "180px", borderRadius: "8px", border: "1px solid #ddd" }}
            onError={(e) => { e.target.src = "/img/no-image.png"; }}
          />
        </div>
      )}
      <div className="row g-3">
        {/* Selector de grupo del equipo */}
        <div className="col-md-6">
          <label>Grupo del equipo</label>
          <select className="form-select" name="grupo_equipo" value={form.grupo_equipo} onChange={handleChange} required>
            <option value="">Seleccione grupo...</option>
            <option value="Equipo de Laboratorio">Equipo de Laboratorio</option>
            <option value="Maquinaria, Equipos y Herramientas">Maquinaria, Equipos y Herramientas</option>
          </select>
        </div>
        {/* Campo de nombre del equipo */}
        <div className="col-md-6">
          <label>Nombre del equipo</label>
          <input className="form-control" name="nom_equipo" value={form.nom_equipo} onChange={handleChange} required />
        </div>
        {/* Campo de marca del equipo */}
        <div className="col-md-6">
          <label>Marca</label>
          <input className="form-control" name="marca_equipo" value={form.marca_equipo} onChange={handleChange} />
        </div>
        {/* Campo de número de placa o serial */}
        <div className="col-md-6">
          <label>N° Placa / Serial</label>
          <input className="form-control" name="no_placa" value={form.no_placa} onChange={handleChange} />
        </div>
        {/* Búsqueda de cuentadante por documento */}
        <div className="col-md-6" style={{ position: "relative" }}>
          <label>Cuentadante (Instructor)</label>
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por documento o nombre..."
            value={docBusqueda}
            onChange={(e) => buscarPorDocumento(e.target.value)}
            disabled={loadingInstructores}
            style={{
              borderColor: instructorEncontrado ? "#16a34a" : undefined,
              backgroundColor: instructorEncontrado ? "#f0fdf4" : undefined
            }}
          />
          {loadingInstructores && <small className="text-muted">Cargando instructores...</small>}
          {/* Lista de sugerencias mientras escribe */}
          {sugerencias.length > 0 && (
            <div style={{
              position: "absolute",
              zIndex: 10,
              width: "calc(100% - 24px)",
              background: "#fff",
              border: "1px solid #dbeafe",
              borderRadius: "0 0 8px 8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              maxHeight: "180px",
              overflowY: "auto"
            }}>
              {sugerencias.map(inst => (
                <div
                  key={inst.id_instructor}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: "13px",
                    borderBottom: "1px solid #f1f5f9"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#eef2ff"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
                  onClick={() => {
                    setDocBusqueda(inst.documento);
                    setInstructorEncontrado(inst);
                    setForm(prev => ({ ...prev, id_usuario: inst.id_usuario }));
                  }}
                >
                  <strong>{inst.documento}</strong> — {inst.nombres_apellidos}
                </div>
              ))}
            </div>
          )}
          {/* Tarjeta del instructor encontrado */}
          {instructorEncontrado && (
            <div style={{
              marginTop: "6px",
              padding: "8px 12px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <span>
                <i className="fas fa-user-check" style={{ color: "#16a34a", marginRight: "6px" }}></i>
                <strong>{instructorEncontrado.nombres_apellidos}</strong>
                <span style={{ color: "#64748b", marginLeft: "6px" }}>({instructorEncontrado.documento})</span>
              </span>
              <button
                type="button"
                style={{
                  background: "none", border: "none", color: "#dc2626", cursor: "pointer",
                  fontSize: "16px", padding: "0 4px"
                }}
                title="Quitar cuentadante"
                onClick={() => {
                  setDocBusqueda("");
                  setInstructorEncontrado(null);
                  setForm(prev => ({ ...prev, id_usuario: "" }));
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          {/* Mensaje cuando no se encuentra */}
          {docBusqueda.trim().length > 2 && !instructorEncontrado && sugerencias.length === 0 && !loadingInstructores && (
            <small style={{ color: "#dc2626", fontSize: "12px" }}>
              <i className="fas fa-exclamation-circle me-1"></i>
              No se encontró instructor con ese documento
            </small>
          )}
        </div>
        {/* Campo de observaciones */}
        <div className="col-12">
          <label>Observaciones</label>
          <textarea className="form-control" name="observaciones" value={form.observaciones} onChange={handleChange} rows="3" />
        </div>
        {/* Campo de carga de foto */}
        <div className="col-12">
          <label>Foto del equipo</label>
          <input type="file" className="form-control" name="foto_equipo" accept="image/*" onChange={handleChange} />
        </div>
        {/* Selector de estado activo/inactivo */}
        <div className="col-12">
          <label>Estado</label>
          <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>
      </div>
      {/* Botón de guardar */}
      <button
        type="button"
        className="btn w-100 mt-4"
        style={{ background: "#023E8A", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
        onClick={saveData}
        disabled={loading}
      >
        {loading ? "Guardando..." : selectedEquipo ? "Actualizar Equipo" : "Guardar Equipo"}
      </button>
    </form>
  );
}

