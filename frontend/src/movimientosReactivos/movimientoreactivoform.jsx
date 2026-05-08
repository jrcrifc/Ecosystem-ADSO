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
        cantidad_inicial: selectedMovimiento.cantidad_inicial ? parseFloat(selectedMovimiento.cantidad_inicial).toString() : "",
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

    if (form.fecha_vencimiento) {
      const hoy = new Date();
      // Ajustamos a la zona horaria local restando el offset para obtener el 'YYYY-MM-DD' correcto local
      const offset = hoy.getTimezoneOffset() * 60000;
      const localHoyStr = (new Date(hoy - offset)).toISOString().slice(0, 10);

      if (form.fecha_vencimiento <= localHoyStr) {
        Swal.fire("⚠️ Fecha Inválida", "La fecha de vencimiento no puede ser hoy ni una fecha pasada.", "warning");
        return;
      }
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

  const selectedReactivo = reactivos.find(x => x.id_reactivo === parseInt(form.id_reactivo));

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">
        {/* REACTIVO (MOVIDO ARRIBA) */}
        <div className="col-12">
          <label className="form-label fw-semibold" style={{ color: "#023E8A" }}>Reactivo <span className="text-danger">*</span></label>
          <select
            name="id_reactivo"
            className="form-select"
            value={form.id_reactivo}
            onChange={handleChange}
            required
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          >
            <option value="">Seleccione el reactivo que ingresa...</option>
            {reactivos.map((r) => (
              <option key={r.id_reactivo} value={r.id_reactivo}>
                {r.nom_reactivo} — ({r.presentacion_reactivo})
              </option>
            ))}
          </select>
        </div>

        {/* CANTIDAD INICIAL (ADAPTADA) */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad de Ingreso</label>
          <div className="input-group">
            <input
              type="number"
              name="cantidad_inicial"
              step="0.001"
              min="0.001"
              className="form-control"
              value={form.cantidad_inicial}
              onChange={handleChange}
              required
              placeholder={selectedReactivo?.presentacion_reactivo?.toLowerCase().includes('lit') ? "Ej: 1.5 (Litros)" : "Ej: 500 (Gramos)"}
              style={{ borderColor: "#dbeafe", borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }}
            />
            {selectedReactivo && (
              <span className="input-group-text fw-bold" style={{ background: "#e0f2fe", color: "#0077B6", borderColor: "#dbeafe", borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                {selectedReactivo.presentacion_reactivo}
              </span>
            )}
          </div>
          <small className="text-muted" style={{ fontSize: '11px' }}>
            Indique la cantidad exacta en {selectedReactivo?.presentacion_reactivo || 'unidades'}.
          </small>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Lote</label>
          <input
            type="text"
            name="lote"
            className="form-control"
            value={form.lote}
            onChange={handleChange}
            placeholder="N° de Lote"
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha de Vencimiento</label>
          <input
            type="date"
            name="fecha_vencimiento"
            className="form-control"
            value={form.fecha_vencimiento}
            onChange={handleChange}
            min={(() => {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              return d.toISOString().slice(0, 10);
            })()}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Proveedor</label>
          <select
            name="id_proveedor"
            className="form-select"
            value={form.id_proveedor}
            onChange={handleChange}
            style={{ borderColor: "#dbeafe", borderRadius: "10px" }}
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
          <button type="submit" className="btn w-100 py-2" style={{ background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", fontWeight: "700", border: "none", borderRadius: "10px" }}>
            <i className="fa-solid fa-plus-circle me-2"></i>
            {selectedMovimiento ? "Actualizar Registro" : "Registrar Ingreso de Reactivo"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MovimientoReactivoForm;