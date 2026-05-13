import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ReactivoForm = ({ selectedReactivo, refreshData, hideModal }) => {
  const [loading, setLoading] = useState(false);
  const [presentacion_reactivo, setPresentacion_reactivo] = useState("");
  const [nom_reactivo, setNom_reactivo] = useState("");
  const [nom_reactivo_ingles, setNom_reactivo_ingles] = useState("");
  const [formula_reactivo, setFormula_reactivo] = useState("");
  const [color_almacenamiento, setColor_almacenamiento] = useState("");
  const [color_stand, setColor_stand] = useState("");
  const [stand, setStand] = useState("");
  const [columna, setColumna] = useState("");
  const [fila, setFila] = useState("");
  const [clasificacion_reactivo, setClasificacion_reactivo] = useState("");
  const [estado, setEstado] = useState(1);

  // Mapeo de colores para visualización rápida
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
    "Peligro para la salud": "#3b82f6", // Azul (sistema antiguo)
    "Inflamabilidad": "#ef4444",      // Rojo
    "Riesgo de reactividad": "#facc15", // Amarillo
    "Peligro de contacto": "#ffffff",    // Blanco
    "Riesgo minimo": "#22c55e",         // Verde
  };

  useEffect(() => {
    if (selectedReactivo) {
      setPresentacion_reactivo(selectedReactivo.presentacion_reactivo || "");
      setNom_reactivo(selectedReactivo.nom_reactivo || "");
      setNom_reactivo_ingles(selectedReactivo.nom_reactivo_ingles || "");
      setFormula_reactivo(selectedReactivo.formula_reactivo || "");
      setColor_almacenamiento(selectedReactivo.color_almacenamiento || "");
      setColor_stand(selectedReactivo.color_stand || "");
      setStand(selectedReactivo.stand || "");
      setColumna(selectedReactivo.columna || "");
      setFila(selectedReactivo.fila || "");
      setClasificacion_reactivo(selectedReactivo.clasificacion_reactivo || "");
      setEstado(selectedReactivo.estado ?? 1);
    } else {
      setPresentacion_reactivo("");
      setNom_reactivo("");
      setNom_reactivo_ingles("");
      setFormula_reactivo("");
      setColor_almacenamiento("");
      setColor_stand("");
      setStand("");
      setColumna("");
      setFila("");
      setClasificacion_reactivo("");
      setEstado(1);
    }
  }, [selectedReactivo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom_reactivo.trim()) {
      Swal.fire("⚠️ Falta información", "El nombre del reactivo es obligatorio", "warning");
      return;
    }

    setLoading(true);

    const data = {
      presentacion_reactivo: presentacion_reactivo || null,
      nom_reactivo: nom_reactivo.trim(),
      nom_reactivo_ingles: nom_reactivo_ingles.trim() || null,
      formula_reactivo: formula_reactivo.trim() || null,
      color_almacenamiento: color_almacenamiento || null,
      color_stand: color_stand || null,
      stand: stand.trim() || null,
      columna: columna.trim() || null,
      fila: fila.trim() || null,
      clasificacion_reactivo: clasificacion_reactivo || null,
      estado,
    };

    try {
      if (selectedReactivo && selectedReactivo.id_reactivo) {
        await apiAxios.put(`/api/reactivos/${selectedReactivo.id_reactivo}`, data);
        Swal.fire({ icon: 'success', title: '✅ Actualizado', text: 'Reactivo modificado correctamente', timer: 2000, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/reactivos", data);
        Swal.fire({ icon: 'success', title: '✅ Registrado', text: 'Reactivo creado correctamente', timer: 2000, showConfirmButton: false });
      }

      refreshData();
      hideModal();
    } catch (error) {
      console.error("Error al guardar reactivo:", error);
      const msg = error.response?.data?.message || "No se pudo guardar el reactivo";
      Swal.fire("💀 Error", msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderRadius: "10px",
    borderColor: "#e2e8f0",
    transition: "all 0.2s ease",
    padding: "10px"
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* NOMBRE REACTIVO */}
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Nombre del reactivo <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={nom_reactivo}
            onChange={(e) => setNom_reactivo(e.target.value)}
            required
            placeholder="Ej: Ácido Sulfúrico"
          />
        </div>

        {/* NOMBRE EN INGLÉS */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Nombre en inglés</label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={nom_reactivo_ingles}
            onChange={(e) => setNom_reactivo_ingles(e.target.value)}
            placeholder="Ej: Sulfuric Acid"
          />
        </div>

        {/* FÓRMULA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fórmula química</label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={formula_reactivo}
            onChange={(e) => setFormula_reactivo(e.target.value)}
            placeholder="Ej: H2SO4"
          />
        </div>

        {/* PRESENTACIÓN */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Unidad de Medida / Presentación</label>
          <select
            className="form-select"
            style={inputStyle}
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

        {/* COLOR ALMACENAMIENTO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Color Almacenamiento (Pictograma)</label>
          <div className="position-relative">
            <select
              className="form-select"
              style={inputStyle}
              value={color_almacenamiento}
              onChange={(e) => setColor_almacenamiento(e.target.value)}
            >
              <option value="">Seleccione...</option>
              {Object.keys(swatches).slice(11).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
              <option value="Preparados">Preparados</option>
              <option value="N/A">N/A</option>
            </select>
            {color_almacenamiento && swatches[color_almacenamiento] && (
               <div style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", borderRadius: "50%", background: swatches[color_almacenamiento], border: "1px solid #ddd" }} />
            )}
          </div>
        </div>

        {/* CLASIFICACIÓN */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Clasificación</label>
          <select
            className="form-select"
            style={inputStyle}
            value={clasificacion_reactivo}
            onChange={(e) => setClasificacion_reactivo(e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Peligro de contacto">Peligro de contacto</option>
            <option value="Peligro de reactividad">Peligro de reactividad</option>
            <option value="Peligro de inflamabilidad">Peligro de inflamabilidad</option>
            <option value="Riesgo minimo">Riesgo mínimo</option>
            <option value="Peligro para salud">Peligro para la salud</option>
            <option value="Evalué el almacenamiento individualmente">Evalué el almacenamiento individualmente</option>
          </select>
        </div>

        {/* COLOR STAND */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Color del stand</label>
          <div className="position-relative">
            <select
              className="form-select"
              style={inputStyle}
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

        {/* STAND / COLUMNA / FILA */}
        <div className="col-md-4">
          <label className="form-label fw-semibold text-muted">Stand</label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={stand}
            onChange={(e) => setStand(e.target.value)}
            placeholder="Ej: A"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold text-muted">Columna</label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={columna}
            onChange={(e) => setColumna(e.target.value)}
            placeholder="Ej: 2"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold text-muted">Fila</label>
          <input
            type="text"
            className="form-control"
            style={inputStyle}
            value={fila}
            onChange={(e) => setFila(e.target.value)}
            placeholder="Ej: 3"
          />
        </div>

        {/* BOTÓN */}
        <div className="col-12 mt-4">
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-3 shadow-sm" 
            disabled={loading}
            style={{ borderRadius: "12px", fontWeight: "700", background: "linear-gradient(135deg, #0077B6, #00B4D8)", border: "none" }}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Guardando...</>
            ) : (
              selectedReactivo ? "Actualizar Datos del Reactivo" : "Registrar Nuevo Reactivo"
            )}
          </button>
        </div>

      </div>
    </form>
  );
};

export default ReactivoForm;