// Archivo de formulario de creacion/edicion de estados de solicitud

// Importa la instancia centralizada de Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig.js";
// Importa los hooks de React para manejar estado y efectos secundarios
import { useState, useEffect } from "react";
// Importa SweetAlert2 para mostrar alertas interactivas al usuario
import Swal from "sweetalert2";

// Define el componente de formulario que recibe props para editar o crear estados
const EstadoSolicitudForm = ({ selectedEstado, refreshData, hideModal }) => {
  // Estado local para el nombre del estado seleccionado
  const [estado, setEstado] = useState("");
  // Estado local para indicar si el estado esta activo o inactivo
  const [activo, setActivo] = useState(1);

  // Lista fija de opciones disponibles para el estado de solicitud
  const opciones = ["generado", "aceptado", "prestado", "cancelado", "entregado"];

  // Efecto que carga los datos del estado al editar o resetea el formulario
  useEffect(() => {
    // Verifica si hay un estado seleccionado para editar
    if (selectedEstado) {
      // Asigna el nombre del estado existente al formulario
      setEstado(selectedEstado.estado || "");
      // Asigna el estado activo/inactivo existente al formulario
      setActivo(selectedEstado.activo ?? 1);
    } else {
      // Limpia el campo de estado si es una creacion nueva
      setEstado("");
      // Restablece el estado a activo por defecto
      setActivo(1);
    }
  }, [selectedEstado]);

  // ===== Guardar (crear o actualizar) estado de solicitud =====

  // Manejador del envio del formulario para crear o actualizar un estado
  const handleSubmit = async (e) => {
    // Previene la recarga de la pagina al enviar el formulario
    e.preventDefault();

    // Prepara los datos del formulario para enviar al backend
    const data = { estado, activo };

    try {
      // Verifica si se esta editando un estado existente
      if (selectedEstado) {
        // Envia peticion PUT para actualizar el estado existente
        await apiAxios.put(
          `api/estadosolicitud/${selectedEstado.id_estado_solicitud}`,
          data
        );
        // Muestra mensaje de exito al actualizar
        Swal.fire("Éxito", "Actualizado correctamente", "success");
      } else {
        // Envia peticion POST para crear un nuevo estado
        await apiAxios.post("api/estadosolicitud", data);
        // Muestra mensaje de exito al crear
        Swal.fire("Éxito", "Creado correctamente", "success");
      }

      // Refresca la tabla de datos despues de guardar
      refreshData();
      // Cierra el modal de formulario
      hideModal();
    } catch (error) {
      // Muestra mensaje de error si falla la operacion
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  // Renderiza el formulario
  return (
    // Formulario que ejecuta handleSubmit al enviarse
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Estado</label>
        {/* Selector desplegable para elegir el estado */}
        <select
          className="form-select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
        >
          <option value="">Seleccionar...</option>
          {/* Mapea las opciones disponibles en elementos option */}
          {opciones.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Muestra el estatus actual solo cuando se esta editando */}
      {selectedEstado && (
        <div className="alert alert-info">
          Estatus actual:{" "}
          <strong>{activo === 1 ? "ACTIVO" : "INACTIVO"}</strong>
        </div>
      )}

      {/* Boton de envio que cambia su texto segun sea crear o actualizar */}
      <button className="btn btn-primary w-100">
        {selectedEstado ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
};

// Exporta el componente para su uso en otras partes de la aplicacion
export default EstadoSolicitudForm;
