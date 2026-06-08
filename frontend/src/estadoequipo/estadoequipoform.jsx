// Archivo: estadoequipoform.jsx — Formulario de creación/edición de estados de equipo

// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa hooks de React para estado y efectos
import { useState, useEffect } from "react";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";

// Componente del formulario de estado de equipo
const EstadoEquipoForm = ({ selectedEstado, refreshData, hideModal }) => {
  // Estado que almacena el valor del estado seleccionado
  const [estado, setEstado] = useState("");
  // Lista de opciones válidas para el estado del equipo
  const opciones = ['disponible','no disponible','mantenimiento'];
  // Efecto que carga el valor del estado al editar o limpia al crear nuevo
  useEffect(() => {
    if (selectedEstado) {
      setEstado(selectedEstado.estado || "");
    } else {
      setEstado("");
    }
  }, [selectedEstado]);
  // Función que maneja el envío del formulario para crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { estado };
    try {
      if (selectedEstado) {
        // Actualiza el estado existente vía PUT
        const res = await apiAxios.put(`/api/estadoequipo/${selectedEstado.id_estado_equipo}`, data);
        Swal.fire("¡Éxito!", "Estado actualizado", "success");
        if (typeof onSaved === 'function') onSaved(res.data, true);
      } else {
        // Crea un nuevo estado vía POST
        const res = await apiAxios.post("/api/estadoequipo", data);
        Swal.fire("¡Éxito!", "Estado creado", "success");
        if (typeof onSaved === 'function') onSaved(res.data, false);
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
          {/* Itera sobre las opciones para crear cada elemento del select */}
          {opciones.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1).replace("_", " ")}
            </option>
          ))}
        </select>
      </div>
      {/* Mensaje informativo cuando se edita un estado existente */}
      {selectedEstado && (
        <div className="alert alert-info py-2">
          <small>
            Puedes actualizar el estado desde aquí
          </small>
        </div>
      )}
      {/* Botón de envío del formulario */}
      <button type="submit" className="btn btn-primary w-100">
        {selectedEstado ? "Actualizar" : "Crear"} Estado
      </button>
    </form>
  );
};

export default EstadoEquipoForm;
