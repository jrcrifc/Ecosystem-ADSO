import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import * as bootstrap from 'bootstrap';

export default function EquipoForm({ selectedEquipo, refreshParent }) {

  const [form, setForm] = useState({
    grupo_equipo: "",
    nom_equipo: "",
    marca_equipo: "",
    no_placa: "",
    id_usuario_cuentadante: "",
    observaciones: "",
    foto_equipo: null,
    previewFoto: "",
    estado: 1
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEquipo) {
      setForm({
        grupo_equipo: selectedEquipo.grupo_equipo || "",
        nom_equipo: selectedEquipo.nom_equipo || "",
        marca_equipo: selectedEquipo.marca_equipo || "",
        no_placa: selectedEquipo.no_placa || "",
        id_usuario_cuentadante: selectedEquipo.id_usuario_cuentadante || "",
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
        id_usuario_cuentadante: "",
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
      console.log("Foto seleccionada:", file.name, file.size, file.type);
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
      const data = new FormData();

      Object.keys(form).forEach(key => {
        if (key !== "foto_equipo" && key !== "previewFoto") {
          const val = form[key];
          if (val !== null && val !== undefined && val !== "") {
            data.append(key, val);
          }
        }
      });

      if (form.foto_equipo instanceof File) {
        data.append("foto_equipo", form.foto_equipo);
        console.log("Enviando foto nueva:", form.foto_equipo.name);
      } else {
        console.log("No se envía foto (sin archivo nuevo)");
      }

      console.log("FormData enviada:");
      for (let [key, value] of data.entries()) {
        console.log(key, ':', value instanceof File ? value.name : value);
      }

      if (selectedEquipo) {
        await apiAxios.put(`/api/equipos/${selectedEquipo.id_equipo}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await apiAxios.post("/api/equipos", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      Swal.fire({
        icon: "success",
        title: selectedEquipo ? "¡Actualizado!" : "¡Guardado!",
        text: selectedEquipo ? "Equipo actualizado correctamente" : "Equipo registrado correctamente",
        timer: 1800,
        showConfirmButton: false
      });

      if (refreshParent) refreshParent();

      // Limpiamos el file y mantenemos preview si se subió nueva foto
      setForm(prev => ({
        ...prev,
        foto_equipo: null, // limpiamos el File (evita memory leak)
        previewFoto: form.foto_equipo instanceof File 
          ? URL.createObjectURL(form.foto_equipo) 
          : prev.previewFoto
      }));

      document.activeElement?.blur();

      const modalElement = document.getElementById("modalEquipo");
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
      }

    } catch (error) {
      console.error("Error al guardar:", error);

      let msg = "No se pudo guardar";
      if (error.response?.data?.message) msg = error.response.data.message;
      if (error.response?.status === 500) msg = "Error 500 en backend – revisa terminal";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg
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
            onError={(e) => {
              console.error("Error cargando foto:", form.previewFoto);
              e.target.src = "/img/no-image.png";
            }}
          />
          <small style={{ display: 'block', color: '#666', marginTop: '5px' }}>
            Ruta: {form.previewFoto.substring(0, 80)}...
          </small>
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

        <div className="col-md-6">
          <label>ID Cuentadante</label>
          <input className="form-control" name="id_usuario_cuentadante" value={form.id_usuario_cuentadante} onChange={handleChange} type="number" />
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
        className="btn btn-success w-100 mt-4"
        onClick={saveData}
        disabled={loading}
        data-bs-dismiss="modal"
      >
        {loading ? "Guardando..." : selectedEquipo ? "Actualizar Equipo" : "Guardar Equipo"}
      </button>
    </form>
  );
}