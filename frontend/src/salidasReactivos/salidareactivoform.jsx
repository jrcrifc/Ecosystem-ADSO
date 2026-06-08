// Archivo de formulario de registro de salida de reactivos con logica FEFO

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";
// Importa la instancia centralizada de Socket.IO
import socket from "../socket.js";

// Define el componente de formulario que recibe props para editar o crear salidas
const SalidaReactivoForm = ({ selectedSalida, refreshData, hideModal }) => {
  // Estado que indica si el formulario esta procesando una solicitud
  const [loading, setLoading] = useState(false);
  // Estado que almacena la lista de reactivos disponibles
  const [reactivos, setReactivos] = useState([]);
  // Estado que almacena el ID del reactivo seleccionado
  const [id_reactivo, setIdReactivo] = useState("");
  // Estado que almacena los lotes ordenados por FEFO
  const [lotesFefo, setLotesFefo] = useState([]);
  // Estado que almacena la cantidad de salida ingresada
  const [cantidad_salida, setCantidadSalida] = useState("");
  // Estado que almacena la fecha de salida
  const [fecha_salida, setFechaSalida] = useState("");
  // Estado que almacena la hora de salida
  const [hora_salida, setHoraSalida] = useState("07:00");
  // Estado que indica si los lotes estan cargando
  const [loadingLotes, setLoadingLotes] = useState(false);
  // Estado que almacena las observaciones de la salida
  const [observaciones, setObservaciones] = useState("");

  // Efecto que carga los reactivos disponibles al montar
  useEffect(() => {
    // Funcion interna asincrona para obtener los reactivos
    const fetchReactivos = async () => {
      try {
        // Obtiene los reactivos con disponibilidad de stock
        const res = await apiAxios.get("/api/reactivos/stock/disponibilidad");
        // Carga tambien los reactivos inactivos para mostrarlos deshabilitados
        let reactivosInactivos = [];
        try {
          const resAll = await apiAxios.get("/api/reactivos");
          reactivosInactivos = resAll.data.filter(r => r.estado !== 1).map(r => ({
            id_reactivo: r.id_reactivo,
            nom_reactivo: r.nom_reactivo,
            presentacion_reactivo: r.presentacion_reactivo,
            cantidad_inventario: 0,
            estado_stock: 'inactivo',
            _inactivo: true
          }));
        } catch (e) { /* ignorar */ }

        // Incluye el reactivo de la salida seleccionada aunque este agotado
        const activeReactivoId = selectedSalida?.movimiento?.id_reactivo;
        const list = res.data.filter(r => r.estado_stock === 'disponible' || r.id_reactivo === activeReactivoId);
        // Combina activos con inactivos evitando duplicados
        const idsActivos = new Set(list.map(r => r.id_reactivo));
        const inactivosSinDuplicar = reactivosInactivos.filter(r => !idsActivos.has(r.id_reactivo));
        setReactivos([...list, ...inactivosSinDuplicar]);
      } catch (error) {
        // Muestra error en consola si falla la carga
        console.error("Error al cargar reactivos:", error);
      }
    };
    
    fetchReactivos();
    // Establece la fecha actual como valor por defecto
    setFechaSalida(new Date().toISOString().slice(0, 10));
  }, [selectedSalida]);

  // ===== Cargar datos de la salida al editar =====

  // Efecto que carga los datos de la salida seleccionada al editar
  useEffect(() => {
    // Verifica si hay una salida seleccionada para editar
    if (selectedSalida) {
      // Obtiene el ID del reactivo asociado a la salida
      const activeReactivoId = selectedSalida.movimiento?.id_reactivo;
      if (activeReactivoId) {
        // Carga los lotes FEFO del reactivo de la salida
        handleReactivoChange({ target: { value: activeReactivoId } }, true);
      }
      
      // Asigna los valores de la salida existente al formulario
      setCantidadSalida(selectedSalida.cantidad_salida || "");
      setFechaSalida(
        selectedSalida.fecha_salida
          ? new Date(selectedSalida.fecha_salida).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setObservaciones(selectedSalida.observaciones || "");
    } else {
      // Resetea el formulario si es una creacion nueva
      setIdReactivo("");
      setCantidadSalida("");
      setLotesFefo([]);
      setObservaciones("");
    }
  }, [selectedSalida]);

  // Manejador de cambio de reactivo que carga los lotes FEFO
  const handleReactivoChange = async (e, keepQuantity = false) => {
    const val = e.target.value;
    setIdReactivo(val);
    setLotesFefo([]);
    // Resetea la cantidad solo si no se esta manteniendo (edicion)
    if (!keepQuantity) {
      setCantidadSalida("");
    }
    if (!val) return;

    // Activa el estado de carga de lotes
    setLoadingLotes(true);
    try {
      // Obtiene los lotes ordenados por FEFO para el reactivo seleccionado
      const res = await apiAxios.get(`/api/salidas/lotes-fefo/${val}`);
      setLotesFefo(res.data);
    } catch {
      // Muestra alerta de error al usuario
      Swal.fire("Error", "No se pudieron cargar los lotes", "error");
    } finally {
      // Desactiva el estado de carga de lotes
      setLoadingLotes(false);
    }
  };

  // Procesa los lotes FEFO para incluir el lote de la salida editada
  const lotesFefoProcesados = [...lotesFefo];
  if (selectedSalida && lotesFefoProcesados.length > 0) {
    // Busca el lote de la salida editada en la lista
    const idx = lotesFefoProcesados.findIndex(l => l.id_movimiento_reactivo === selectedSalida.id_movimiento_reactivo);
    if (idx !== -1) {
      // Restaura la cantidad descontada al lote original para mostrar stock real
      lotesFefoProcesados[idx] = {
        ...lotesFefoProcesados[idx],
        cantidad_disponible: lotesFefoProcesados[idx].cantidad_disponible + parseFloat(selectedSalida.cantidad_salida || 0)
      };
    } else {
      // Agrega el lote de la salida si no esta en la lista FEFO
      lotesFefoProcesados.unshift({
        id_movimiento_reactivo: selectedSalida.id_movimiento_reactivo,
        lote: selectedSalida.movimiento?.lote || 'Sin lote',
        fecha_vencimiento: selectedSalida.movimiento?.fecha_vencimiento,
        cantidad_disponible: parseFloat(selectedSalida.cantidad_salida || 0)
      });
    }
  }

  // Obtiene el primer lote FEFO (el mas proximo a vencer)
  const loteFefo = lotesFefoProcesados[0];
  // Calcula el stock total disponible sumando todos los lotes
  const stockTotalDisponible = lotesFefoProcesados.reduce((acc, l) => acc + l.cantidad_disponible, 0);

  // ===== Validar y enviar formulario de salida =====

  // Manejador del envio del formulario para crear o actualizar una salida
  const handleSubmit = async (e) => {
    // Previene la recarga de la pagina al enviar el formulario
    e.preventDefault();

    // Valida que se haya seleccionado un reactivo
    if (!id_reactivo) {
      Swal.fire("⚠️ Atención", "Selecciona un reactivo", "warning");
      return;
    }
    // Convierte la cantidad a numero flotante
    const cantidad = parseFloat(cantidad_salida);
    // Valida que la cantidad sea un numero positivo
    if (!cantidad || cantidad <= 0) {
      Swal.fire("⚠️ Atención", "La cantidad debe ser un número mayor a 0", "warning");
      return;
    }
    // Valida que haya lotes disponibles para el reactivo
    if (lotesFefoProcesados.length === 0) {
      Swal.fire("⚠️ Sin stock", "No hay lotes disponibles para este reactivo", "warning");
      return;
    }
    
    // Valida que la cantidad no supere el stock total disponible
    if (cantidad > stockTotalDisponible) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ Stock Insuficiente",
        text: `Solo tienes ${parseFloat(stockTotalDisponible.toFixed(3))} unidades disponibles en total para esta salida.`
      });
      return;
    }

    // Valida que la hora de salida este entre 7:00 AM y 4:00 PM
    const [hh, mm] = hora_salida.split(':').map(Number);
    const minutos = hh * 60 + mm;
    if (minutos < 420 || minutos > 960) {
      Swal.fire("⚠️ Hora no permitida", "La hora debe estar entre 7:00 AM y 4:00 PM", "warning");
      return;
    }

    // Valida que el lote FEFO no este vencido para la fecha de salida
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

    // Muestra confirmacion si la cantidad requiere multiples lotes
    if (!selectedSalida && cantidad > loteFefo.cantidad_disponible) {
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

    // Activa el estado de carga
    setLoading(true);

    // Prepara los datos del formulario para enviar al backend
    const data = {
      id_reactivo: parseInt(id_reactivo),
      cantidad_salida: cantidad,
      fecha_salida: fecha_salida ? new Date(`${fecha_salida}T${hora_salida}:00`).toISOString() : new Date().toISOString(),
      observaciones: observaciones.trim() || "",
    };

    try {
      // Verifica si se esta editando una salida existente
      if (selectedSalida) {
        // Envia peticion PUT para actualizar la salida
        await apiAxios.put(`/api/salidas/${selectedSalida.id_salida}`, data);
        Swal.fire({ icon: 'success', title: '✅ Actualizado', text: 'Salida modificada correctamente', timer: 2000, showConfirmButton: false });
      } else {
        // Envia peticion POST para crear una nueva salida
        await apiAxios.post("/api/salidas", data);
        Swal.fire({ icon: 'success', title: '✅ Registrada', text: 'Salida registrada y distribuida por lotes', timer: 2000, showConfirmButton: false });
      }
      
      // Emite eventos de socket para notificar el cambio
      socket.emit("salida_actualizada");
      socket.emit("movimiento_actualizado");

      // Refresca la tabla de datos y cierra el modal
      refreshData();
      hideModal();
    } catch (error) {
      // Muestra alerta de error al usuario
      Swal.fire("Error", error.response?.data?.message || "No se pudo registrar la salida", "error");
    } finally {
      // Desactiva el estado de carga al finalizar
      setLoading(false);
    }
  };

  // Estilos base reutilizables para los campos del formulario
  const inputStyle = {
    borderRadius: "10px",
    borderColor: "#e2e8f0",
    padding: "10px",
    transition: "all 0.2s ease"
  };

  // Renderiza el formulario
  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* Campo de seleccion de reactivo */}
        <div className="col-md-12">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Reactivo <span className="text-danger">*</span></label>
          <select
            className="form-select"
            style={inputStyle}
            value={id_reactivo}
            onChange={handleReactivoChange}
            required
            // Deshabilita el campo cuando se edita una salida existente
            disabled={!!selectedSalida?.id_salida}
          >
            <option value="">Seleccione un reactivo...</option>
            {/* Mapea los reactivos ordenando activos primero y mostrando inactivos deshabilitados */}
            {[...reactivos].sort((a, b) => {
              if (!a._inactivo && b._inactivo) return -1;
              if (a._inactivo && !b._inactivo) return 1;
              return a.id_reactivo - b.id_reactivo;
            }).map(r => (
              <option key={r.id_reactivo} value={r.id_reactivo} disabled={r._inactivo === true}>
                {r.nom_reactivo} — Total: {parseFloat(parseFloat(r.cantidad_inventario || 0).toFixed(3)).toString()} {r.presentacion_reactivo}{r._inactivo ? " — 🚫 Inactivo" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Indicador de carga mientras se buscan lotes */}
        {loadingLotes && (
          <div className="col-12 text-center text-muted my-2">
            <div className="spinner-border spinner-border-sm me-2 text-primary" />
            Buscando lotes disponibles...
          </div>
        )}

        {/* Panel informativo del lote FEFO seleccionado */}
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
              
              {/* Informacion resumida del primer lote, total y proximo vencimiento */}
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

              {/* Aviso si hay multiples lotes y se requiere distribucion */}
              {lotesFefoProcesados.length > 1 && (
                <div className="mt-3 pt-2 text-center" style={{ borderTop: "1px dashed #86efac", fontSize: "11px", color: "#047857", fontWeight: "600" }}>
                  💡 Si tu salida supera las {parseFloat(loteFefo.cantidad_disponible.toFixed(3))} unidades, el sistema usará los demás lotes automáticamente.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campo de cantidad de salida */}
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
            />
            {/* Muestra la unidad de presentacion del reactivo seleccionado */}
            {id_reactivo && (
              <span className="input-group-text fw-bold" style={{ background: "#f1f5f9", borderTopRightRadius: "10px", borderBottomRightRadius: "10px", fontSize: "12px", color: "#0077B6" }}>
                {reactivos.find(x => x.id_reactivo === parseInt(id_reactivo))?.presentacion_reactivo}
              </span>
            )}
          </div>
          {/* Indicador de estado de la cantidad ingresada respecto al stock */}
          {loteFefo && (
            <div className={`form-text fw-bold mt-1 ${parseFloat(cantidad_salida) > stockTotalDisponible ? 'text-danger' : 'text-success'}`} style={{ fontSize: "11px" }}>
              {parseFloat(cantidad_salida) > stockTotalDisponible 
                ? `❌ Insuficiente (Máx Total: ${parseFloat(stockTotalDisponible.toFixed(3))})`
                : parseFloat(cantidad_salida) > loteFefo.cantidad_disponible 
                  ? `🔀 Se distribuirá entre ${lotesFefoProcesados.length} lotes`
                  : `✅ Se tomará del lote #${loteFefo.lote}`
              }
            </div>
          )}
        </div>

        {/* Campo de fecha de salida */}
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

        {/* Campo de hora de salida */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">⏰ Hora</label>
          <input type="time" className="form-control" style={inputStyle}
            value={hora_salida} onChange={(e) => setHoraSalida(e.target.value)}
            min="07:00" max="16:00" required />
        </div>

        {/* Campo de observaciones */}
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
          {/* Contador de caracteres */}
          <div className="text-end mt-1">
            <small className="text-muted" style={{ fontSize: "10px", fontWeight: "600" }}>
              {observaciones.length} / 500
            </small>
          </div>
        </div>

        {/* Boton de envio con estado de carga */}
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
            {/* Muestra spinner mientras carga o el texto segun sea crear o editar */}
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

// Exporta el componente para su uso en otras partes de la aplicacion
export default SalidaReactivoForm;
