import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SolicitudXEquipoForm = ({ selectedSolicitud, refreshData }) => {
  const [id_solicitud, setIdSolicitud] = useState("");
  const [id_equipo, setIdEquipo] = useState("");

  useEffect(() => {
    if (selectedSolicitud) {
      setIdSolicitud(selectedSolicitud.id_solicitud || "");
      setIdEquipo(selectedSolicitud.id_equipo || "");
    } else {
      setIdSolicitud("");
      setIdEquipo("");
    }
  }, [selectedSolicitud]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id_solicitud: parseInt(id_solicitud),
      id_equipo: parseInt(id_equipo),
    };

    try {
      if (selectedSolicitud) {
        // EDITAR
        await apiAxios.put(`/api/solicitudxequipo/${selectedSolicitud.id_solicitudxequipo}`, data); // SIN /api
        Swal.fire("¡Éxito!", "Relación actualizada correctamente", "success");
      } else {
        // CREAR
        await apiAxios.post("/api/solicitudxequipo", data); // SIN /api
        Swal.fire("¡Éxito!", "Relación creada correctamente", "success");
      }

      refreshData();
      document.querySelector("#modalSolicitudEquipo .btn-close").click();
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "No se pudo guardar la relación",
        "error"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-bold">ID Solicitud</label>
        <input
          type="number"
          className="form-control"
          value={id_solicitud}
          onChange={(e) => setIdSolicitud(e.target.value)}
          required
          min="1"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">ID Equipo</label>
        <input
          type="number"
          className="form-control"
          value={id_equipo}
          onChange={(e) => setIdEquipo(e.target.value)}
          required
          min="1"
        />
      </div>

      <div className="d-grid mt-4">
        <button type="submit" className="btn btn-primary btn-lg">
          {selectedSolicitud ? "Actualizar" : "Crear"} Relación
        </button>
      </div>
    </form>
  );
};

export default SolicitudXEquipoForm;