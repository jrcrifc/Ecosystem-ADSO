import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EstadoEquipoForm = ({ selectedEstado, refreshData, hideModal }) => {
  const [estado, setEstado] = useState("");

  const opciones = ['disponible','no disponible','mantenimiento'];

  useEffect(() => {
    if (selectedEstado) {
      setEstado(selectedEstado.estado || "");
    } else {
      setEstado("");
    }
  }, [selectedEstado]);

  // Ahora devuelve el item creado/actualizado vía `onSaved` para actualización local
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { estado };

    try {
      if (selectedEstado) {
        const res = await apiAxios.put(`/api/estadoequipo/${selectedEstado.id_estado_equipo}`, data);
        Swal.fire("¡Éxito!", "Estado actualizado", "success");
        if (typeof onSaved === 'function') onSaved(res.data, /*isUpdate=*/true);
      } else {
        const res = await apiAxios.post("/api/estadoequipo", data);
        Swal.fire("¡Éxito!", "Estado creado", "success");
        if (typeof onSaved === 'function') onSaved(res.data, /*isUpdate=*/false);
      }
      hideModal();
    } catch (error) {
      console.error('Error guardando estado equipo:', error.response?.data || error);
      Swal.fire("Error", error.response?.data?.message || "No se pudo guardar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label
          className="form-label fw-semibold text-muted"
          style={{ fontSize: "0.9rem" }}
        >
          Estado del equipo
        </label>
        <select
          className="form-select form-select-sm"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
        >
          <option value="">Seleccionar estado...</option>
          {opciones.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1).replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {selectedEstado && (
        <div className="alert alert-info py-2">
          <small>
            Puedes actualizar el estado desde aquí
          </small>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-100">
        {selectedEstado ? "Actualizar" : "Crear"} Estado
      </button>
    </form>
  );
};

export default EstadoEquipoForm;
