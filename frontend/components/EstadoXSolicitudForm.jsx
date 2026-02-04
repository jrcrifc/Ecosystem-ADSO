import { useState, useEffect } from "react";

export default function EstadoXSolicitudForm({ onSubmit, initialData, solicitudes, estados, onDelete, onDuplicate, onCancel }) {
  const [form, setForm] = useState({ Id_solicitud: "", id_estado_solicitud: "" });

  useEffect(() => {
    if (initialData) {
      setForm({
        Id_solicitud: initialData.Id_solicitud || "",
        id_estado_solicitud: initialData.id_estado_solicitud || ""
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!initialData) {
      setForm({ Id_solicitud: "", id_estado_solicitud: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Solicitud</label>
          <select
            className="form-select"
            value={form.Id_solicitud}
            onChange={(e) => setForm({ ...form, Id_solicitud: e.target.value })}
            required
          >
            <option value="">Seleccionar Solicitud</option>
            {solicitudes.map(sol => (
              <option key={sol.id} value={sol.id}>
                Solicitud {sol.id} - {sol.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={form.id_estado_solicitud}
            onChange={(e) => setForm({ ...form, id_estado_solicitud: e.target.value })}
            required
          >
            <option value="">Seleccionar Estado</option>
            {estados.map(est => (
              <option key={est.id_estado_solicitud} value={est.id_estado_solicitud}>
                {est.estado}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success">
              {initialData ? "Actualizar" : "Crear"}
            </button>
            {initialData && (
              <>
                <button 
                  type="button" 
                  className="btn btn-warning"
                  onClick={() => onDuplicate && onDuplicate(initialData)}
                >
                  Duplicar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => onDelete && onDelete(initialData.id)}
                >
                  Eliminar
                </button>
              </>
            )}
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => onCancel && onCancel()}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}