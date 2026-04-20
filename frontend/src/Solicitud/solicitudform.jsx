import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SolicitudPrestamoForm = ({ selectedSolicitud, refreshData, hideModal }) => {
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [fecha_fin, setFecha_fin] = useState("");

  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (selectedSolicitud) {
      setFecha_inicio(
        selectedSolicitud.fecha_inicio
          ? new Date(selectedSolicitud.fecha_inicio).toISOString().slice(0, 16)
          : ""
      );
      setFecha_fin(
        selectedSolicitud.fecha_fin
          ? new Date(selectedSolicitud.fecha_fin).toISOString().slice(0, 16)
          : ""
      );
     
    } else {
      // Valores por defecto al crear nueva solicitud
      const hoy = new Date().toISOString().slice(0, 16);
      setFecha_inicio(hoy);
      setFecha_fin("");
      setEstado(1);
    }
  }, [selectedSolicitud]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica de fechas
    if (fecha_fin && fecha_inicio && new Date(fecha_fin) <= new Date(fecha_inicio)) {
      Swal.fire("⚠️ Atención", "La fecha de fin debe ser posterior a la fecha de inicio", "warning");
      return;
    }

    const data = {
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio).toISOString() : null,
      fecha_fin: fecha_fin ? new Date(fecha_fin).toISOString() : null,
      estado,
    };

    try {
      if (selectedSolicitud) {
        // Actualizar
        await apiAxios.put(
          `/api/solicitud/${selectedSolicitud.id_solicitud}`,
          data
        );
        Swal.fire("🔥 Actualizado", "Solicitud modificada correctamente", "success");
      } else {
        // Crear
        await apiAxios.post("/api/solicitud", data);
        Swal.fire("✅ Registrada", "Solicitud creada correctamente", "success");
      }

      refreshData();
      hideModal();
    } catch (error) {
      console.error("Error al guardar solicitud:", error);
      Swal.fire("💀 Error", "No se pudo guardar la solicitud", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* FECHA INICIO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha y hora de inicio</label>
          <input
            type="datetime-local"
            className="form-control form-control-sm"
            value={fecha_inicio}
            onChange={(e) => setFecha_inicio(e.target.value)}
            required
          />
        </div>

        {/* FECHA FIN */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha y hora de fin</label>
          <input
            type="datetime-local"
            className="form-control form-control-sm"
            value={fecha_fin}
            onChange={(e) => setFecha_fin(e.target.value)}
          />
        </div>

    

        {/* BOTÓN */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100">
            {selectedSolicitud ? "Actualizar Solicitud" : "Registrar Solicitud"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default SolicitudPrestamoForm;