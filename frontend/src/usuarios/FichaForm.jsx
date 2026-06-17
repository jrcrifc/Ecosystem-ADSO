import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function FichaForm({ selectedFicha, programas, refreshParent, hideModal }) {
  const [form, setForm] = useState({
    numero_ficha: "",
    id_programa: "",
    estado: 1,
    fecha_inicio: "",
    fecha_fin: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedFicha) {
      setForm({
        numero_ficha: selectedFicha.numero_ficha || "",
        id_programa: selectedFicha.id_programa || "",
        estado: selectedFicha.estado !== false ? 1 : 0,
        fecha_inicio: selectedFicha.fecha_inicio || "",
        fecha_fin: selectedFicha.fecha_fin || ""
      });
    } else {
      setForm({
        numero_ficha: "",
        id_programa: "",
        estado: 1,
        fecha_inicio: "",
        fecha_fin: ""
      });
    }
  }, [selectedFicha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const saveData = async () => {
    setLoading(true);
    try {
      if (!form.numero_ficha.toString().trim()) {
        Swal.fire("Error", "El número de ficha es obligatorio", "warning");
        setLoading(false);
        return;
      }

      const payload = {
        numero_ficha: form.numero_ficha.toString().trim(),
        id_programa: form.id_programa || null,
        estado: form.estado == 1,
        fecha_inicio: form.fecha_inicio || null,
        fecha_fin: form.fecha_fin || null
      };

      if (selectedFicha) {
        await apiAxios.put(`/api/fichas/${selectedFicha.id_ficha}`, payload);
        Swal.fire({ icon: "success", title: "¡Actualizada!", timer: 1800, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/fichas", payload);
        Swal.fire({ icon: "success", title: "¡Guardada!", timer: 1800, showConfirmButton: false });
      }
      
      if (hideModal) hideModal();
      if (refreshParent) refreshParent();
      
      // Limpiar
      setForm({
        numero_ficha: "",
        id_programa: "",
        estado: 1,
        fecha_inicio: "",
        fecha_fin: ""
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar la ficha"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-3">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Número de ficha</label>
          <input 
            className="form-control" 
            name="numero_ficha" 
            placeholder="Ej: 2889927"
            value={form.numero_ficha} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Programa de Formación</label>
          <select className="form-select" name="id_programa" value={form.id_programa} onChange={handleChange}>
            <option value="">Sin programa asignado</option>
            {programas.map(p => (
              <option key={p.id_programa} value={p.id_programa}>{p.nombre_programa}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Fecha de Inicio</label>
          <input 
            type="date"
            className="form-control" 
            name="fecha_inicio" 
            value={form.fecha_inicio} 
            onChange={handleChange} 
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Fecha de Fin</label>
          <input 
            type="date"
            className="form-control" 
            name="fecha_fin" 
            value={form.fecha_fin} 
            onChange={handleChange} 
          />
        </div>

        {selectedFicha && (
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
        {loading ? "Guardando..." : selectedFicha ? "Actualizar Ficha" : "Guardar Ficha"}
      </button>
    </form>
  );
}
