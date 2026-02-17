// movimientoReactivoForm.jsx
import apiAxios from "../api/axiosConfig";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const movimientoReactivoForm = ({ selectedMovimiento, refreshData }) => {
  const [form, setForm] = useState({
    fecha_ingreso: "",
    cantidad_inicial: "",
    cantidad_salida: "0",
    lote: "",
    id_reactivo: "",
    id_proveedor: "",
    estado_inventario: "en stock",
  });

  useEffect(() => {
    if (selectedMovimiento) {
      setForm({
        fecha_ingreso: selectedMovimiento.fecha_ingreso?.slice(0,10) || "",
        cantidad_inicial: selectedMovimiento.cantidad_inicial || "",
        cantidad_salida: selectedMovimiento.cantidad_salida || "0",
        lote: selectedMovimiento.lote || "",
        id_reactivo: selectedMovimiento.id_reactivo || "",
        id_proveedor: selectedMovimiento.id_proveedor || "",
        estado_inventario: selectedMovimiento.estado_inventario || "en stock",
      });
    } else {
      setForm({
        fecha_ingreso: new Date().toISOString().slice(0,10),
        cantidad_inicial: "",
        cantidad_salida: "0",
        lote: "",
        id_reactivo: "",
        id_proveedor: "",
        estado_inventario: "en stock",
      });
    }
  }, [selectedMovimiento]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!form.fecha_ingreso || !form.cantidad_inicial || !form.id_reactivo) {
      Swal.fire("Campos obligatorios", "Fecha, cantidad inicial y reactivo son requeridos", "warning");
      return;
    }

    const dataToSend = {
      ...form,
      cantidad_inicial: parseFloat(form.cantidad_inicial),
      cantidad_salida: parseFloat(form.cantidad_salida || 0),
      id_reactivo: parseInt(form.id_reactivo),
      id_proveedor: form.id_proveedor ? parseInt(form.id_proveedor) : null,
    };

    try {
      if (selectedMovimiento) {
        await apiAxios.put(`/api/movimientoreactivo/${selectedMovimiento.id_movimiento_reactivo}`, dataToSend);
        Swal.fire("Actualizado", "Movimiento modificado correctamente", "success");
      } else {
        await apiAxios.post("/api/movimientoreactivo", dataToSend);
        Swal.fire("Registrado", "Nuevo ingreso creado correctamente", "success");
      }

      refreshData();
      // Cierra modal (Bootstrap 5)
      const modal = document.getElementById("modalIngreso");
      const bsModal = bootstrap.Modal.getInstance(modal);
      bsModal?.hide();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "No se pudo guardar el registro";
      Swal.fire("Error", msg, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Fecha ingreso</label>
          <input
            type="date"
            name="fecha_ingreso"
            className="form-control form-control-sm"
            value={form.fecha_ingreso}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad inicial</label>
          <input
            type="number"
            name="cantidad_inicial"
            step="0.001"
            min="0"
            className="form-control form-control-sm"
            value={form.cantidad_inicial}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Cantidad salida</label>
          <input
            type="number"
            name="cantidad_salida"
            step="0.001"
            min="0"
            className="form-control form-control-sm"
            value={form.cantidad_salida}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">Lote</label>
          <input
            type="text"
            name="lote"
            className="form-control form-control-sm"
            value={form.lote}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">ID Reactivo</label>
          <input
            type="number"
            name="id_reactivo"
            className="form-control form-control-sm"
            value={form.id_reactivo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label fw-semibold text-muted">ID Proveedor</label>
          <input
            type="number"
            name="id_proveedor"
            className="form-control form-control-sm"
            value={form.id_proveedor}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label fw-semibold text-muted">Estado inventario</label>
          <select
            name="estado_inventario"
            className="form-select form-select-sm"
            value={form.estado_inventario}
            onChange={handleChange}
          >
            <option value="en stock">En stock</option>
            <option value="agotado">Agotado</option>
          </select>
        </div>

        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-primary w-100">
            {selectedMovimiento ? "Actualizar" : "Registrar Ingreso"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default movimientoReactivoForm;