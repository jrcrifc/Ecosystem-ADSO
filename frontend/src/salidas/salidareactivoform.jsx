import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SalidaReactivoForm = ({ selectedSalida, refreshData, hideModal }) => {
  const [id_inventario_reactivo, setId_inventario_reactivo] = useState("");
  const [cantidad_salida, setCantidad_salida] = useState("");
  const [fecha_salida, setFecha_salida] = useState("");
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (selectedSalida) {
      setId_inventario_reactivo(selectedSalida.id_inventario_reactivo || "");
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
      setId_inventario_reactivo("");
      setCantidad_salida("");
      setEstado(1);
    }
  }, [selectedSalida]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_inventario_reactivo) {
      Swal.fire("⚠️ Atención", "Debes seleccionar un inventario de reactivo", "warning");
      return;
    }

    if (!cantidad_salida || parseFloat(cantidad_salida) <= 0) {
      Swal.fire("⚠️ Atención", "La cantidad de salida debe ser mayor a 0", "warning");
      return;
    }

    const data = {
      id_inventario_reactivo: parseInt(id_inventario_reactivo),
      cantidad_salida: parseFloat(cantidad_salida),
      fecha_salida: fecha_salida ? new Date(fecha_salida).toISOString() : new Date().toISOString(),
      estado,
    };

    try {
      if (selectedSalida) {
        // Actualizar salida (poco común, pero lo dejamos por si acaso)
        await apiAxios.put(
          `/api/salidas_reactivos/${selectedSalida.id_salida}`,
          data
        );
        Swal.fire("🔥 Actualizado", "Salida modificada correctamente", "success");
      } else {
        // Crear nueva salida
        await apiAxios.post("/api/salidas_reactivos", data);
        Swal.fire("✅ Registrada", "Salida de reactivo registrada correctamente", "success");
      }

      refreshData();
      hideModal();
    } catch (error) {
      console.error("Error al guardar salida:", error);
      Swal.fire("💀 Error", error.response?.data?.message || "No se pudo registrar la salida", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* ID INVENTARIO REACTIVO */}
        <div className="col-md-12">
          <label className="form-label fw-semibold text-muted">Inventario de Reactivo</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_inventario_reactivo}
            onChange={(e) => setId_inventario_reactivo(e.target.value)}
            required
            min="1"
            placeholder="ID del ingreso/inventario"
          />
          <div className="form-text text-muted small">
            ID del registro en inventario_reactivo (busca en la tabla de inventario)
          </div>
        </div>

        {/* CANTIDAD SALIDA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad que sale</label>
          <input
            type="number"
            step="0.001"
            className="form-control form-control-sm"
            value={cantidad_salida}
            onChange={(e) => setCantidad_salida(e.target.value)}
            required
            min="0.001"
            placeholder="Ej: 0.500"
          />
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