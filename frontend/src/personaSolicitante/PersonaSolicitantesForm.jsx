import { useState } from "react";
import apiAxios from "../api/axiosConfig.js"; // ✅ corregido el nombre

const PersonaSolicitantesForm = () => {
  const [Documento, setDocumento] = useState('');
  const [Nombres, setNombres] = useState('');
  const [Correo, setCorreo] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [textFormButton, setTextFormButton] = useState('Enviar');

  const gestionarForm = async (e) => {
    e.preventDefault();

    try {
      if (textFormButton === 'Enviar') {
        // Crear nuevo solicitante
        const response = await apiAxios.post('./api/personaSolicitante', {
          Documento,
          Nombres,
          Correo,
          Telefono,
          Direccion,
        });

        alert('Registro exitoso');
        console.log(response.data);
        // Limpieza del formulario
        setDocumento('');
        setNombres('');
        setCorreo('');
        setTelefono('');
        setDireccion('');

      } else if (textFormButton === 'Actualizar') {
        // Actualizar solicitante existente
        const response = await apiAxios.put(`/personaSolicitante/${Documento}`, {
          Nombres,
          Correo,
          Telefono,
          Direccion,
        });

        alert('Actualización exitosa');
        console.log(response.data);
      }

    } catch (error) {
      console.error('Error al enviar el formulario:', error.response ? error.response.data : error.message);
      alert('Error al procesar el formulario. Revisa la consola.');
    }
  };
   return(
    <>
    <div  className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
    <form onSubmit={gestionarForm} encType="multipart/form-data"className="col-12 col-md-6">
        <div className="mb-3">
          <label htmlFor="documento" className="form-label">Documento</label>
          <input type="text"id="documento"className="form-control"value={Documento} onChange ={(e) => setDocumento(e.target.value)} required/>
        </div>

        <div className="mb-3">
          <label htmlFor="nombres" className="form-label">Nombres:</label>
          <input type="text" id="nombres" className="form-control" value={Nombres} onChange={(e) => setNombres(e.target.value)}/>
        </div>

        <div className="mb-3">
          <label htmlFor="correo" className="form-label">Correo:</label>
          <input type="email"id="correo"className="form-control" value={Correo} onChange={(e) => setCorreo(e.target.value)}/>
        </div>

        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono:</label>
          <input type="text"id="telefono"className="form-control"value={Telefono}onChange={(e) => setTelefono(e.target.value)}/>
        </div>

        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección:</label>
          <input type="text"id="direccion"className="form-control"value={Direccion} onChange={(e) => setDireccion(e.target.value)}/>
        </div>

        <div className="mb-3 text-center">
          <input type="submit" className="btn btn-primary w-50" value={textFormButton}/>
        </div>
      </form>
      </div>
    </>
  )
}

export default PersonaSolicitantesForm