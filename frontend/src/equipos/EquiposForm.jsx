// Archivo: EquiposForm.jsx — Formulario de creación/edición de equipos con carga de foto y selección de cuentadante

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
    id_cuentadante: "",
    observaciones: "",
    foto_equipo: null,
    previewFoto: "",
    estado: 1
  });
  // Estado que almacena la lista de cuentadantes disponibles
  const [cuentadantes, setCuentadantes] = useState([]);
  // Estado que indica si se están cargando los cuentadantes
  const [loadingCuentadantes, setLoadingCuentadantes] = useState(false);
  // Estado que indica si se está guardando el formulario
  const [loading, setLoading] = useState(false);
  // Efecto que carga la lista de cuentadantes al montar el componente
  useEffect(() => {
    cargarCuentadantes();
  }, []);
  // Función asíncrona para obtener los cuentadantes desde la API
  const cargarCuentadantes = async () => {
    setLoadingCuentadantes(true);
    try {
      const token = sessionStorage.getItem("token");
      const res = await apiAxios.get("/api/cuentadante", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCuentadantes(res.data);
    } catch (error) {
      console.error("Error al cargar cuentadantes:", error);
      Swal.fire("Error", "No se pudieron cargar los cuentadantes", "error");
    } finally {
      setLoadingCuentadantes(false);
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
        id_cuentadante: selectedEquipo.id_cuentadante || "",
        observaciones: selectedEquipo.observaciones || "",
        foto_equipo: null,
        previewFoto: selectedEquipo.foto_equipo
          ? (selectedEquipo.foto_equipo.startsWith("http") 
              ? selectedEquipo.foto_equipo 
              : `http://localhost:8000/uploads/${selectedEquipo.foto_equipo}`)
          : "",
        estado: selectedEquipo.estado ?? 1
      });
    } else {
      setForm({
        grupo_equipo: "",
        nom_equipo: "",
        marca_equipo: "",
        no_placa: "",
        id_cuentadante: "",
        observaciones: "",
        foto_equipo: null,
        previewFoto: "",
        estado: 1
      });
    }
  }, [selectedEquipo]);
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
        id_cuentadante: "", 
        observaciones: "", 
        foto_equipo: null, 
        previewFoto: "", 
        estado: 1
      });
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
        {/* Selector de cuentadante responsable */}
        <div className="col-md-6">
          <label>Cuentadante (Responsable)</label>
          <select 
            className="form-select" 
            name="id_cuentadante" 
            value={form.id_cuentadante} 
            onChange={handleChange} 
            required
            disabled={loadingCuentadantes}
          >
            <option value="">Seleccione cuentadante...</option>
            {cuentadantes.map(c => (
              <option key={c.id_cuentadante} value={c.id_cuentadante}>
                {c.nom_cuentadante} {c.apell_cuentadante}
              </option>
            ))}
          </select>
          {loadingCuentadantes && <small className="text-muted">Cargando cuentadantes...</small>}
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
