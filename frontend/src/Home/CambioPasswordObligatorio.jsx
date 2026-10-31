import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiAxios from "../api/axiosConfig";
import Swal from "sweetalert2";
import logo from "./ecosystem_logo.png";

const CambioPasswordObligatorio = () => {
  const navigate = useNavigate();
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordNueva !== confirmarPassword) {
      return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }
    if (passwordNueva.length < 8) {
      return Swal.fire("Error", "La contraseña debe tener al menos 8 caracteres", "error");
    }

    setLoading(true);
    try {
      const userStored = JSON.parse(sessionStorage.getItem("user"));
      const token = sessionStorage.getItem("token");
      
      // La contraseña actual es el documento
      const passwordActual = userStored.documento;

      await apiAxios.post("/api/auth/change-password", {
        passwordActual,
        passwordNueva
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await Swal.fire("¡Éxito!", "Contraseña actualizada correctamente. Por favor inicia sesión de nuevo.", "success");
      
      sessionStorage.clear();
      window.location.href = "/UserLogin";
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "No se pudo cambiar la contraseña", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f9ff", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", maxWidth: "400px", width: "100%", textAlign: "center" }}>
        <img src={logo} alt="Logo" style={{ width: "80px", marginBottom: "20px" }} />
        <h2 style={{ fontWeight: "800", color: "#0077B6", marginBottom: "10px" }}>Cambio de Contraseña</h2>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "30px" }}>
          Por seguridad, debes cambiar tu contraseña inicial (tu número de documento) para poder continuar.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Nueva contraseña"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              required
              style={{ borderRadius: "10px", padding: "12px" }}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="form-control"
              placeholder="Confirmar contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
              style={{ borderRadius: "10px", padding: "12px" }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            disabled={loading}
            style={{ background: "#0077B6", color: "#fff", fontWeight: "700", borderRadius: "10px", padding: "12px" }}
          >
            {loading ? "Cambiando..." : "Actualizar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambioPasswordObligatorio;
