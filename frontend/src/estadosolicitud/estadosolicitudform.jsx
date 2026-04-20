import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EstadoSolicitudForm = ({ selectedEstado, refreshData, hideModal }) => {
  const [estado, setEstado] = useState("");
  const [activo, setActivo] = useState(1);

  const opciones = ["generado", "aceptado", "prestado", "cancelado", "entregado"];

  useEffect(() => {
    if (selectedEstado) {
      setEstado(selectedEstado.estado || "");
      setActivo(selectedEstado.activo ?? 1);
    } else {
      setEstado("");
      setActivo(1);
    }
  }, [selectedEstado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { estado, activo };

    try {
      if (selectedEstado) {
        await apiAxios.put(
          `api/estadosolicitud/${selectedEstado.id_estado_solicitud}`,
          data
        );
        Swal.fire("Éxito", "Actualizado correctamente", "success");
      } else {
        await apiAxios.post("api/estadosolicitud", data);
        Swal.fire("Éxito", "Creado correctamente", "success");
      }

      refreshData();
      hideModal();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Estado</label>
        <select
          className="form-select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
        >
          <option value="">Seleccionar...</option>
          {opciones.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {selectedEstado && (
        <div className="alert alert-info">
          Estatus actual:{" "}
          <strong>{activo === 1 ? "ACTIVO" : "INACTIVO"}</strong>
        </div>
      )}

      <button className="btn btn-primary w-100">
        {selectedEstado ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
};

export default EstadoSolicitudForm;