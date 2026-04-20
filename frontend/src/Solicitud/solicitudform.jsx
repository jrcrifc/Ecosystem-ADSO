import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SolicitudPrestamoForm = ({ selectedSolicitud, refreshData, hideModal }) => {
  const [fecha_inicio, setFecha_inicio] = useState("");
  const [fecha_fin, setFecha_fin] = useState("");
  const [estado, setEstado] = useState(1);
  const [equipos, setEquipos] = useState([]);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);

  useEffect(() => { cargarEquipos(); }, []);

  const cargarEquipos = async () => {
    setLoadingEquipos(true);
    try {
      const res = await apiAxios.get("/api/equipos");
      setEquipos(res.data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los equipos", "error");
    } finally {
      setLoadingEquipos(false);
    }
  };

  useEffect(() => {
    if (selectedSolicitud) {
      setFecha_inicio(selectedSolicitud.fecha_inicio ? new Date(selectedSolicitud.fecha_inicio).toISOString().slice(0, 16) : "");
      setFecha_fin(selectedSolicitud.fecha_fin ? new Date(selectedSolicitud.fecha_fin).toISOString().slice(0, 16) : "");
      setEstado(selectedSolicitud.estado ?? 1);
      if (selectedSolicitud.equiposSolicitud) {
        setEquiposSeleccionados(selectedSolicitud.equiposSolicitud.map(e => e.id_equipo));
      }
    } else {
      setFecha_inicio(new Date().toISOString().slice(0, 16));
      setFecha_fin("");
      setEstado(1);
      setEquiposSeleccionados([]);
    }
  }, [selectedSolicitud]);

  const toggleEquipo = (id_equipo) => {
    setEquiposSeleccionados(prev =>
      prev.includes(id_equipo)
        ? prev.filter(id => id !== id_equipo)
        : [...prev, id_equipo]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fecha_fin && fecha_inicio && new Date(fecha_fin) <= new Date(fecha_inicio)) {
      Swal.fire("⚠️ Atención", "La fecha de fin debe ser posterior a la fecha de inicio", "warning");
      return;
    }

    if (equiposSeleccionados.length === 0) {
      Swal.fire("⚠️ Atención", "Debes seleccionar al menos un equipo", "warning");
      return;
    }

    const data = {
      fecha_inicio: fecha_inicio ? new Date(fecha_inicio).toISOString() : null,
      fecha_fin: fecha_fin ? new Date(fecha_fin).toISOString() : null,
      estado,
      equipos: equiposSeleccionados,
    };

    try {
      if (selectedSolicitud) {
        await apiAxios.put(`/api/solicitud/${selectedSolicitud.id_solicitud}`, data);
        Swal.fire("🔥 Actualizado", "Solicitud modificada correctamente", "success");
      } else {
        await apiAxios.post("/api/solicitud", data);
        Swal.fire("✅ Registrada", "Solicitud creada correctamente", "success");
      }
      refreshData();
      hideModal();
    } catch (error) {
      Swal.fire("💀 Error", "No se pudo guardar la solicitud", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha y hora de inicio</label>
          <input type="datetime-local" className="form-control form-control-sm"
            value={fecha_inicio} onChange={(e) => setFecha_inicio(e.target.value)} required />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha y hora de fin</label>
          <input type="datetime-local" className="form-control form-control-sm"
            value={fecha_fin} onChange={(e) => setFecha_fin(e.target.value)} />
        </div>

        {/* ✅ PUNTO 4 — Selección de equipos */}
        <div className="col-12">
          <label className="form-label fw-semibold text-muted">
            Equipos a solicitar <span className="text-danger">*</span>
          </label>
          {loadingEquipos ? (
            <p className="text-muted small">Cargando equipos...</p>
          ) : (
            <div className="border rounded p-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
              {equipos.length === 0 ? (
                <p className="text-muted small mb-0">No hay equipos disponibles</p>
              ) : (
                equipos.map((equipo) => (
                  <div key={equipo.id_equipo} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`equipo-${equipo.id_equipo}`}
                      checked={equiposSeleccionados.includes(equipo.id_equipo)}
                      onChange={() => toggleEquipo(equipo.id_equipo)}
                    />
                    <label className="form-check-label" htmlFor={`equipo-${equipo.id_equipo}`}>
                      {equipo.nom_equipo} — {equipo.marca_equipo} | Placa: {equipo.no_placa}
                    </label>
                  </div>
                ))
              )}
            </div>
          )}
          {equiposSeleccionados.length > 0 && (
            <small className="text-success fw-semibold">
              {equiposSeleccionados.length} equipo(s) seleccionado(s)
            </small>
          )}
        </div>

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