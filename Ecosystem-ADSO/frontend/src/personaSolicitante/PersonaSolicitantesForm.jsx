import apiAxios from "../api/axiosConfig.js";
import { useState, useEffect } from "react";

const PersonaSolicitantesForm = ({ hideModal, selectedPersona, refreshData }) => {
  const [Documento, setDocumento] = useState("");
  const [Nombres, setNombres] = useState("");
  const [Correo, setCorreo] = useState("");
  const [Telefono, setTelefono] = useState("");
  const [Direccion, setDireccion] = useState("");

  useEffect(() => {
    if (selectedPersona) {
      setDocumento(selectedPersona.Documento);
      setNombres(selectedPersona.Nombres);
      setCorreo(selectedPersona.Correo);
      setTelefono(selectedPersona.Telefono);
      setDireccion(selectedPersona.Direccion);
    } else {
      setDocumento("");
      setNombres("");
      setCorreo("");
      setTelefono("");
      setDireccion("");
    }
  }, [selectedPersona]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { Documento, Nombres, Correo, Telefono, Direccion };

    try {
      if (selectedPersona) {
        await apiAxios.put(`api/personaSolicitante/${selectedPersona.id_persona_solicitante}`, data);
      } else {
        await apiAxios.post("api/personaSolicitante", data);
      }

      refreshData();
      hideModal();

    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Documento</label>
      <input className="form-control" value={Documento} onChange={(e) => setDocumento(e.target.value)} />

      <label className="mt-2">Nombres</label>
      <input className="form-control" value={Nombres} onChange={(e) => setNombres(e.target.value)} />

      <label className="mt-2">Correo</label>
      <input className="form-control" value={Correo} onChange={(e) => setCorreo(e.target.value)} />

      <label className="mt-2">Teléfono</label>
      <input className="form-control" value={Telefono} onChange={(e) => setTelefono(e.target.value)} />

      <label className="mt-2">Dirección</label>
      <input className="form-control" value={Direccion} onChange={(e) => setDireccion(e.target.value)} />

      <button type="submit" className="btn btn-success mt-3 w-100">
        {selectedPersona ? "Actualizar" : "Registra"}
      </button>
    </form>
  );
};

export default PersonaSolicitantesForm;
