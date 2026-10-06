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
    <form className="p-4" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Datos Básicos */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "4px" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#065f46" }}>
          📝 Datos Básicos
        </p>
      </div>
      
      <div>
        <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Documento</label>
        <input style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} name="documento" value={form.documento} onChange={handleChange} placeholder="Solo números" required />
      </div>
      <div>
        <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nombres y Apellidos</label>
        <input style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} name="nombres_apellidos" value={form.nombres_apellidos} onChange={handleChange} required />
      </div>
      <div>
        <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Correo electrónico institucional</label>
        <input type="email" style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Teléfono de contacto</label>
        <input style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} name="telefono" value={form.telefono} onChange={handleChange} placeholder="Opcional" />
      </div>

      {/* Vinculación */}
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "4px", marginTop: "4px" }}>
        <p style={{ margin: 0, fontSize: "11px", color: "#065f46" }}>
          🏷️ Vinculación
        </p>
      </div>

      <div>
        <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Tipo de vinculación</label>
        <select style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }} name="tipo_vinculacion" value={form.tipo_vinculacion} onChange={handleChange}>
          <option value="">Seleccione...</option>
          <option value="Instructor de planta">Instructor de planta</option>
          <option value="Instructor por prestacion de servicios">Instructor por prestación de servicios</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <button type="button" onClick={hideModal}
          style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
          Cancelar
        </button>
        <button
          type="button"
          onClick={saveData}
          disabled={loading}
          style={{ flex: 2, padding: "8px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontSize: "13px", opacity: loading ? 0.75 : 1 }}
        >
          {loading ? "Guardando..." : selectedInstructor ? "✅ Actualizar Instructor" : "✅ Guardar Instructor"}
        </button>
      </div>
    </form>
  );
}
