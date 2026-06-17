import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function AprendizForm({ selectedAprendiz, fichas, refreshParent, hideModal }) {
  const [form, setForm] = useState({
    documento: "",
    nombres_apellidos: "",
    email: "",
    id_ficha: "",
    tipo_documento: "",
    fecha_nacimiento: "",
    genero: "",
    estado_civil: "",
    direccion: "",
    tipo_direccion: "",
    telefono: "",
    estrato: "",
    tipo_aprendiz: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedAprendiz) {
      setForm({
        documento: selectedAprendiz.documento || "",
        nombres_apellidos: selectedAprendiz.nombres_apellidos || "",
        email: selectedAprendiz.email || selectedAprendiz.usuario?.email || "",
        id_ficha: selectedAprendiz.id_ficha || "",
        tipo_documento: selectedAprendiz.tipo_documento || "",
        fecha_nacimiento: selectedAprendiz.fecha_nacimiento || "",
        genero: selectedAprendiz.genero || "",
        estado_civil: selectedAprendiz.estado_civil || "",
        direccion: selectedAprendiz.direccion || "",
        tipo_direccion: selectedAprendiz.tipo_direccion || "",
        telefono: selectedAprendiz.telefono || "",
        estrato: selectedAprendiz.estrato || "",
        tipo_aprendiz: selectedAprendiz.tipo_aprendiz || ""
      });
    } else {
      setForm({
        documento: "",
        nombres_apellidos: "",
        email: "",
        id_ficha: "",
        tipo_documento: "",
        fecha_nacimiento: "",
        genero: "",
        estado_civil: "",
        direccion: "",
        tipo_direccion: "",
        telefono: "",
        estrato: "",
        tipo_aprendiz: ""
      });
    }
  }, [selectedAprendiz]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const saveData = async () => {
    setLoading(true);
    try {
      if (!form.documento.trim() || !form.nombres_apellidos.trim() || !form.email.trim()) {
        Swal.fire("Error", "Documento, Nombres y Correo son obligatorios", "warning");
        setLoading(false);
        return;
      }

      const payload = {
        documento: form.documento.trim(),
        nombres_apellidos: form.nombres_apellidos.trim(),
        email: form.email.trim(),
        id_ficha: form.id_ficha || null,
        tipo_documento: form.tipo_documento || null,
        fecha_nacimiento: form.fecha_nacimiento || null,
        genero: form.genero || null,
        estado_civil: form.estado_civil || null,
        direccion: form.direccion || null,
        tipo_direccion: form.tipo_direccion || null,
        telefono: form.telefono || null,
        estrato: form.estrato || null,
        tipo_aprendiz: form.tipo_aprendiz || null
      };

      if (selectedAprendiz) {
        await apiAxios.put(`/api/aprendices/${selectedAprendiz.id_aprendiz}`, payload);
        Swal.fire({ icon: "success", title: "¡Actualizado!", timer: 1800, showConfirmButton: false });
      } else {
        await apiAxios.post("/api/aprendices", payload);
        Swal.fire({ icon: "success", title: "¡Guardado!", timer: 1800, showConfirmButton: false });
      }

      if (hideModal) hideModal();
      if (refreshParent) refreshParent();

    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar el aprendiz"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="p-3">
      <div className="row g-3">
        {/* Datos Básicos */}
        <div className="col-12">
          <p style={{ fontWeight: "700", color: "#0077B6", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "0" }}>
            📝 Datos Básicos
          </p>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Documento</label>
          <input className="form-control" name="documento" value={form.documento} onChange={handleChange} placeholder="Sólo números" required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Nombres y Apellidos</label>
          <input className="form-control" name="nombres_apellidos" value={form.nombres_apellidos} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Correo electrónico</label>
          <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Ficha</label>
          <select className="form-select" name="id_ficha" value={form.id_ficha} onChange={handleChange}>
            <option value="">Sin ficha asignada</option>
            {fichas.map(f => (
              <option key={f.id_ficha} value={f.id_ficha}>
                {f.numero_ficha} - {f.programa?.nombre_programa || 'Sin programa'}
              </option>
            ))}
          </select>
        </div>

        {/* Información Personal */}
        <div className="col-12 mt-4">
          <p style={{ fontWeight: "700", color: "#0077B6", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "0" }}>
            📋 Información Personal
          </p>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Tipo de Documento</label>
          <select className="form-select" name="tipo_documento" value={form.tipo_documento} onChange={handleChange}>
            <option value="">Seleccione...</option>
            <option value="CC">CC</option>
            <option value="TI">TI</option>
            <option value="CE">CE</option>
            <option value="PEP">PEP</option>
            <option value="PPT">PPT</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Fecha de Nacimiento</label>
          <input type="date" className="form-control" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Género</label>
          <select className="form-select" name="genero" value={form.genero} onChange={handleChange}>
            <option value="">Seleccione...</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Estado Civil</label>
          <select className="form-select" name="estado_civil" value={form.estado_civil} onChange={handleChange}>
            <option value="">Seleccione...</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Unión libre">Unión libre</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>

        {/* Ubicación y Contacto */}
        <div className="col-12 mt-4">
          <p style={{ fontWeight: "700", color: "#0077B6", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "0" }}>
            📍 Ubicación y Contacto
          </p>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Dirección</label>
          <input className="form-control" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Tipo de Dirección</label>
          <select className="form-select" name="tipo_direccion" value={form.tipo_direccion} onChange={handleChange}>
            <option value="">Seleccione...</option>
            <option value="Urbana">Urbana</option>
            <option value="Rural">Rural</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Teléfono</label>
          <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Estrato</label>
          <select className="form-select" name="estrato" value={form.estrato} onChange={handleChange}>
            <option value="">Seleccione...</option>
            {[1, 2, 3, 4, 5, 6].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Formación */}
        <div className="col-12 mt-4">
          <p style={{ fontWeight: "700", color: "#0077B6", fontSize: "14px", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", marginBottom: "0" }}>
            🏷️ Formación
          </p>
        </div>
        <div className="col-md-12">
          <label className="form-label fw-bold" style={{ color: "#0A1628" }}>Tipo de aprendiz</label>
          <input className="form-control" name="tipo_aprendiz" value={form.tipo_aprendiz} onChange={handleChange} placeholder="Ej: Regular" />
        </div>
      </div>

      <button
        type="button"
        className="btn w-100 mt-4"
        style={{ background: "#023E8A", color: "#fff", fontWeight: "600", borderRadius: "10px", border: "none" }}
        onClick={saveData}
        disabled={loading}
      >
        {loading ? "Guardando..." : selectedAprendiz ? "Actualizar Aprendiz" : "Guardar Aprendiz"}
      </button>
    </form>
  );
}
