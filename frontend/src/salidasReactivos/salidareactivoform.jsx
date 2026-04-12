import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SalidaReactivoForm = ({ selectedSalida, refreshData, hideModal }) => {
  const [id_movimiento_reactivo, setId_movimiento_reactivo] = useState("");
  const [cantidad_salida, setCantidad_salida] = useState("");
  const [fecha_salida, setFecha_salida] = useState("");
  const [estado, setEstado] = useState(1);
  const [stockDisponible, setStockDisponible] = useState(null);

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
      setStockDisponible(null);
    }
  }, [selectedSalida]);

  // Cuando cambia el id_movimiento_reactivo, consultar el stock disponible
  const handleMovimientoChange = async (e) => {
    const val = e.target.value;
    setId_movimiento_reactivo(val);
    setStockDisponible(null);

    if (!val) return;

    try {
      const res = await apiAxios.get(`/api/movimientoreactivos/${val}`);
      const movimiento = res.data;
      // Buscar el reactivo para ver cantidad_inventario
      const resReactivo = await apiAxios.get(`/api/reactivos/${movimiento.id_reactivo}`);
      setStockDisponible(resReactivo.data.cantidad_inventario);
    } catch {
      setStockDisponible(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_movimiento_reactivo) {
      Swal.fire("⚠️ Atención", "Debes ingresar el ID del movimiento", "warning");
      return;
    }

    if (!cantidad_salida || parseFloat(cantidad_salida) <= 0) {
      Swal.fire("⚠️ Atención", "La cantidad de salida debe ser mayor a 0", "warning");
      return;
    }

    if (stockDisponible !== null && parseFloat(cantidad_salida) > parseFloat(stockDisponible)) {
      Swal.fire("⚠️ Stock insuficiente", `Solo hay ${stockDisponible} en inventario`, "warning");
      return;
    }

    const data = {
      id_movimiento_reactivo: parseInt(id_movimiento_reactivo),
      cantidad_salida: parseFloat(cantidad_salida),
      fecha_salida: fecha_salida ? new Date(fecha_salida).toISOString() : new Date().toISOString(),
      estado,
    };

    try {
      if (selectedSalida) {
        await apiAxios.put(`/api/salidas/${selectedSalida.id_salida}`, data);
        Swal.fire("✅ Actualizado", "Salida modificada correctamente", "success");
      } else {
        await apiAxios.post("/api/salidas", data);
        Swal.fire("✅ Registrada", "Salida registrada y stock actualizado", "success");
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

        {/* ID MOVIMIENTO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">ID Movimiento Reactivo</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_movimiento_reactivo}
            onChange={handleMovimientoChange}
            required
            min="1"
            placeholder="ID del ingreso"
          />
          {stockDisponible !== null && (
            <div className={`form-text fw-semibold ${parseFloat(stockDisponible) <= 0 ? 'text-danger' : 'text-success'}`}>
              Stock disponible: {stockDisponible}
            </div>
          )}
        </div>

        {/* CANTIDAD SALIDA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad de salida</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={cantidad_salida}
            onChange={(e) => setCantidad_salida(e.target.value)}
            required
            min="0.001"
            step="0.001"
            placeholder="Ej: 2.500"
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

        {/* ESTADO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Estado</label>
          <select
            className="form-select form-select-sm"
            value={estado}
            onChange={(e) => setEstado(parseInt(e.target.value))}
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
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