import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function ProgramaForm({ selectedPrograma, refreshParent, hideModal }) {
  const [form, setForm] = useState({
    nombre_programa: "",
    estado: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPrograma) {
      setForm({
        nombre_programa: selectedPrograma.nombre_programa || "",
        estado: selectedPrograma.estado !== false ? 1 : 0
      });
    } else {
      setForm({
        nombre_programa: "",
        estado: 1
      });
    }
  }, [selectedPrograma]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const saveData = async () => {
    setLoading(true);
    try {
      if (!form.nombre_programa.trim()) {
        Swal.fire("Error", "El nombre del programa es obligatorio", "warning");
        setLoading(false);
        return;
      }

      const payload = {
        nombre_programa: form.nombre_programa.trim(),
        estado: form.estado == 1
      };

      if (selectedPrograma) {
        await apiAxios.put(`/api/programas/${selectedPrograma.id_programa}`, payload);
        Swal.fire({ icon: "success", title: "¡Actualizado!", timer: 1800, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/programas", payload);
        Swal.fire({ icon: "success", title: "¡Guardado!", timer: 1800, showConfirmButton: false });
      }
      
      if (hideModal) hideModal();
      if (refreshParent) refreshParent();
      
      // Limpiar
      setForm({ nombre_programa: "", estado: 1 });
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar el programa"
      });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderRadius: "10px",
    borderColor: "#e2e8f0",
    padding: "12px 14px",
    fontSize: "14px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease"
  };

  return (
    <form className="p-2" onSubmit={(e) => { e.preventDefault(); saveData(); }}>
      
      {/* Mensaje descriptivo */}
      <div style={{ background: "#f0f7ff", border: "1px solid #cce3ff", padding: "12px", borderRadius: "8px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
        <span style={{ fontSize: "20px" }}>🎓</span>
        <p style={{ margin: 0, fontSize: "13px", color: "#023E8A", fontWeight: "500" }}>
          Ingresa el nombre oficial del programa de formación para el SENA. Este nombre será utilizado en las fichas asociadas.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12">
          <label className="form-label fw-bold" style={{ color: "#0A1628", fontSize: "13px", marginBottom: "6px" }}>
            Nombre del programa <span className="text-danger">*</span>
          </label>
          <input 
            className="form-control" 
            name="nombre_programa" 
            placeholder="Ej: Análisis y Desarrollo de Software"
            value={form.nombre_programa} 
            onChange={handleChange} 
            required
            style={inputStyle}
          />
        </div>
        
        {selectedPrograma && (
          <div className="col-12">
            <label className="form-label fw-bold" style={{ color: "#0A1628", fontSize: "13px", marginBottom: "6px" }}>
              Estado del Programa
            </label>
            <select 
              className="form-select" 
              name="estado" 
              value={form.estado} 
              onChange={handleChange}
              style={inputStyle}
            >
              <option value={1}>✅ Activo</option>
              <option value={0}>🚫 Inactivo</option>
            </select>
            <small style={{ color: "#64748b", fontSize: "11px", marginTop: "4px", display: "block" }}>
              Los programas inactivos no podrán asociarse a nuevas fichas.
            </small>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn w-100 mt-4 py-3 shadow-sm"
        style={{ 
          background: "linear-gradient(135deg, #0077B6, #023E8A)", 
          color: "#fff", 
          fontWeight: "700", 
          borderRadius: "12px", 
          border: "none",
          fontSize: "15px",
          letterSpacing: "0.5px"
        }}
        disabled={loading}
      >
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...</>
        ) : selectedPrograma ? (
          "Actualizar Programa"
        ) : (
          "Registrar Nuevo Programa"
        )}
      </button>
    </form>
  );
}
