import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const IngresoReactivoForm = ({ selectedIngreso, refreshData, hideModal }) => {
  const [fech_ingreso, setFech_ingreso] = useState("");
  const [cantidad_ingreso, setCantidad_ingreso] = useState("");
  const [id_responsable, setId_responsable] = useState("");
  const [id_lote, setId_lote] = useState("");
  const [id_reactivo, setId_reactivo] = useState("");
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (selectedIngreso) {
      setFech_ingreso(selectedIngreso.fech_ingreso?.slice(0, 10) || "");
      setCantidad_ingreso(selectedIngreso.cantidad_ingreso || "");
      setId_responsable(selectedIngreso.id_responsable || "");
      setId_lote(selectedIngreso.id_lote || "");
      setId_reactivo(selectedIngreso.id_reactivo || "");
      setEstado(selectedIngreso.estado ?? 1);
    } else {
      const hoy = new Date().toISOString().slice(0, 10);
      setFech_ingreso(hoy);
      setCantidad_ingreso("");
      setId_responsable("");
      setId_lote("");
      setId_reactivo("");
      setEstado(1);
    }
  }, [selectedIngreso]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fech_ingreso,
      cantidad_ingreso: parseFloat(cantidad_ingreso),
      id_responsable: parseInt(id_responsable),
      id_lote: parseInt(id_lote),
      id_reactivo: parseInt(id_reactivo),
      estado,
    };

    try {
      if (selectedIngreso) {
        await apiAxios.put(
          `api/ingresoreactivo/${selectedIngreso.id_ingreso_reactivo}`,
          data
        );
        Swal.fire("¡Éxito!", "Ingreso actualizado correctamente", "success");
      } else {
        await apiAxios.post("api/ingresoreactivo", data);
        Swal.fire("¡Éxito!", "Ingreso registrado correctamente", "success");
      }

      refreshData();
      hideModal();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el ingreso", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        {/* FECHA DE INGRESO */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            Fecha de Ingreso
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={fech_ingreso}
            onChange={(e) => setFech_ingreso(e.target.value)}
            required
          />
        </div>

        {/* CANTIDAD */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            Cantidad Ingresada
          </label>
          <input
            type="number"
            step="0.01"
            className="form-control form-control-sm"
            value={cantidad_ingreso}
            onChange={(e) => setCantidad_ingreso(e.target.value)}
            required
          />
        </div>

        {/* ID REACTIVO */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            ID Reactivo
          </label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_reactivo}
            onChange={(e) => setId_reactivo(e.target.value)}
            required
          />
        </div>

        {/* ID LOTE */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            ID Lote
          </label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_lote}
            onChange={(e) => setId_lote(e.target.value)}
            required
          />
        </div>

        {/* RESPONSABLE */}
        <div className="col-12 col-md-12">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            ID Responsable
          </label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={id_responsable}
            onChange={(e) => setId_responsable(e.target.value)}
            required
          />
        </div>

        {/* ESTADO ACTUAL (solo al editar) */}
        {selectedIngreso && (
          <div className="col-12">
            <div className="alert alert-info py-2 text-center" style={{ fontSize: "0.9rem" }}>
              <strong>Estado actual:</strong>{" "}
              <span className={`badge ${estado === 1 ? "bg-success" : "bg-danger"}`}>
                {estado === 1 ? "ACTIVO" : "INACTIVO"}
              </span>
              <br />
              <small className="text-muted">
                Puedes cambiarlo desde la tabla principal
              </small>
            </div>
          </div>
        )}

        {/* ESTADO INICIAL (solo al crear nuevo) */}
        {!selectedIngreso && (
          <div className="col-12">
            <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
              Estado inicial
            </label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="activoNuevo"
                  checked={estado === 1}
                  onChange={() => setEstado(1)}
                />
                <label className="form-check-label text-success fw-semibold" htmlFor="activoNuevo">
                  Activo
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inactivoNuevo"
                  checked={estado === 0}
                  onChange={() => setEstado(0)}
                />
                <label className="form-check-label text-danger fw-semibold" htmlFor="inactivoNuevo">
                  Inactivo
                </label>
              </div>
            </div>
          </div>
        )}

        {/* BOTÓN GUARDAR */}
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100">
            <i className="fa-solid fa-save me-2"></i>
            {selectedIngreso ? "Actualizar Ingreso" : "Registrar Ingreso"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default IngresoReactivoForm;