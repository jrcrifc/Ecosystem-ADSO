import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const InventarioReactivoForm = ({ selectedInventario, refreshData, hideModal }) => {
  const [fecha_ingreso, setFecha_ingreso] = useState("");
  const [cantidad_inicial, setCantidad_inicial] = useState("");
  const [cantidad_salida, setCantidad_salida] = useState("");
  const [id_lote, setId_lote] = useState("");
  const [id_reactivo, setId_reactivo] = useState("");
  const [id_proveedor, setId_proveedor] = useState("");
  const [estado_inventario, setEstado_inventario] = useState("DISPONIBLE");
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (selectedInventario) {
      setFecha_ingreso(selectedInventario.fecha_ingreso?.slice(0, 10) || "");
      setCantidad_inicial(selectedInventario.cantidad_inicial || "");
      setCantidad_salida(selectedInventario.cantidad_salida || "");
      setId_lote(selectedInventario.id_lote || "");
      setId_reactivo(selectedInventario.id_reactivo || "");
      setId_proveedor(selectedInventario.id_proveedor || "");
      setEstado_inventario(selectedInventario.estado_inventario || "DISPONIBLE");
      setEstado(selectedInventario.estado ?? 1);
    } else {
      const hoy = new Date().toISOString().slice(0, 10);
      setFecha_ingreso(hoy);
      setCantidad_inicial("");
      setCantidad_salida("");
      setId_lote("");
      setId_reactivo("");
      setId_proveedor("");
      setEstado_inventario("DISPONIBLE");
      setEstado(1);
    }
  }, [selectedInventario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fecha_ingreso,
      cantidad_inicial: parseFloat(cantidad_inicial),
      cantidad_salida: parseFloat(cantidad_salida || 0),
      id_lote: parseInt(id_lote),
      id_reactivo: parseInt(id_reactivo),
      id_proveedor: parseInt(id_proveedor),
      estado_inventario,
      estado,
    };

    try {
      if (selectedInventario) {
        await apiAxios.put(
          `api/entradareactivo/${selectedInventario.id_inventario_reactivo}`,
          data
        );
        Swal.fire("🔥 Actualizado", "Inventario modificado correctamente", "success");
      } else {
        await apiAxios.post("api/entradareactivo", data);
        Swal.fire("✅ Registrado", "Inventario creado correctamente", "success");
      }

      refreshData();
      hideModal();
    } catch (error) {
      console.error(error);
      Swal.fire("💀 Error", "No se pudo guardar el inventario", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* FECHA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha ingreso</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={fecha_ingreso}
            onChange={(e) => setFecha_ingreso(e.target.value)}
            required
          />
        </div>

        {/* CANTIDAD INICIAL */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad inicial</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={cantidad_inicial}
            onChange={(e) => setCantidad_inicial(e.target.value)}
            required
          />
        </div>

        {/* CANTIDAD SALIDA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad salida</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={cantidad_salida}
            onChange={(e) => setCantidad_salida(e.target.value)}
          />
        </div>

        {/* ID REACTIVO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">ID Reactivo</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_reactivo}
            onChange={(e) => setId_reactivo(e.target.value)}
            required
          />
        </div>

        {/* LOTE */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">ID Lote</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_lote}
            onChange={(e) => setId_lote(e.target.value)}
            required
          />
        </div>

        {/* PROVEEDOR */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">ID Proveedor</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_proveedor}
            onChange={(e) => setId_proveedor(e.target.value)}
            required
          />
        </div>

        {/* ESTADO INVENTARIO */}
        <div className="col-12">
          <label className="form-label fw-semibold text-muted">Estado inventario</label>
          <select
            className="form-select form-select-sm"
            value={estado_inventario}
            onChange={(e) => setEstado_inventario(e.target.value)}
          >
            <option value="DISPONIBLE">Disponible</option>
            <option value="AGOTADO">Agotado</option>
          </select>
        </div>

        {/* BOTÓN */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100">
            {selectedInventario ? "Actualizar Inventario" : "Registrar Inventario"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default InventarioReactivoForm;
