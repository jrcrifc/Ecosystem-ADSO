// Archivo: cuentadanteForm.jsx — Formulario de creación/edición de cuentadantes

// Importa hooks de React para estado y efectos
import { useEffect, useState } from "react";
// Importa Axios para peticiones HTTP
import apiAxios from "../api/axiosConfig";
// Importa SweetAlert2 para alertas
import Swal from "sweetalert2";

// Componente del formulario de cuentadante
export default function CuentadanteForm({ selectedCuentadante, refreshParent, hideModal }) {
  // Estado local del formulario con los campos del cuentadante
  const [form, setForm] = useState({
    nom_cuentadante: "",
    apell_cuentadante: "",
    tel_cuentadante: ""
  });
  // Estado que indica si se está guardando
  const [loading, setLoading] = useState(false);
  // Efecto que carga los datos del cuentadante al editar o limpia al crear nuevo
  useEffect(() => {
    if (selectedCuentadante) {
      setForm({
        nom_cuentadante: selectedCuentadante.nom_cuentadante || "",
        apell_cuentadante: selectedCuentadante.apell_cuentadante || "",
        tel_cuentadante: selectedCuentadante.tel_cuentadante || ""
      });
    } else {
      setForm({
        nom_cuentadante: "",
        apell_cuentadante: "",
        tel_cuentadante: ""
      });
    }
  }, [selectedCuentadante]);
  // Función que maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Función asíncrona para guardar (crear o actualizar) un cuentadante
  const saveData = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      // Verifica que exista token de autenticación
      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      if (selectedCuentadante) {
        // Actualiza el cuentadante existente vía PUT
        await apiAxios.put(
          `/api/cuentadante/${selectedCuentadante.id_cuentadante}`,
          form,
          config
        );
      } else {
        // Crea un nuevo cuentadante vía POST
        await apiAxios.post("/api/cuentadante", form, config);
      }
      Swal.fire({
        icon: "success",
        title: selectedCuentadante ? "¡Actualizado!" : "¡Registrado!",
        timer: 1500,
        showConfirmButton: false
      });
      // Limpia el formulario después de guardar
      setForm({
        nom_cuentadante: "",
        apell_cuentadante: "",
        tel_cuentadante: ""
      });
      refreshParent?.();
      hideModal?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo guardar el cuentadante"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-3">
      {/* Campo de nombre del cuentadante */}
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          name="nom_cuentadante"
          value={form.nom_cuentadante}
          onChange={handleChange}
          required
        />
      </div>
      {/* Campo de apellido del cuentadante */}
      <div className="mb-3">
        <label className="form-label">Apellido</label>
        <input
          type="text"
          className="form-control"
          name="apell_cuentadante"
          value={form.apell_cuentadante}
          onChange={handleChange}
          required
        />
      </div>
      {/* Campo de teléfono del cuentadante */}
      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input
          type="number"
          className="form-control"
          name="tel_cuentadante"
          value={form.tel_cuentadante}
          onChange={handleChange}
          required
        />
      </div>
      {/* Botón de guardar */}
      <button
        type="button"
        className="btn btn-success w-100 mt-2"
        onClick={saveData}
        disabled={loading}
      >
        {loading
          ? "Guardando..."
          : selectedCuentadante
          ? "Actualizar Cuentadante"
          : "Registrar Cuentadante"}
      </button>
    </div>
  );
}
