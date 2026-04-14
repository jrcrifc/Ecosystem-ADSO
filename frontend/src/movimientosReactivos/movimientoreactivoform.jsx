import apiAxios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const MovimientoReactivoForm = ({ selectedMovimiento, refreshData, hideModal }) => {
  const [form, setForm] = useState({
    fecha_ingreso: "",
    cantidad_inicial: "",
    lote: "",
    id_reactivo: "",
    id_proveedor: "",
    estado_inventario: "en stock",
  });

  const [reactivos, setReactivos] = useState([]);
  const [proveedor, setProveedores] = useState([]);
  const [loadingReactivos, setLoadingReactivos] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(false);

  useEffect(() => {
    cargarReactivos();
    cargarProveedores();
  }, []);

  const cargarReactivos = async () => {
    setLoadingReactivos(true);
    try {
      const res = await apiAxios.get("/api/reactivos");
      setReactivos(res.data);
    } catch (error) {
      console.error("Error al cargar reactivos:", error);
      Swal.fire("Error", "No se pudieron cargar los reactivos", "error");
    } finally {
      setLoadingReactivos(false);
    }
  };

  const cargarProveedores = async () => {
    setLoadingProveedores(true);
    try {
      const res = await apiAxios.get("/api/proveedor");
      setProveedores(res.data);
    } catch (error) {
      console.error("Error al cargar proveedor:", error);
      Swal.fire("Error", "No se pudieron cargar los proveedores", "error");
    } finally {
      setLoadingProveedores(false);
    }
  };

  useEffect(() => {
    if (selectedMovimiento) {
      setForm({
        fecha_ingreso: selectedMovimiento.fecha_ingreso?.slice(0, 10) || "",
        cantidad_inicial: selectedMovimiento.cantidad_inicial || "",
        lote: selectedMovimiento.lote || "",
        id_reactivo: selectedMovimiento.id_reactivo || "",
        id_proveedor: selectedMovimiento.id_proveedor || "",
        estado_inventario: selectedMovimiento.estado_inventario || "en stock",
      });
    } else {
      setForm({
        fecha_ingreso: new Date().toISOString().slice(0, 10),
        cantidad_inicial: "",
        lote: "",
        id_reactivo: "",
        id_proveedor: "",
        estado_inventario: "en stock",
      });
    }
  }, [selectedMovimiento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fecha_ingreso || !form.cantidad_inicial || !form.id_reactivo) {
      Swal.fire("Campos obligatorios", "Fecha, cantidad inicial y reactivo son requeridos", "warning");
      return;
    }

    if (parseFloat(form.cantidad_inicial) <= 0) {
      Swal.fire("⚠️ Atención", "La cantidad inicial debe ser mayor a 0", "warning");
      return;
    }

    const dataToSend = {
      fecha_ingreso: form.fecha_ingreso,
      cantidad_inicial: parseFloat(form.cantidad_inicial),
      lote: form.lote,
      id_reactivo: parseInt(form.id_reactivo),
      id_proveedor: form.id_proveedor ? parseInt(form.id_proveedor) : null,
      estado_inventario: form.estado_inventario,
    };

    try {
      if (selectedMovimiento) {
        await apiAxios.put(
          `/api/movimientos/${selectedMovimiento.id_movimiento_reactivo}`,
          dataToSend
        );
        Swal.fire("✅ Actualizado", "Movimiento modificado y stock ajustado", "success");
      } else {
        await apiAxios.post("/api/movimientos", dataToSend);
        Swal.fire("✅ Registrado", "Ingreso creado y stock actualizado", "success");
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
          <label className="form-label fw-semibold text-muted">Fecha ingreso</label>
          <input
            type="date"
            name="fecha_ingreso"
            className="form-control form-control-sm"
            value={form.fecha_ingreso}
            onChange={handleChange}
            required
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
          <div className="form-text text-muted small">
            Esta cantidad se sumará al inventario del reactivo
          </div>
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
            disabled={loadingReactivos}
          >
            <option value="">Seleccione un reactivo...</option>
            {reactivos.map((r) => (
              <option key={r.id_reactivo} value={r.id_reactivo}>
                {r.nom_reactivo}
              </option>
            ))}
          </select>
          {loadingReactivos && <small className="text-muted">Cargando reactivos...</small>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Proveedor</label>
          <select
            name="id_proveedor"
            className="form-select form-select-sm"
            value={form.id_proveedor}
            onChange={handleChange}
            disabled={loadingProveedores}
          >
            <option value="">Sin proveedor (opcional)</option>
            {proveedor.map((p) => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {`${p.nom_proveedor} ${p.apel_proveedor}`}
              </option>
            ))}
          </select>
          {loadingProveedores && <small className="text-muted">Cargando proveedores...</small>}
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Estado inventario</label>
          <select
            name="estado_inventario"
            className="form-select form-select-sm"
            value={form.estado_inventario}
            onChange={handleChange}
          >
            <option value="en stock">En stock</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>

        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100">
            {selectedMovimiento ? "Actualizar" : "Registrar Ingreso"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default MovimientoReactivoForm;