import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ReactivoForm = ({ selectedReactivo, refreshData, hideModal }) => {
  const [presentacion_reactivo, setPresentacion_reactivo] = useState("");
  const [cantidad_presentacion, setCantidad_presentacion] = useState("");
  const [nom_reactivo, setNom_reactivo] = useState("");
  const [nom_reactivo_ingles, setNom_reactivo_ingles] = useState("");
  const [formula_reactivo, setFormula_reactivo] = useState("");
  const [color_almacenamiento, setColor_almacenamiento] = useState("");
  const [color_stand, setColor_stand] = useState("");
  const [stand, setStand] = useState("");
  const [columna, setColumna] = useState("");
  const [fila, setFila] = useState("");
  const [clasificacion_reactivo, setClasificacion_reactivo] = useState("");
  const [existencia_reactivo, setExistencia_reactivo] = useState("SI");
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (selectedReactivo) {
      setPresentacion_reactivo(selectedReactivo.presentacion_reactivo || "");
      setCantidad_presentacion(selectedReactivo.cantidad_presentacion || "");
      setNom_reactivo(selectedReactivo.nom_reactivo || "");
      setNom_reactivo_ingles(selectedReactivo.nom_reactivo_ingles || "");
      setFormula_reactivo(selectedReactivo.formula_reactivo || "");
      setColor_almacenamiento(selectedReactivo.color_almacenamiento || "");
      setColor_stand(selectedReactivo.color_stand || "");
      setStand(selectedReactivo.stand || "");
      setColumna(selectedReactivo.columna || "");
      setFila(selectedReactivo.fila || "");
      setClasificacion_reactivo(selectedReactivo.clasificacion_reactivo || "");
      setExistencia_reactivo(selectedReactivo.existencia_reactivo || "SI");
      setEstado(selectedReactivo.estado ?? 1);
    } else {
      // valores por defecto al crear nuevo
      setPresentacion_reactivo("");
      setCantidad_presentacion("");
      setNom_reactivo("");
      setNom_reactivo_ingles("");
      setFormula_reactivo("");
      setColor_almacenamiento("");
      setColor_stand("");
      setStand("");
      setColumna("");
      setFila("");
      setClasificacion_reactivo("");
      setExistencia_reactivo("SI");
      setEstado(1);
    }
  }, [selectedReactivo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Preparar datos
    const data = {
      presentacion_reactivo,
      cantidad_presentacion: cantidad_presentacion ? parseInt(cantidad_presentacion) : null,
      nom_reactivo,
      nom_reactivo_ingles,
      formula_reactivo,
      color_almacenamiento,
      color_stand,
      stand,
      columna,
      fila,
      clasificacion_reactivo,
      existencia_reactivo,
      estado,
    };

    try {
      if (selectedReactivo) {
        // Actualizar
        await apiAxios.put(
          `/api/reactivo/${selectedReactivo.id_reactivo}`,
          data
        );
        Swal.fire(" Actualizado", "Reactivo modificado correctamente", "success");
      } else {
        // Crear
        await apiAxios.post("/api/reactivo", data);
        Swal.fire("Registrado", "Reactivo creado correctamente", "success");
      }

      refreshData();
      hideModal();
    } catch (error) {
      console.error("Error al guardar reactivo:", error);
      Swal.fire("💀 Error", "No se pudo guardar el reactivo", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* NOMBRE REACTIVO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Nombre del reactivo</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={nom_reactivo}
            onChange={(e) => setNom_reactivo(e.target.value)}
            required
          />
        </div>

        {/* NOMBRE EN INGLÉS */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Nombre en inglés</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={nom_reactivo_ingles}
            onChange={(e) => setNom_reactivo_ingles(e.target.value)}
          />
        </div>

        {/* PRESENTACIÓN */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Presentación</label>
          <select
            className="form-select form-select-sm"
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

        {/* CANTIDAD PRESENTACIÓN */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad por presentación</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={cantidad_presentacion}
            onChange={(e) => setCantidad_presentacion(e.target.value)}
            min="0"
          />
        </div>

        {/* FÓRMULA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fórmula</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={formula_reactivo}
            onChange={(e) => setFormula_reactivo(e.target.value)}
          />
        </div>

        {/* EXISTENCIA */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">¿Existe en almacén?</label>
          <select
            className="form-select form-select-sm"
            value={existencia_reactivo}
            onChange={(e) => setExistencia_reactivo(e.target.value)}
          >
            <option value="SI">Sí</option>
            <option value="NO">No</option>
          </select>
        </div>

        {/* COLOR ALMACENAMIENTO */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Color almacenamiento (pictograma)</label>
          <select
            className="form-select form-select-sm"
            value={color_almacenamiento}
            onChange={(e) => setColor_almacenamiento(e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Peligro para la salud">Peligro para la salud</option>
            <option value="Inflamabilidad">Inflamabilidad</option>
            <option value="N/A">N/A</option>
            <option value="Peligro de contacto">Peligro de contacto</option>
            <option value="Riesgo minimo">Riesgo mínimo</option>
            <option value="Riesgo de reactividad">Riesgo de reactividad</option>
            <option value="Preparados">Preparados</option>
          </select>
        </div>

        {/* CLASIFICACIÓN */}
        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Clasificación</label>
          <select
            className="form-select form-select-sm"
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
          <select
            className="form-select form-select-sm"
            value={color_stand}
            onChange={(e) => setColor_stand(e.target.value)}
          >
            <option value="">Seleccione...</option>
            <option value="Morado">Morado</option>
            <option value="Negro">Negro</option>
            <option value="Agua marina">Agua marina</option>
            <option value="Rosado">Rosado</option>
            <option value="Fucsia">Fucsia</option>
            <option value="Gris claro">Gris claro</option>
            <option value="Ciruela">Ciruela</option>
            <option value="Purpura">Púrpura</option>
            <option value="Marron">Marrón</option>
            <option value="Gris oscuro">Gris oscuro</option>
            <option value="Cafe">Café</option>
          </select>
        </div>

        {/* STAND / COLUMNA / FILA */}
        <div className="col-md-4">
          <label className="form-label fw-semibold text-muted">Stand</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={stand}
            onChange={(e) => setStand(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold text-muted">Columna</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={columna}
            onChange={(e) => setColumna(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold text-muted">Fila</label>
          <input
            type="text"
            className="form-control form-control-sm"
            value={fila}
            onChange={(e) => setFila(e.target.value)}
          />
        </div>

        {/* BOTÓN */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100">
            {selectedReactivo ? "Actualizar Reactivo" : "Registrar Reactivo"}
          </button>
        </div>

      </div>
    </form>
  );
};

export default ReactivoForm;