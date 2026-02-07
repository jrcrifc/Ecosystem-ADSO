import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ConsumosReactivosForm = ({ selectedconsumo, refreshData }) => {
  const [idreactivo, setIdreactivo] = useState("");
  const [idlote, setIdlote] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [idresponsable, setIdresponsable] = useState("");
  const [estado, setEstado] = useState(1);

  // Cargar datos si es edición
  useEffect(() => {
    if (selectedconsumo) {
      setIdreactivo(selectedconsumo.id_reactivo || "");
      setIdlote(selectedconsumo.id_lote || "");
      setCantidad(selectedconsumo.cantidad || "");
      setIdresponsable(selectedconsumo.id_responsable || "");
      setEstado(selectedconsumo.estado ?? 1);
    } else {
      // Limpiar formulario al crear nuevo
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
      estado: parseInt(estado),
    };

    try {
      if (selectedconsumo) {
        // EDITAR
        await apiAxios.put(`/api/consumoreactivo/${selectedconsumo.id_consumo_reactivos}`, data);
        console.log("%cCONSUMO ACTUALIZADO", "color: orange; font-weight: bold;", data);
        Swal.fire({
          icon: "success",
          title: "¡Actualizado!",
          text: "Consumo modificado correctamente",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // CREAR
        const response = await apiAxios.post("/api/consumoreactivo", data);
        console.log("%cCONSUMO CREADO", "color: lime; font-weight: bold;", response.data);
        Swal.fire({
          icon: "success",
          title: "¡Registrado!",
          text: "Nuevo consumo agregado",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // Cerrar modal
      document.querySelector("#exampleModal .btn-close")?.click();

      // Recargar datos
      refreshData();

    } catch (error) {
      console.error("%cERROR AL GUARDAR", "color: red; font-weight: bold;", error.response?.data || error);
      const msg = error.response?.data?.message || "Error al guardar el consumo";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">ID Reactivo</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={idreactivo}
            onChange={(e) => setIdreactivo(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">ID Lote</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={idlote}
            onChange={(e) => setIdlote(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">Cantidad</label>
          <input
            type="number"
            step="0.01"
            className="form-control form-control-sm"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
            min="0.01"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label fw-semibold">ID Responsable</label>
          <input
            type="number"
            className="form-control form-control-sm"
            value={idresponsable}
            onChange={(e) => setIdresponsable(e.target.value)}
            required
            min="1"
          />
        </div>

        {/* Estado solo al crear */}
        {!selectedconsumo && (
          <div className="col-12 mt-3">
            <label className="form-label fw-semibold">Estado inicial</label>
            <div className="d-flex gap-4 mt-2">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="activo"
                  checked={estado === 1}
                  onChange={() => setEstado(1)}
                />
                <label className="form-check-label text-success fw-bold" htmlFor="activo">
                  Activo
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="inactivo"
                  checked={estado === 0}
                  onChange={() => setEstado(0)}
                />
                <label className="form-check-label text-danger fw-bold" htmlFor="inactivo">
                  Inactivo
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Estado al editar */}
        {selectedconsumo && (
          <div className="col-12">
            <div className="alert alert-info py-2 text-center mt-3">
              <strong>Estado actual:</strong>{" "}
              <span className={`badge ${estado === 1 ? "bg-success" : "bg-danger"}`}>
                {estado === 1 ? "ACTIVO" : "INACTIVO"}
              </span>
              <br />
              <small className="text-muted">Cambiar desde la tabla principal</small>
            </div>
          </div>
        )}

        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100 btn-lg">
            {selectedconsumo ? "Actualizar Consumo" : "Guardar Consumo"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ConsumosReactivosForm;