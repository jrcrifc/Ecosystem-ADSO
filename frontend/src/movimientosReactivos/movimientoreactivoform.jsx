// Archivo de formulario de ingreso de reactivos con seleccion de lote y proveedor

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";

// Define el componente de formulario que recibe props para editar o crear movimientos
const MovimientoReactivoForm = ({ selectedMovimiento, refreshData, hideModal }) => {
  // Estado que indica si el formulario esta procesando una solicitud
  const [loading, setLoading] = useState(false);
  // Estado del formulario con los campos de ingreso
  const [form, setForm] = useState({
    fecha_vencimiento: "",
    cantidad_inicial: "",
    lote: "",
    id_reactivo: "",
    id_proveedor: "",
  });

  // Estado que almacena la lista de reactivos disponibles
  const [reactivos, setReactivos] = useState([]);
  // Estado que almacena la lista de proveedores disponibles
  const [proveedores, setProveedores] = useState([]);

  // Efecto que carga los catalogos de reactivos y proveedores al montar
  useEffect(() => {
    cargarReactivos();
    cargarProveedores();
  }, []);

  // ===== Obtener lista de reactivos =====

  // Funcion asincrona para obtener los reactivos desde la API
  const cargarReactivos = async () => {
    try {
      // Realiza la peticion GET al endpoint de reactivos
      const res = await apiAxios.get("/api/reactivos");
      // Actualiza el estado con la lista de reactivos
      setReactivos(res.data);
    } catch (error) {
      // Muestra error en consola si falla la carga
      console.error("Error al cargar reactivos:", error);
    }
  };

  // ===== Obtener lista de proveedores =====

  // Funcion asincrona para obtener los proveedores desde la API
  const cargarProveedores = async () => {
    try {
      // Realiza la peticion GET al endpoint de proveedores
      const res = await apiAxios.get("/api/proveedor");
      // Actualiza el estado con la lista de proveedores
      setProveedores(res.data);
    } catch (error) {
      // Muestra error en consola si falla la carga
      console.error("Error al cargar proveedores:", error);
    }
  };

  // Efecto que carga los datos del movimiento al editar o resetea el formulario
  useEffect(() => {
    // Verifica si hay un movimiento seleccionado para editar
    if (selectedMovimiento) {
      // Asigna los valores del movimiento existente al formulario
      setForm({
        fecha_vencimiento: selectedMovimiento.fecha_vencimiento?.slice(0, 10) || "",
        cantidad_inicial: selectedMovimiento.cantidad_inicial ? parseFloat(selectedMovimiento.cantidad_inicial).toString() : "",
        lote: selectedMovimiento.lote || "",
        id_reactivo: selectedMovimiento.id_reactivo || "",
        id_proveedor: selectedMovimiento.id_proveedor || "",
      });
    } else {
      // Resetea el formulario si es una creacion nueva
      setForm({
        fecha_vencimiento: "",
        cantidad_inicial: "",
        lote: "",
        id_reactivo: "",
        id_proveedor: "",
      });
    }
  }, [selectedMovimiento]);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualiza solo el campo modificado manteniendo los demas
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== Validar y enviar formulario de ingreso =====

  // Manejador del envio del formulario para crear o actualizar un ingreso
  const handleSubmit = async (e) => {
    // Previene la recarga de la pagina al enviar el formulario
    e.preventDefault();

    // Verifica que los campos obligatorios esten presentes
    if (!form.cantidad_inicial || !form.id_reactivo) {
      Swal.fire("⚠️ Campos obligatorios", "El reactivo y la cantidad son requeridos para el ingreso.", "warning");
      return;
    }
    
    // Convierte la cantidad a numero flotante
    const cantidad = parseFloat(form.cantidad_inicial);
    // Valida que la cantidad sea un numero positivo
    if (isNaN(cantidad) || cantidad <= 0) {
      Swal.fire("⚠️ Cantidad Inválida", "La cantidad de ingreso debe ser un número mayor a 0", "warning");
      return;
    }

    // Valida la fecha de vencimiento si fue proporcionada
    if (form.fecha_vencimiento) {
      const hoy = new Date();
      const offset = hoy.getTimezoneOffset() * 60000;
      const localHoyStr = (new Date(hoy - offset)).toISOString().slice(0, 10);

      // Verifica que la fecha de vencimiento sea futura
      if (form.fecha_vencimiento <= localHoyStr) {
        Swal.fire("⚠️ Fecha de Vencimiento", "La fecha de vencimiento no puede ser hoy ni una fecha pasada.", "warning");
        return;
      }
    }

    // Busca el nombre del reactivo seleccionado para la confirmacion
    const reactivoNombre = reactivos.find(r => r.id_reactivo === parseInt(form.id_reactivo))?.nom_reactivo;
    // Muestra dialogo de confirmacion antes de guardar
    const confirm = await Swal.fire({
      title: '¿Confirmar Ingreso?',
      text: `Vas a registrar ${cantidad} unidades de "${reactivoNombre}". ¿Los datos son correctos?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, registrar',
      cancelButtonText: 'Revisar',
      confirmButtonColor: '#0077B6'
    });

    // Sale si el usuario cancelo la confirmacion
    if (!confirm.isConfirmed) return;

    // Activa el estado de carga
    setLoading(true);

    // Prepara los datos a enviar al backend
    const dataToSend = {
      fecha_vencimiento: form.fecha_vencimiento || null,
      cantidad_inicial: cantidad,
      lote: form.lote.trim() || null,
      id_reactivo: parseInt(form.id_reactivo),
      id_proveedor: form.id_proveedor ? parseInt(form.id_proveedor) : null,
    };

    try {
      // Verifica si se esta editando un movimiento existente
      if (selectedMovimiento) {
        // Envia peticion PUT para actualizar el movimiento
        await apiAxios.put(`/api/movimientos/${selectedMovimiento.id_movimiento_reactivo}`, dataToSend);
        Swal.fire({ icon: 'success', title: '✅ Actualizado', text: 'Ingreso modificado con éxito', timer: 2000, showConfirmButton: false });
      } else {
        // Envia peticion POST para crear un nuevo ingreso
        await apiAxios.post("/api/movimientos", dataToSend);
        Swal.fire({ icon: 'success', title: '✅ Registrado', text: 'Nuevo ingreso de reactivo completado', timer: 2000, showConfirmButton: false });
      }
      // Refresca la tabla de datos despues de guardar
      refreshData();
      // Cierra el modal de formulario
      hideModal();
    } catch (err) {
      // Muestra error en consola si falla la operacion
      console.error(err);
      // Obtiene el mensaje de error del servidor o uno generico
      const msg = err.response?.data?.message || "Hubo un problema al guardar el registro de inventario";
      // Muestra alerta de error al usuario
      Swal.fire("Error", msg, "error");
    } finally {
      // Desactiva el estado de carga al finalizar
      setLoading(false);
    }
  };

  // Obtiene el reactivo seleccionado para mostrar su presentacion
  const selectedReactivo = reactivos.find(x => x.id_reactivo === parseInt(form.id_reactivo));

  // Estilos base reutilizables para los campos del formulario
  const inputStyle = {
    borderRadius: "10px",
    borderColor: "#dbeafe",
    transition: "all 0.2s ease"
  };

  // Renderiza el formulario
  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">
        {/* Campo de seleccion de reactivo */}
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
            {/* Mapea los reactivos ordenando activos primero */}
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

        {/* Campo de cantidad inicial con unidad */}
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
            {/* Muestra la unidad de presentacion del reactivo seleccionado */}
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

        {/* Campo de numero de lote */}
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

        {/* Campo de fecha de vencimiento */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha de Vencimiento</label>
          <input
            type="date"
            name="fecha_vencimiento"
            className="form-control"
            value={form.fecha_vencimiento}
            onChange={handleChange}
            // Calcula el minimo como el dia siguiente al actual
            min={(() => {
              const d = new Date();
              d.setDate(d.getDate() + 1);
              return d.toISOString().slice(0, 10);
            })()}
            style={inputStyle}
          />
        </div>

        {/* Campo de seleccion de proveedor */}
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
            {/* Mapea los proveedores disponibles */}
            {proveedores.map((p) => (
              <option key={p.id_proveedor} value={p.id_proveedor}>
                {p.nom_proveedor} {p.apel_proveedor}
              </option>
            ))}
          </select>
        </div>

        {/* Boton de envio con estado de carga */}
        <div className="col-12 mt-4">
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 shadow-sm" 
            disabled={loading}
            style={{ borderRadius: "12px", fontWeight: "700", background: "linear-gradient(135deg, #0077B6, #023E8A)", border: "none" }}
          >
            {/* Muestra spinner mientras carga o el texto segun sea crear o editar */}
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

// Exporta el componente para su uso en otras partes de la aplicacion
export default MovimientoReactivoForm;
