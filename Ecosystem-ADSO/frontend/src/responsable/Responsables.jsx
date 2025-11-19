import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";

export default function Responsables({ hideModal, selectedResponsable }) {
  const [form, setForm] = useState({
    documento: "",
    nombre: "",
    apellido: "",
    correo_responsable: "",
    numero_telefono: "",
    estado: 1,
  });

  useEffect(() => {
    if (selectedResponsable) {
      setForm({
        documento: selectedResponsable.documento || "",
        nombre: selectedResponsable.nombre || "",
        apellido: selectedResponsable.apellido || "",
        correo_responsable: selectedResponsable.correo_responsable || "",
        numero_telefono: selectedResponsable.numero_telefono || "",
        estado: selectedResponsable.estado ?? 1,
      });
    } else {
      setForm({
        documento: "",
        nombre: "",
        apellido: "",
        correo_responsable: "",
        numero_telefono: "",
        estado: 1,
      });
    }
  }, [selectedResponsable]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "estado" ? parseInt(value) : value });
  };

  const saveData = async () => {
    try {
      if (selectedResponsable) {
        await apiAxios.put(`api/responsable/${selectedResponsable.documento}`, form);
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
        <label>Documento</label>
        <input
          type="text"
          className="form-control"
          name="documento"
          value={form.documento}
          onChange={handleChange}
          disabled={!!selectedResponsable}
        />
      </div>

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
        <input type="email" className="form-control" name="correo_responsable" value={form.correo_responsable} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Teléfono</label>
        <input type="text" className="form-control" name="numero_telefono" value={form.numero_telefono} onChange={handleChange} />
      </div>

      <div className="mb-3">
        <label>Estado</label>
        <select className="form-control" name="estado" value={form.estado} onChange={handleChange}>
          <option value={1}>Activo</option>
          <option value={0}>Inactivo</option>
        </select>
      </div>

      <div className="d-grid">
        <button type="button" className="btn btn-success" onClick={saveData}>
          {selectedResponsable ? "Actualizar" : "Guardar"}
        </button>
      </div>
    </form>
  );
}
