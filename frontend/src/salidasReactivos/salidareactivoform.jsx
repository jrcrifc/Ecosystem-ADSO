import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const SalidaReactivoForm = ({ selectedSalida, refreshData, hideModal }) => {
  const [reactivos, setReactivos] = useState([]);
  const [id_reactivo, setIdReactivo] = useState("");
  const [lotesFefo, setLotesFefo] = useState([]);
  const [cantidad_salida, setCantidadSalida] = useState("");
  const [fecha_salida, setFechaSalida] = useState("");
  const [hora_salida, setHoraSalida] = useState("07:00");
  const [loadingLotes, setLoadingLotes] = useState(false);

  useEffect(() => {
    cargarReactivos();
    setFechaSalida(new Date().toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (selectedSalida) {
      setCantidadSalida(selectedSalida.cantidad_salida || "");
      setFechaSalida(
        selectedSalida.fecha_salida
          ? new Date(selectedSalida.fecha_salida).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
    } else {
      setIdReactivo("");
      setCantidadSalida("");
      setLotesFefo([]);
    }
  }, [selectedSalida]);

  const cargarReactivos = async () => {
    try {
      const res = await apiAxios.get("/api/reactivos/stock/disponibilidad");
      // Solo mostrar reactivos disponibles
      setReactivos(res.data.filter(r => r.estado_stock === 'disponible'));
    } catch (error) {
      console.error("Error al cargar reactivos:", error);
    }
  };

  const handleReactivoChange = async (e) => {
    const val = e.target.value;
    setIdReactivo(val);
    setLotesFefo([]);
    setCantidadSalida("");
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

  const stockTotal = lotesFefo.reduce((acc, l) => acc + l.cantidad_disponible, 0);
  const loteFefo = lotesFefo[0]; // El primero es el más próximo a vencer

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id_reactivo) {
      Swal.fire("⚠️ Atención", "Selecciona un reactivo", "warning");
      return;
    }
    if (!cantidad_salida || parseFloat(cantidad_salida) <= 0) {
      Swal.fire("⚠️ Atención", "La cantidad debe ser mayor a 0", "warning");
      return;
    }
    if (parseFloat(cantidad_salida) > stockTotal) {
      Swal.fire("⚠️ Stock insuficiente", `Solo hay ${stockTotal.toFixed(3)} disponible en total`, "warning");
      return;
    }
    // ✅ Validar hora entre 7:00 y 16:00
    const [hh, mm] = hora_salida.split(':').map(Number);
    const minutos = hh * 60 + mm;
    if (minutos < 420 || minutos > 960) { // 7*60=420, 16*60=960
      Swal.fire("⚠️ Hora no permitida", "La hora debe estar entre 7:00 AM y 4:00 PM", "warning");
      return;
    }

    const data = {
      id_reactivo: parseInt(id_reactivo),
      cantidad_salida: parseFloat(cantidad_salida),
      fecha_salida: fecha_salida ? new Date(`${fecha_salida}T${hora_salida}:00`).toISOString() : new Date().toISOString(),
    };

    try {
      if (selectedSalida) {
        await apiAxios.put(`/api/salidas/${selectedSalida.id_salida}`, data);
        Swal.fire("✅ Actualizado", "Salida modificada correctamente", "success");
      } else {
        await apiAxios.post("/api/salidas", data);
        Swal.fire("✅ Registrada", "Salida registrada correctamente", "success");
      }
      refreshData();
      hideModal();
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo registrar la salida", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* REACTIVO */}
        <div className="col-md-12">
          <label className="form-label fw-semibold text-muted">Reactivo</label>
          <select
            className="form-select form-select-sm"
            value={id_reactivo}
            onChange={handleReactivoChange}
            required
            disabled={!!selectedSalida}
          >
            <option value="">Seleccione un reactivo...</option>
            {reactivos.map(r => (
              <option key={r.id_reactivo} value={r.id_reactivo}>
                {r.nom_reactivo} — Stock total: {parseFloat(parseFloat(r.cantidad_inventario || 0).toFixed(3)).toString()} {r.presentacion_reactivo}
              </option>
            ))}
          </select>
        </div>

        {/* LOTES FEFO */}
        {loadingLotes && (
          <div className="col-12 text-center text-muted">
            <div className="spinner-border spinner-border-sm me-2" />
            Cargando lotes...
          </div>
        )}

        {lotesFefo.length > 0 && (
          <div className="col-12">
            <label className="form-label fw-semibold text-muted">
              Lotes disponibles <span className="text-success">(ordenados por vencimiento)</span>
            </label>
            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "12px" }}>
              <table className="table table-sm table-striped mb-0">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Lote</th>
                    <th>Disponible</th>
                    <th>Vencimiento</th>
                    <th>Días</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {lotesFefo.map((l, i) => (
                    <tr key={l.id_movimiento_reactivo} style={{ background: i === 0 ? "#e8f5e9" : "" }}>
                      <td>
                        {i === 0 && <span className="badge bg-warning text-dark">⭐ FEFO</span>}
                        {i > 0 && <span className="text-muted">{i + 1}</span>}
                      </td>
                      <td><strong>{l.lote}</strong></td>
                      <td>{parseFloat(parseFloat(l.cantidad_disponible || 0).toFixed(3)).toString()}</td>
                      <td>{l.fecha_vencimiento ? new Date(l.fecha_vencimiento).toLocaleDateString('es-CO') : 'Sin fecha'}</td>
                      <td>
                        {l.dias_para_vencer !== null ? (
                          <span className={`badge ${l.dias_para_vencer <= 7 ? 'bg-danger' : l.dias_para_vencer <= 30 ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {l.dias_para_vencer} días
                          </span>
                        ) : '-'}
                      </td>
                      <td>
                        {l.dias_para_vencer !== null && l.dias_para_vencer <= 7
                          ? <span className="badge bg-danger">⚠️ Urgente</span>
                          : <span className="badge bg-success">OK</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-info">
                    <td colSpan="2"><strong>Stock total disponible</strong></td>
                    <td colSpan="4"><strong>{parseFloat(stockTotal.toFixed(3)).toString()}</strong></td>
                  </tr>
                </tfoot>
              </table>

            </div>
          </div>
        )}

        {/* CANTIDAD */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad de salida</label>
          <div className="input-group input-group-sm">
            <input
              type="number"
              className="form-control form-control-sm"
              value={cantidad_salida}
              onChange={(e) => setCantidadSalida(e.target.value)}
              required min="0.001" step="0.001"
              placeholder="Ej: 2.500"
              max={stockTotal || undefined}
            />
            {id_reactivo && (() => {
              const r = reactivos.find(x => x.id_reactivo === parseInt(id_reactivo));
              return r ? (
                <span className="input-group-text" style={{ background: "#e0f2fe", color: "#0077B6", fontWeight: "600", fontSize: "12px" }}>
                  {r.presentacion_reactivo}
                </span>
              ) : null;
            })()}
          </div>
          {stockTotal > 0 && (
            <div className={`form-text fw-semibold ${parseFloat(cantidad_salida) > stockTotal ? 'text-danger' : 'text-success'}`}>
              Stock total disponible: {parseFloat(stockTotal.toFixed(3)).toString()}
            </div>
          )}
        </div>

        {/* FECHA Y HORA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold" style={{ color: "#023E8A", fontSize: "13px" }}>📅 Fecha de salida</label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={fecha_salida}
            onChange={(e) => setFechaSalida(e.target.value)}
            min={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold" style={{ color: "#023E8A", fontSize: "13px" }}>⏰ Hora</label>
          <input type="time" className="form-control form-control-sm"
            value={hora_salida} onChange={(e) => setHoraSalida(e.target.value)}
            min="07:00" max="16:00" required />
          <small style={{ color: "#0077B6", fontSize: "11px", fontWeight: "600" }}>
            Horario permitido: 7:00 AM - 4:00 PM
          </small>
        </div>

        {/* BOTÓN */}
        <div className="col-12 mt-3">
          <button type="submit" className="btn w-100" style={{ background: "#0077B6", color: "#fff", fontWeight: "600", border: "none", borderRadius: "10px" }}>
            {selectedSalida ? "Actualizar Salida" : "Registrar Salida"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default SalidaReactivoForm;