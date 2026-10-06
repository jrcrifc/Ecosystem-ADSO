// Archivo de formulario de creacion/edicion de reactivos con ubicacion y clasificacion

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";

// Define el componente de formulario que recibe props para editar o crear reactivos
const ReactivoForm = ({ selectedReactivo, refreshData, hideModal }) => {
  // Estado que indica si el formulario esta procesando una solicitud
  const [loading, setLoading] = useState(false);
  // Estado individual para cada campo del formulario de reactivo
  const [presentacion_reactivo, setPresentacion_reactivo] = useState("");
  const [nom_reactivo, setNom_reactivo] = useState("");

  const [color_almacenamiento, setColor_almacenamiento] = useState("");
  const [color_stand, setColor_stand] = useState("");
  const [stand, setStand] = useState("");
  const [columna, setColumna] = useState("");
  const [fila, setFila] = useState("");
  const [clasificacion_reactivo, setClasificacion_reactivo] = useState("");
  const [estado, setEstado] = useState(1);

  // Mapeo de colores para visualizacion rapida en los selectores
  const swatches = {
    "Morado": "#800080",
    "Negro": "#000000",
    "Agua marina": "#7FFFD4",
    "Rosado": "#FFC0CB",
    "Fucsia": "#FF00FF",
    "Gris claro": "#D3D3D3",
    "Ciruela": "#DDA0DD",
    "Purpura": "#A020F0",
    "Marron": "#A52A2A",
    "Gris oscuro": "#A9A9A9",
    "Cafe": "#8B4513",
    "Peligro para la salud": "#3b82f6",
    "Inflamabilidad": "#ef4444",
    "Riesgo de reactividad": "#facc15",
    "Peligro de contacto": "#ffffff",
    "Riesgo minimo": "#22c55e",
  };

  // Efecto que carga los datos del reactivo al editar o resetea el formulario
  useEffect(() => {
    // Verifica si hay un reactivo seleccionado para editar
    if (selectedReactivo) {
      // Asigna cada valor del reactivo existente a su estado correspondiente
      setPresentacion_reactivo(selectedReactivo.presentacion_reactivo || "");
      setNom_reactivo(selectedReactivo.nom_reactivo || "");

      setColor_almacenamiento(selectedReactivo.color_almacenamiento || "");
      setColor_stand(selectedReactivo.color_stand || "");
      setStand(selectedReactivo.stand || "");
      setColumna(selectedReactivo.columna || "");
      setFila(selectedReactivo.fila || "");
      setClasificacion_reactivo(selectedReactivo.clasificacion_reactivo || "");
      setEstado(selectedReactivo.estado ?? 1);
    } else {
      // Resetea todos los campos si es una creacion nueva
      setPresentacion_reactivo("");
      setNom_reactivo("");

      setColor_almacenamiento("");
      setColor_stand("");
      setStand("");
      setColumna("");
      setFila("");
      setClasificacion_reactivo("");
      setEstado(1);
    }
  }, [selectedReactivo]);

  // Manejador del envio del formulario para crear o actualizar un reactivo
  const handleSubmit = async (e) => {
    // Previene la recarga de la pagina al enviar el formulario
    e.preventDefault();

    // Valida que el nombre del reactivo no este vacio
    if (!nom_reactivo.trim()) {
      Swal.fire("⚠️ Falta información", "El nombre del reactivo es obligatorio", "warning");
      return;
    }

    // Activa el estado de carga
    setLoading(true);

    // Prepara los datos del formulario para enviar al backend
    const data = {
      presentacion_reactivo: presentacion_reactivo || null,
      nom_reactivo: nom_reactivo.trim(),

      color_almacenamiento: color_almacenamiento || null,
      color_stand: color_stand || null,
      stand: stand.trim() || null,
      columna: columna.trim() || null,
      fila: fila.trim() || null,
      clasificacion_reactivo: clasificacion_reactivo || null,
      estado,
    };

    try {
      // Verifica si se esta editando un reactivo existente
      if (selectedReactivo && selectedReactivo.id_reactivo) {
        // Envia peticion PUT para actualizar el reactivo
        await apiAxios.put(`/api/reactivos/${selectedReactivo.id_reactivo}`, data);
        Swal.fire({ icon: 'success', title: '✅ Actualizado', text: 'Reactivo modificado correctamente', timer: 2000, showConfirmButton: false });
      } else {
        // Envia peticion POST para crear un nuevo reactivo
        await apiAxios.post("/api/reactivos", data);
        Swal.fire({ icon: 'success', title: '✅ Registrado', text: 'Reactivo creado correctamente', timer: 2000, showConfirmButton: false });
      }

      // Refresca la tabla de datos despues de guardar
      refreshData();
      // Cierra el modal de formulario
      hideModal();
    } catch (error) {
      // Muestra error en consola si falla la operacion
      console.error("Error al guardar reactivo:", error);
      // Obtiene el mensaje de error del servidor o uno generico
      const msg = error.response?.data?.message || "No se pudo guardar el reactivo";
      // Muestra alerta de error al usuario
      Swal.fire("💀 Error", msg, "error");
    } finally {
      // Desactiva el estado de carga al finalizar
      setLoading(false);
    }
  };

  // Estilos base reutilizables para los campos del formulario
  const inputStyle = {
    borderRadius: "10px",
    borderColor: "#e2e8f0",
    transition: "all 0.2s ease",
    padding: "10px"
  };

  // Renderiza el formulario
  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate style={{ padding: "16px 20px" }}>
      <div className="row g-3">

        {/* Datos Básicos */}
        <div className="col-12" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "4px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#065f46", fontWeight: "bold" }}>
            📝 Datos Básicos del Reactivo
          </p>
        </div>

        {/* Campo de nombre del reactivo */}
        <div className="col-md-6">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nombre del reactivo <span className="text-danger">*</span></label>
          <input
            type="text"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
            value={nom_reactivo}
            onChange={(e) => setNom_reactivo(e.target.value)}
            required
            placeholder="Ej: Ácido Sulfúrico"
          />
        </div>

        {/* Campo de unidad de medida o presentacion */}
        <div className="col-md-6">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Unidad de Medida / Presentación</label>
          <select
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
            value={presentacion_reactivo}
            onChange={(e) => setPresentacion_reactivo(e.target.value)}
            required
          >
            <option value="">Seleccione...</option>
            <option value="kilogramos">Kilogramos</option>
            <option value="gramos">Gramos</option>
            <option value="litros">Litros</option>
            <option value="sobres">Sobres</option>
          </select>
        </div>

        {/* Clasificación & Pictograma */}
        <div className="col-12 mt-3" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "4px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#065f46", fontWeight: "bold" }}>
            ⚠️ Clasificación y Almacenamiento
          </p>
        </div>

        {/* Campo de color de almacenamiento con indicador visual */}
        <div className="col-md-6">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Color Almacenamiento (Pictograma)</label>
          <div className="position-relative">
            <select
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
              value={color_almacenamiento}
              onChange={(e) => setColor_almacenamiento(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {Object.keys(swatches).slice(11).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              <option value="N/A">N/A</option>
            </select>
            {color_almacenamiento && swatches[color_almacenamiento] && (
              <div style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", borderRadius: "50%", background: swatches[color_almacenamiento], border: "1px solid #ddd" }} />
            )}
          </div>
        </div>

        {/* Campo de clasificacion del reactivo */}
        <div className="col-md-6">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Clasificación</label>
          <select
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
            value={clasificacion_reactivo}
            onChange={(e) => setClasificacion_reactivo(e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Peligro de contacto">Peligro de contacto</option>
            <option value="Peligro de reactividad">Peligro de reactividad</option>
            <option value="Peligro de inflamabilidad">Peligro de inflamabilidad</option>
            <option value="Riesgo minimo">Riesgo mínimo</option>
            <option value="Peligro para salud">Peligro para la salud</option>
          </select>
        </div>

        {/* Ubicación Física */}
        <div className="col-12 mt-3" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "8px 12px", marginBottom: "4px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#065f46", fontWeight: "bold" }}>
            📍 Ubicación Física
          </p>
        </div>

        {/* Campo de color del stand con indicador visual */}
        <div className="col-md-12">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Color del stand</label>
          <div className="position-relative">
            <select
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
              value={color_stand}
              onChange={(e) => setColor_stand(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {Object.keys(swatches).slice(0, 11).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {color_stand && swatches[color_stand] && (
              <div style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", borderRadius: "50%", background: swatches[color_stand], border: "1px solid #ddd" }} />
            )}
          </div>
        </div>

        {/* Campos de ubicacion: Stand, Columna y Fila */}
        <div className="col-md-4">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Stand</label>
          <input
            type="text"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
            value={stand}
            onChange={(e) => setStand(e.target.value)}
            placeholder="Ej: A"
          />
        </div>
        <div className="col-md-4">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Columna</label>
          <input
            type="text"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
            value={columna}
            onChange={(e) => setColumna(e.target.value)}
            placeholder="Ej: 2"
          />
        </div>
        <div className="col-md-4">
          <label style={{ fontSize: "11px", fontWeight: "bold", color: "#000", marginBottom: "4px", display: "block", textTransform: "uppercase", letterSpacing: "0.5px" }}>Fila</label>
          <input
            type="text"
            style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1.5px solid #dbeafe", fontSize: "13px", color: "#1e293b", outline: "none" }}
            value={fila}
            onChange={(e) => setFila(e.target.value)}
            placeholder="Ej: 3"
          />
        </div>

        {/* Boton de envio */}
        <div className="col-12 mt-4 d-flex gap-2">
          <button type="button" onClick={hideModal}
            style={{ flex: 1, padding: "8px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{ flex: 2, padding: "8px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #0077B6, #023E8A)", color: "#fff", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", fontSize: "13px", opacity: loading ? 0.75 : 1 }}
          >
            {loading ? "Guardando..." : selectedReactivo ? "Actualizar Reactivo" : " Registrar Reactivo"}
          </button>
        </div>

      </div>
    </form>
  );
};

// Exporta el componente para su uso en otras partes de la aplicacion
export default ReactivoForm;
