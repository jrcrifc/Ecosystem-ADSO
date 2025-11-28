import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";

export default function Responsables({ hideModal, selectedResponsable }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    numero_telefono: "",
    cargo: "",
  });

  useEffect(() => {
    if (selectedResponsable) {
      setForm({
        nombre: selectedResponsable.nombre || "",
        apellido: selectedResponsable.apellido || "",
        correo: selectedResponsable.correo || "",
        numero_telefono: selectedResponsable.numero_telefono || "",
        cargo: selectedResponsable.cargo || "",
      });
    } else {
      setForm({
        nombre: "",
        apellido: "",
        correo: "",
        numero_telefono: "",
        cargo: "",
      });
    }
  }, [selectedResponsable]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const saveData = async () => {
    try {
      if (selectedResponsable) {
        await apiAxios.put(`api/responsable/${selectedResponsable.id_responsable}`, form);
      } else {
        await apiAxios.post("api/responsable", form);
      }
      hideModal();
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error);
    }
  };

  return (
    <form>
      <div className="mb-3">
        <label>Nombre</label>
        <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Apellido</label>
        <input type="text" className="form-control" name="apellido" value={form.apellido} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Correo</label>
        <input type="email" className="form-control" name="correo" value={form.correo} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Teléfono</label>
        <input type="text" className="form-control" name="numero_telefono" value={form.numero_telefono} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Cargo</label>
        <input type="text" className="form-control" name="cargo" value={form.cargo} onChange={handleChange} />
      </div>

      <div className="d-grid">
        <button type="button" className="btn btn-success" onClick={saveData}>
          {selectedResponsable ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
