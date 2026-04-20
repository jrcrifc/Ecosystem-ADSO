import { useEffect, useState } from "react";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";

export default function CuentadanteForm({ selectedCuentadante, refreshParent, hideModal }) {
  const [form, setForm] = useState({
    nom_cuentadante: "",
    apell_cuentadante: "",
    tel_cuentadante: ""
  });

  const [loading, setLoading] = useState(false);

  // Cargar datos al editar
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire("Error", "No se encontró token de autenticación", "warning");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (selectedCuentadante) {
        await apiAxios.put(
          `/api/cuentadante/${selectedCuentadante.id_cuentadante}`,
          form,
          config
        );
      } else {
        await apiAxios.post("/api/cuentadante", form, config);
      }

      Swal.fire({
        icon: "success",
        title: selectedCuentadante ? "¡Actualizado!" : "¡Registrado!",
        timer: 1500,
        showConfirmButton: false
      });

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

      {/* NOMBRE */}
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

      {/* APELLIDO */}
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

      {/* TELÉFONO (NUEVO) */}
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

      {/* BOTÓN */}
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