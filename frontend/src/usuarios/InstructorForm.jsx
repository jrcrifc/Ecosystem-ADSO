import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function InstructorForm({ selectedInstructor, refreshParent, hideModal }) {
  const [form, setForm] = useState({
    documento: "",
    nombres_apellidos: "",
    email: "",
    telefono: "",
    tipo_vinculacion: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedInstructor) {
      setForm({
        documento: selectedInstructor.documento || "",
        nombres_apellidos: selectedInstructor.nombres_apellidos || "",
        email: selectedInstructor.email || selectedInstructor.usuario?.email || "",
        telefono: selectedInstructor.telefono || "",
        tipo_vinculacion: selectedInstructor.tipo_vinculacion || ""
      });
    } else {
      setForm({
        documento: "",
        nombres_apellidos: "",
        email: "",
        telefono: "",
        tipo_vinculacion: ""
      });
    }
  }, [selectedInstructor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const saveData = async () => {
    setLoading(true);
    try {
      if (!form.documento.trim() || !form.nombres_apellidos.trim() || !form.email.trim()) {
        Swal.fire("Error", "Documento, Nombres y Correo son obligatorios", "warning");
        setLoading(false);
        return;
      }

      const payload = {
        documento: form.documento.trim(),
        nombres_apellidos: form.nombres_apellidos.trim(),
        email: form.email.trim(),
        telefono: form.telefono || null,
        tipo_vinculacion: form.tipo_vinculacion || null
      };

      if (selectedInstructor) {
        await apiAxios.put(`/api/instructores/${selectedInstructor.id_instructor}`, payload);
        Swal.fire({ icon: "success", title: "¡Actualizado!", timer: 1800, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/instructores", payload);
        Swal.fire({ icon: "success", title: "¡Guardado!", timer: 1800, showConfirmButton: false });
      }
      
      if (hideModal) hideModal();
      if (refreshParent) refreshParent();
      
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar el instructor"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-3">
      <div className="row g-3">
        {/* Datos Básicos */}
        <div className="col-12">
          <p style={{ fontWeight: "700", color: "#0077B6", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "0" }}>
            📝 Datos Básicos
          </p>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Documento</label>
          <input className="form-control" name="documento" value={form.documento} onChange={handleChange} placeholder="Solo números" required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Nombres y Apellidos</label>
          <input className="form-control" name="nombres_apellidos" value={form.nombres_apellidos} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Correo electrónico institucional</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Teléfono de contacto</label>
          <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Opcional" />
        </div>

        {/* Vinculación */}
        <div className="col-12 mt-4">
          <p style={{ fontWeight: "700", color: "#0077B6", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "0" }}>
            🏷️ Vinculación
          </p>
        </div>

        <div className="col-md-12">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Tipo de vinculación</label>
          <select className="form-select" name="tipo_vinculacion" value={form.tipo_vinculacion} onChange={handleChange}>
            <option value="">Seleccione...</option>
            <option value="Instructor de planta">Instructor de planta</option>
            <option value="Instructor por prestacion de servicios">Instructor por prestación de servicios</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        className="btn w-100 mt-4"
        style={{ background: "#023E8A", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
        onClick={saveData}
        disabled={loading}
      >
        {loading ? "Guardando..." : selectedInstructor ? "Actualizar Instructor" : "Guardar Instructor"}
      </button>
    </form>
  );
}
