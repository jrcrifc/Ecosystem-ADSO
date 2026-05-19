import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import socket from "../socket.js";

const SalidaReactivoForm = ({ selectedSalida, refreshData, hideModal }) => {
  const [loading, setLoading] = useState(false);
  const [reactivos, setReactivos] = useState([]);
  const [id_reactivo, setIdReactivo] = useState("");
  const [lotesFefo, setLotesFefo] = useState([]);
  const [cantidad_salida, setCantidadSalida] = useState("");
  const [fecha_salida, setFechaSalida] = useState("");
  const [hora_salida, setHoraSalida] = useState("07:00");
  const [loadingLotes, setLoadingLotes] = useState(false);
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    const fetchReactivos = async () => {
      try {
        const res = await apiAxios.get("/api/reactivos/stock/disponibilidad");
        const activeReactivoId = selectedSalida?.movimiento?.id_reactivo;
        const list = res.data.filter(r => r.estado_stock === 'disponible' || r.id_reactivo === activeReactivoId);
        setReactivos(list);
      } catch (error) {
        console.error("Error al cargar reactivos:", error);
      }
    };
    
    fetchReactivos();
    setFechaSalida(new Date().toISOString().slice(0, 10));
  }, [selectedSalida]);

  useEffect(() => {
    if (selectedSalida) {
      const activeReactivoId = selectedSalida.movimiento?.id_reactivo;
      if (activeReactivoId) {
        handleReactivoChange({ target: { value: activeReactivoId } }, true);
      }
      
      setCantidadSalida(selectedSalida.cantidad_salida || "");
      setFechaSalida(
        selectedSalida.fecha_salida
          ? new Date(selectedSalida.fecha_salida).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setObservaciones(selectedSalida.observaciones || "");
    } else {
      setIdReactivo("");
      setCantidadSalida("");
      setLotesFefo([]);
      setObservaciones("");
    }
  }, [selectedSalida]);

  const handleReactivoChange = async (e, keepQuantity = false) => {
    const val = e.target.value;
    setIdReactivo(val);
    setLotesFefo([]);
    if (!keepQuantity) {
      setCantidadSalida("");
    }
    if (!val) return;

    setLoadingLotes(true);
    try {
      const res = await apiAxios.get(`/api/salidas/lotes-fefo/${val}`);
      setLotesFefo(res.data);
    } catch {
      Swal.fire("Error", "No se pudieron cargar los lotes", "error");
    } finally {
      setLoadingLotes(false);
    }
  };

  const loteFefo = lotesFefo[0];
  const stockTotalDisponible = lotesFefo.reduce((acc, l) => acc + l.cantidad_disponible, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_reactivo) {
      Swal.fire("⚠️ Atención", "Selecciona un reactivo", "warning");
      return;
    }
    const cantidad = parseFloat(cantidad_salida);
    if (!cantidad || cantidad <= 0) {
      Swal.fire("⚠️ Atención", "La cantidad debe ser un número mayor a 0", "warning");
      return;
    }
    if (lotesFefo.length === 0) {
      Swal.fire("⚠️ Sin stock", "No hay lotes disponibles para este reactivo", "warning");
      return;
    }
    
    if (cantidad > stockTotalDisponible) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Stock Insuficiente",
        text: `Solo tienes ${parseFloat(stockTotalDisponible.toFixed(3))} unidades disponibles en total entre todos los lotes.`
      });
      return;
    }

    const [hh, mm] = hora_salida.split(':').map(Number);
    const minutos = hh * 60 + mm;
    if (minutos < 420 || minutos > 960) {
      Swal.fire("⚠️ Hora no permitida", "La hora debe estar entre 7:00 AM y 4:00 PM", "warning");
      return;
    }

    if (loteFefo && loteFefo.fecha_vencimiento) {
      const vencimiento = new Date(loteFefo.fecha_vencimiento);
      const salida = new Date(`${fecha_salida}T${hora_salida}:00`);
      if (salida > vencimiento) {
        Swal.fire({
          icon: "error",
          title: "⚠️ Reactivo Vencido",
          text: `El lote más próximo (${loteFefo.lote}) ya habrá vencido para esa fecha.`
        });
        return;
      }
    }

    // Confirmación si se van a usar varios lotes
    if (cantidad > loteFefo.cantidad_disponible) {
      const confirm = await Swal.fire({
        title: '¿Múltiples Lotes?',
        text: `La cantidad (${cantidad}) supera lo disponible en el primer lote (${parseFloat(loteFefo.cantidad_disponible.toFixed(3))}). El sistema tomará el restante de los siguientes lotes automáticamente. ¿Deseas continuar?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, distribuir',
        cancelButtonText: 'Cancelar'
      });
      if (!confirm.isConfirmed) return;
    }

    setLoading(true);

    const data = {
      id_reactivo: parseInt(id_reactivo),
      cantidad_salida: cantidad,
      fecha_salida: fecha_salida ? new Date(`${fecha_salida}T${hora_salida}:00`).toISOString() : new Date().toISOString(),
      observaciones: observaciones.trim() || "",
    };

    try {
      if (selectedSalida) {
        await apiAxios.put(`/api/salidas/${selectedSalida.id_salida}`, data);
        Swal.fire({ icon: 'success', title: '✅ Actualizado', text: 'Salida modificada correctamente', timer: 2000, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/salidas", data);
        Swal.fire({ icon: 'success', title: '✅ Registrada', text: 'Salida registrada y distribuida por lotes', timer: 2000, showConfirmButton: false });
      }
      
      socket.emit("salida_actualizada");
      socket.emit("movimiento_actualizado");

      refreshData();
      hideModal();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo registrar la salida", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderRadius: "10px",
    borderColor: "#e2e8f0",
    padding: "10px",
    transition: "all 0.2s ease"
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* REACTIVO */}
        <div className="col-md-12">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Reactivo <span className="text-danger">*</span></label>
          <select
            className="form-select"
            style={inputStyle}
            value={id_reactivo}
            onChange={handleReactivoChange}
            required
            disabled={!!selectedSalida?.id_salida}
          >
            <option value="">Seleccione un reactivo...</option>
            {reactivos.map(r => (
              <option key={r.id_reactivo} value={r.id_reactivo}>
                {r.nom_reactivo} — Total: {parseFloat(parseFloat(r.cantidad_inventario || 0).toFixed(3)).toString()} {r.presentacion_reactivo}
              </option>
            ))}
          </select>
        </div>

        {/* LOTE FEFO */}
        {loadingLotes && (
          <div className="col-12 text-center text-muted my-2">
            <div className="spinner-border spinner-border-sm me-2 text-primary" />
            Buscando lotes disponibles...
          </div>
        )}

        {loteFefo && !loadingLotes && (
          <div className="col-12">
            <div style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
              borderRadius: "15px",
              padding: "18px",
              border: "1px solid #bbf7d0",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.05)"
            }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge" style={{ background: "#22c55e", color: "#fff", padding: "6px 12px", borderRadius: "8px" }}>📦 ROTACIÓN DE LOTES ACTIVADA</span>
                <strong style={{ fontSize: "14px", color: "#065f46" }}>Lotes: {lotesFefo.length}</strong>
              </div>
              
              <div className="row g-3 text-center">
                <div className="col-4">
                  <small className="text-muted d-block" style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "700" }}>Primer Lote (#{loteFefo.lote})</small>
                  <strong style={{ fontSize: "16px", color: "#059669" }}>
                    {parseFloat(parseFloat(loteFefo.cantidad_disponible || 0).toFixed(3)).toString()}
                  </strong>
                </div>
                <div className="col-4" style={{ borderLeft: "1px solid #dcfce7", borderRight: "1px solid #dcfce7" }}>
                  <small className="text-muted d-block" style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "700" }}>Total Sistema</small>
                  <strong style={{ fontSize: "18px", color: "#0077B6" }}>
                    {parseFloat(parseFloat(stockTotalDisponible || 0).toFixed(3)).toString()}
                  </strong>
                </div>
                <div className="col-4">
                  <small className="text-muted d-block" style={{ fontSize: "10px", textTransform: "uppercase", fontWeight: "700" }}>Próx. Venc.</small>
                  <strong style={{ fontSize: "13px", color: "#0A1628" }}>
                    {loteFefo.fecha_vencimiento ? new Date(loteFefo.fecha_vencimiento).toLocaleDateString('es-CO') : 'Sin fecha'}
                  </strong>
                </div>
              </div>

              {lotesFefo.length > 1 && (
                <div className="mt-3 pt-2 text-center" style={{ borderTop: "1px dashed #86efac", fontSize: "11px", color: "#047857", fontWeight: "600" }}>
                  💡 Si tu salida supera las {parseFloat(loteFefo.cantidad_disponible.toFixed(3))} unidades, el sistema usará los demás lotes automáticamente.
                </div>
              )}
            </div>
          </div>
        )}

        {/* CANTIDAD */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad de salida</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              style={{ ...inputStyle, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              value={cantidad_salida}
              onChange={(e) => setCantidadSalida(e.target.value)}
              required min="0.001" step="0.001"
              placeholder="0.000"
              disabled={!!selectedSalida?.id_salida}
            />
            {id_reactivo && (
              <span className="input-group-text fw-bold" style={{ background: "#f1f5f9", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", fontSize: "12px", color: "#0077B6" }}>
                {reactivos.find(x => x.id_reactivo === parseInt(id_reactivo))?.presentacion_reactivo}
              </span>
            )}
          </div>
          {loteFefo && (
            <div className={`form-text fw-bold mt-1 ${parseFloat(cantidad_salida) > stockTotalDisponible ? 'text-danger' : 'text-success'}`} style={{ fontSize: "11px" }}>
              {parseFloat(cantidad_salida) > stockTotalDisponible 
                ? `❌ Insuficiente (Máx Total: ${parseFloat(stockTotalDisponible.toFixed(3))})`
                : parseFloat(cantidad_salida) > loteFefo.cantidad_disponible 
                  ? `🔀 Se distribuirá entre ${lotesFefo.length} lotes`
                  : `✅ Se tomará del lote #${loteFefo.lote}`
              }
            </div>
          )}
        </div>

        {/* FECHA Y HORA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">📅 Fecha de salida</label>
          <input
            type="date"
            className="form-control"
            style={inputStyle}
            value={fecha_salida}
            onChange={(e) => setFechaSalida(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">⏰ Hora</label>
          <input type="time" className="form-control" style={inputStyle}
            value={hora_salida} onChange={(e) => setHoraSalida(e.target.value)}
            min="07:00" max="16:00" required />
        </div>

        {/* OBSERVACIONES */}
        <div className="col-md-12">
          <label className="form-label fw-semibold text-muted">📝 Observaciones</label>
          <textarea
            className="form-control"
            style={inputStyle}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={2}
            placeholder="¿Para qué se usará? (opcional)"
            maxLength={500}
          />
          <div className="text-end mt-1">
            <small className="text-muted" style={{ fontSize: "10px", fontWeight: "600" }}>
              {observaciones.length} / 500
            </small>
          </div>
        </div>

        {/* BOTÓN */}
        <div className="col-12 mt-3">
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 shadow-sm" 
            disabled={loading || (loteFefo && parseFloat(cantidad_salida) > stockTotalDisponible)}
            style={{ 
              borderRadius: "12px", 
              fontWeight: "700", 
              background: selectedSalida?.id_salida
                ? "linear-gradient(135deg, #0077B6, #023E8A)" 
                : "linear-gradient(135deg, #DC3545, #A4161A)", 
              border: "none" 
            }}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Procesando...</>
            ) : (
              selectedSalida?.id_salida ? "Actualizar Salida" : "Registrar Salida de Inventario"
            )}
          </button>
        </div>

      </div>
    </form>
  );
};

export default SalidaReactivoForm;