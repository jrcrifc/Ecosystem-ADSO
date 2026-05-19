import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import * as bootstrap from 'bootstrap';

export default function EquipoForm({ selectedEquipo, refreshParent, hideModal }) {
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

  const [cuentadantes, setCuentadantes] = useState([]);
  const [loadingCuentadantes, setLoadingCuentadantes] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar lista de cuentadantes
  useEffect(() => {
    cargarCuentadantes();
  }, []);

  const cargarCuentadantes = async () => {
    setLoadingCuentadantes(true);
    try {
      const token = sessionStorage.getItem("token");
      
      const res = await apiAxios.get("/api/cuentadante", {   // ← Ruta corregida
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

  // Cargar datos cuando se edita un equipo
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
          ? `http://localhost:8000/uploads/${selectedEquipo.foto_equipo}`
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto_equipo" && files?.[0]) {
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

  const saveData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }

      const data = new FormData();

      Object.keys(form).forEach(key => {
        if (key !== "foto_equipo" && key !== "previewFoto") {
          if (form[key] !== null && form[key] !== undefined && form[key] !== "") {
            data.append(key, form[key]);
          }
        }
      });

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
        await apiAxios.put(`/api/equipos/${selectedEquipo.id_equipo}`, data, config);
      } else {
        await apiAxios.post("/api/equipos", data, config);
      }

      Swal.fire({
        icon: "success",
        title: selectedEquipo ? "¡Actualizado!" : "¡Guardado!",
        timer: 1800,
        showConfirmButton: false
      });

      if (refreshParent) refreshParent();
      if (hideModal) hideModal();

      // Limpiar formulario después de guardar
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
        <div className="col-md-6">
          <label>Grupo del equipo</label>
          <select className="form-select" name="grupo_equipo" value={form.grupo_equipo} onChange={handleChange} required>
            <option value="">Seleccione grupo...</option>
            <option value="Equipo de Laboratorio">Equipo de Laboratorio</option>
            <option value="Maquinaria, Equipos y Herramientas">Maquinaria, Equipos y Herramientas</option>
          </select>
        </div>

        <div className="col-md-6">
          <label>Nombre del equipo</label>
          <input className="form-control" name="nom_equipo" value={form.nom_equipo} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label>Marca</label>
          <input className="form-control" name="marca_equipo" value={form.marca_equipo} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label>N° Placa / Serial</label>
          <input className="form-control" name="no_placa" value={form.no_placa} onChange={handleChange} />
        </div>

        {/* SELECT DE CUENTADANTES */}
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

        <div className="col-12">
          <label>Observaciones</label>
          <textarea className="form-control" name="observaciones" value={form.observaciones} onChange={handleChange} rows="3" />
        </div>

        <div className="col-12">
          <label>Foto del equipo</label>
          <input type="file" className="form-control" name="foto_equipo" accept="image/*" onChange={handleChange} />
        </div>

        <div className="col-12">
          <label>Estado</label>
          <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        className="btn w-100 mt-4"
        style={{ background: "#0077B6", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
        onClick={saveData}
        disabled={loading}
      >
        {loading ? "Guardando..." : selectedEquipo ? "Actualizar Equipo" : "Guardar Equipo"}
      </button>
    </form>
  );
}