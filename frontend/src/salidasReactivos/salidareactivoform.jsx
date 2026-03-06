import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SalidaReactivoForm = ({ selectedSalida, refreshData, hideModal }) => {
  const [id_movimiento_reactivo, setId_movimiento_reactivo] = useState("");
  const [cantidad_salida, setCantidad_salida] = useState(""); // ✅ FIX: estaba sin declarar
  const [fecha_salida, setFecha_salida] = useState("");
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (selectedSalida) {
      setId_movimiento_reactivo(selectedSalida.id_movimiento_reactivo || "");
      setCantidad_salida(selectedSalida.cantidad_salida || "");
      setFecha_salida(
        selectedSalida.fecha_salida
          ? new Date(selectedSalida.fecha_salida).toISOString().slice(0, 16)
          : ""
      );
      setEstado(selectedSalida.estado ?? 1);
    } else {
      const hoy = new Date().toISOString().slice(0, 16);
      setFecha_salida(hoy);
      setId_movimiento_reactivo("");
      setCantidad_salida("");
      setEstado(1);
    }
  }, [selectedSalida]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_movimiento_reactivo) {
      Swal.fire("⚠️ Atención", "Debes seleccionar un movimiento del reactivo", "warning");
      return;
    }

    const data = {
      id_movimiento_reactivo: parseInt(id_movimiento_reactivo),
      cantidad_salida: parseFloat(cantidad_salida) || 0,
      fecha_salida: fecha_salida ? new Date(fecha_salida).toISOString() : new Date().toISOString(),
      estado,
    };

    try {
      if (selectedSalida) {
        await apiAxios.put(`/api/salidas/${selectedSalida.id_salida}`, data);
        Swal.fire("Actualizado", "Salida modificada correctamente", "success");
      } else {
        await apiAxios.post("/api/salidas", data);
        Swal.fire("Registrada", "Salida de reactivo registrada correctamente", "success");
      }

      refreshData();
      hideModal();
    } catch (error) {
      console.error("Error al guardar salida:", error);
      Swal.fire("Error", error.response?.data?.message || "No se pudo registrar la salida", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* ID MOVIMIENTO REACTIVO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">ID Movimiento Reactivo</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_movimiento_reactivo}
            onChange={(e) => setId_movimiento_reactivo(e.target.value)}
            required
            min="1"
            placeholder="ID del ingreso/inventario"
          />
          <div className="form-text text-muted small">
            ID del registro en inventario_reactivo
          </div>
        </div>

    

        {/* FECHA SALIDA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha y hora de salida</label>
          <input
            type="datetime-local"
            className="form-control form-control-sm"
            value={fecha_salida}
            onChange={(e) => setFecha_salida(e.target.value)}
            required
          />
        </div>

        {/* BOTÓN */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100">
            {selectedSalida ? "Actualizar Salida" : "Registrar Salida"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default SalidaReactivoForm;