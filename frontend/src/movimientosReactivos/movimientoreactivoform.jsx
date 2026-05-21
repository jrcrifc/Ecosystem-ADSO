import apiAxios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const MovimientoReactivoForm = ({ selectedMovimiento, refreshData, hideModal }) => {
  const [loading, setLoading] = useState(false);
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
      Swal.fire("⚠️ Campos obligatorios", "El reactivo y la cantidad son requeridos para el ingreso.", "warning");
      return;
    }
    
    const cantidad = parseFloat(form.cantidad_inicial);
    if (isNaN(cantidad) || cantidad <= 0) {
      Swal.fire("⚠️ Cantidad Inválida", "La cantidad de ingreso debe ser un número mayor a 0", "warning");
      return;
    }

    if (form.fecha_vencimiento) {
      const hoy = new Date();
      const offset = hoy.getTimezoneOffset() * 60000;
      const localHoyStr = (new Date(hoy - offset)).toISOString().slice(0, 10);

      if (form.fecha_vencimiento <= localHoyStr) {
        Swal.fire("⚠️ Fecha de Vencimiento", "La fecha de vencimiento no puede ser hoy ni una fecha pasada.", "warning");
        return;
      }
    }

    // Segunda confirmación para evitar errores de dedo en ingresos grandes
    const reactivoNombre = reactivos.find(r => r.id_reactivo === parseInt(form.id_reactivo))?.nom_reactivo;
    const confirm = await Swal.fire({
      title: '¿Confirmar Ingreso?',
      text: `Vas a registrar ${cantidad} unidades de "${reactivoNombre}". ¿Los datos son correctos?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Revisar',
      confirmButtonColor: '#0077B6'
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);

    const dataToSend = {
      fecha_vencimiento: form.fecha_vencimiento || null,
      cantidad_inicial: cantidad,
      lote: form.lote.trim() || null,
      id_reactivo: parseInt(form.id_reactivo),
      id_proveedor: form.id_proveedor ? parseInt(form.id_proveedor) : null,
    };

    try {
      if (selectedMovimiento) {
        await apiAxios.put(`/api/movimientos/${selectedMovimiento.id_movimiento_reactivo}`, dataToSend);
        Swal.fire({ icon: 'success', title: '✅ Actualizado', text: 'Ingreso modificado con éxito', timer: 2000, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/movimientos", dataToSend);
        Swal.fire({ icon: 'success', title: '✅ Registrado', text: 'Nuevo ingreso de reactivo completado', timer: 2000, showConfirmButton: false });
      }
      refreshData();
      hideModal();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Hubo un problema al guardar el registro de inventario";
      Swal.fire("Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedReactivo = reactivos.find(x => x.id_reactivo === parseInt(form.id_reactivo));

  const inputStyle = {
    borderRadius: "10px",
    borderColor: "#dbeafe",
    transition: "all 0.2s ease"
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">
        {/* REACTIVO */}
        <div className="col-12">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Reactivo <span className="text-danger">*</span></label>
          <select
            name="id_reactivo"
            className="form-select py-2"
            value={form.id_reactivo}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Seleccione el reactivo que ingresa...</option>
            {[...reactivos].sort((a, b) => {
              if (a.estado === 1 && b.estado !== 1) return -1;
              if (a.estado !== 1 && b.estado === 1) return 1;
              return a.id_reactivo - b.id_reactivo;
            }).map((r) => (
              <option key={r.id_reactivo} value={r.id_reactivo} disabled={r.estado !== 1}>
                {r.nom_reactivo} — ({r.presentacion_reactivo}){r.estado !== 1 ? " — 🚫 Inactivo" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* CANTIDAD INICIAL */}
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
              placeholder="0.00"
              style={{ ...inputStyle, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            />
            {selectedReactivo && (
              <span className="input-group-text fw-bold" style={{ background: "#f1f5f9", borderColor: "#dbeafe", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", color: "#0077B6", fontSize: "12px" }}>
                {selectedReactivo.presentacion_reactivo}
              </span>
            )}
          </div>
          <small className="text-muted" style={{ fontSize: '10px' }}>
            Indique el contenido total recibido.
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
            placeholder="N° de Lote / Batch"
            style={inputStyle}
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
            style={inputStyle}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Proveedor</label>
          <select
            name="id_proveedor"
            className="form-select"
            value={form.id_proveedor}
            onChange={handleChange}
            style={inputStyle}
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
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 shadow-sm" 
            disabled={loading}
            style={{ borderRadius: "12px", fontWeight: "700", background: "linear-gradient(135deg, #0077B6, #023E8A)", border: "none" }}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span> Procesando...</>
            ) : (
              <><i className="fa-solid fa-plus-circle me-2"></i> {selectedMovimiento ? "Actualizar Registro" : "Completar Ingreso de Reactivo"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MovimientoReactivoForm;