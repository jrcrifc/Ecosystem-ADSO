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

  return (
    <form className="p-3">
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Nombre del programa</label>
          <input 
            className="form-control" 
            name="nombre_programa" 
            placeholder="Ej: Análisis y Desarrollo de Software"
            value={form.nombre_programa} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        {selectedPrograma && (
          <div className="col-12">
            <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Estado</label>
            <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>
        )}
      </div>

      <button
        type="button"
        className="btn w-100 mt-4"
        style={{ background: "#023E8A", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
        onClick={saveData}
        disabled={loading}
      >
        {loading ? "Guardando..." : selectedPrograma ? "Actualizar Programa" : "Guardar Programa"}
      </button>
    </form>
  );
}
