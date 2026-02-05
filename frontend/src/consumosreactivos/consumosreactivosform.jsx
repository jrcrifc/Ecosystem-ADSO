import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ConsumosReactivosForm = ({ hideModal, selectedconsumo, refreshData }) => {
  const [idreactivo, setIdreactivo] = useState("");
  const [idlote, setIdlote] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [idresponsable, setIdresponsable] = useState("");
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (selectedconsumo) {
      setIdreactivo(selectedconsumo.id_reactivo || "");
      setIdlote(selectedconsumo.id_lote || "");
      setCantidad(selectedconsumo.cantidad || "");
      setIdresponsable(selectedconsumo.id_responsable || "");
      setEstado(selectedconsumo.estado ?? 1);
    } else {
      setIdreactivo("");
      setIdlote("");
      setCantidad("");
      setIdresponsable("");
      setEstado(1);
    }
  }, [selectedconsumo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      id_reactivo: parseInt(idreactivo),
      id_lote: parseInt(idlote),
      cantidad: parseFloat(cantidad),
      id_responsable: parseInt(idresponsable),
      estado: estado,
    };

    try {
      if (selectedconsumo) {
        await apiAxios.put(`api/consumoreactivo/${selectedconsumo.id_consumo_reactivos}`, data);
        Swal.fire("¡Listo!", "Actualizado correctamente", "success");
      } else {
        await apiAxios.post("api/consumoreactivo", data);
        Swal.fire("¡Listo!", "Registrado correctamente", "success");
      }
      refreshData();
      hideModal();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">
        {/* ID REACTIVO */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            ID Reactivo
          </label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={idreactivo}
            onChange={(e) => setIdreactivo(e.target.value)}
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
            value={idlote}
            onChange={(e) => setIdlote(e.target.value)}
            required
          />
        </div>

        {/* CANTIDAD */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            Cantidad
          </label>
          <input
            type="number"
            step="0.01"
            className="form-control form-control-sm"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />
        </div>

        {/* RESPONSABLE */}
        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
            ID Responsable
          </label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={idresponsable}
            onChange={(e) => setIdresponsable(e.target.value)}
            required
          />
        </div>

        {/* ESTADO ACTUAL (solo al editar) */}
        {selectedconsumo && (
          <div className="col-12">
            <div className="alert alert-info py-2 text-center" style={{ fontSize: "0.9rem" }}>
              <strong>Estado actual:</strong>{" "}
              <span className={`badge ${estado === 1 ? "bg-success" : "bg-danger"}`}>
                {estado === 1 ? "ACTIVO" : "INACTIVO"}
              </span>
              <br />
              <small className="text-muted">
                (Cambiar desde la tabla principal)
              </small>
            </div>
          </div>
        )}

        {/* ESTADO INICIAL (solo al crear) */}
        {!selectedconsumo && (
          <div className="col-12">
            <label className="form-label fw-semibold text-muted" style={{ fontSize: "0.9rem" }}>
              Estado inicial
            </label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="activo"
                  value={1}
                  checked={estado === 1}
                  onChange={() => setEstado(1)}
                />
                <label className="form-check-label text-success fw-semibold" htmlFor="activo">
                  Activo
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inactivo"
                  value={0}
                  checked={estado === 0}
                  onChange={() => setEstado(0)}
                />
                <label className="form-check-label text-danger fw-semibold" htmlFor="inactivo">
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
            {selectedconsumo ? "Actualizar" : "Guardar"} Consumo
          </button>
        </div>
      </div>
    </form>
  );
};

export default ConsumosReactivosForm;