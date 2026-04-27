import apiAxios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const MovimientoReactivoForm = ({ selectedMovimiento, refreshData, hideModal }) => {
  const [form, setForm] = useState({
    fecha_vencimiento: "",
    cantidad_inicial: "",
    lote: "",
    id_reactivo: "",
    id_proveedor: "",
  });

  const [reactivos, setReactivos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    cargarReactivos();
    cargarProveedores();
  }, []);

  const cargarReactivos = async () => {
    try {
      const res = await apiAxios.get("/api/reactivos");
      setReactivos(res.data);
    } catch (error) {
      console.error("Error al cargar reactivos:", error);
    }
  };

  const cargarProveedores = async () => {
    try {
      const res = await apiAxios.get("/api/proveedor");
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error);
    }
  };

  useEffect(() => {
    if (selectedMovimiento) {
      setForm({
        fecha_vencimiento: selectedMovimiento.fecha_vencimiento?.slice(0, 10) || "",
        cantidad_inicial: selectedMovimiento.cantidad_inicial || "",
        lote: selectedMovimiento.lote || "",
        id_reactivo: selectedMovimiento.id_reactivo || "",
        id_proveedor: selectedMovimiento.id_proveedor || "",
      });
    } else {
      setForm({
        fecha_vencimiento: "",
        cantidad_inicial: "",
        lote: "",
        id_reactivo: "",
        id_proveedor: "",
      });
    }
  }, [selectedMovimiento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.cantidad_inicial || !form.id_reactivo) {
      Swal.fire("Campos obligatorios", "Cantidad inicial y reactivo son requeridos", "warning");
      return;
    }
    if (parseFloat(form.cantidad_inicial) <= 0) {
      Swal.fire("⚠️ Atención", "La cantidad inicial debe ser mayor a 0", "warning");
      return;
    }

    const dataToSend = {
      fecha_vencimiento: form.fecha_vencimiento || null,
      cantidad_inicial: parseFloat(form.cantidad_inicial),
      lote: form.lote || null,
      id_reactivo: parseInt(form.id_reactivo),
      id_proveedor: form.id_proveedor ? parseInt(form.id_proveedor) : null,
    };

    try {
      if (selectedMovimiento) {
        await apiAxios.put(`/api/movimientos/${selectedMovimiento.id_movimiento_reactivo}`, dataToSend);
        Swal.fire("✅ Actualizado", "Movimiento modificado correctamente", "success");
      } else {
        await apiAxios.post("/api/movimientos", dataToSend);
        Swal.fire("✅ Registrado", "Movimiento creado correctamente", "success");
      }
      refreshData();
      hideModal();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "No se pudo guardar el registro";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha de Vencimiento</label>
          <input
            type="date"
            name="fecha_vencimiento"
            className="form-control form-control-sm"
            value={form.fecha_vencimiento}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad inicial</label>
          <input
            type="number"
            name="cantidad_inicial"
            step="0.001"
            min="0.001"
            className="form-control form-control-sm"
            value={form.cantidad_inicial}
            onChange={handleChange}
            required
            placeholder="Ej: 5.000"
          />
          <div className="form-text text-muted small">Esta cantidad se sumará al inventario del reactivo</div>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Lote</label>
          <input
            type="text"
            name="lote"
            className="form-control form-control-sm"
            value={form.lote}
            onChange={handleChange}
            placeholder="Número de lote"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Reactivo</label>
          <select
            name="id_reactivo"
            className="form-select form-select-sm"
            value={form.id_reactivo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un reactivo...</option>
            {reactivos.map((r) => (
              <option key={r.id_reactivo} value={r.id_reactivo}>
                {r.nom_reactivo} ({r.presentacion_reactivo})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Proveedor</label>
          <select
            name="id_proveedor"
            className="form-select form-select-sm"
            value={form.id_proveedor}
            onChange={handleChange}
          >
            <option value="">Sin proveedor (opcional)</option>
            {proveedores.map((p) => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {p.nom_proveedor} {p.apel_proveedor}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 mt-4">
          <button type="submit" className="btn w-100" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", border: "none", borderRadius: "10px" }}>
            {selectedMovimiento ? "Actualizar Movimiento" : "Registrar Movimiento"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MovimientoReactivoForm;