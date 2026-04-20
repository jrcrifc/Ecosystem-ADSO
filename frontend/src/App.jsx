import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import apiAxios from "./api/axiosConfig.js";

import CrudReactivos from "./reactivos/crudreactivos.jsx";
import CrudmovimientoReactivo from "./movimientosReactivos/crudmovimientoreactivo.jsx";
import Crudproveedor from "./proveedores/Crudproveedor.jsx";
import CrudEquipo from "./equipos/crudequipos.jsx";
import Crudestadoequipo from "./estadoequipo/crudestadoequipo.jsx";
import Crudestadosolicitud from "./estadosolicitud/crudestadosolicitud.jsx";
import Crudsalidas from "./salidasReactivos/crudsalidareactivo.jsx";
import Crudcuentadantes from "./cuentadante/crudcuentadante.jsx";
import Crudsolicitud from "./Solicitud/crudsolicitud.jsx";
import CrudEstadoxSolicitud from "./estadoxsolicitud/cruestadoxsolicitud.jsx";
import Home from "./Home/home.jsx";
import UserLogin from "./Home/userLogin.jsx";
import Register from "./Home/Register.jsx";
import GestionSolicitudes from "./Solicitud/GestionSolicitudes.jsx";
import CrudSolicitudxEquipo from "./solicitudxequipo/crudsolicitudxequipo.jsx";
import HistorialEstadoEquipo from "./estadoequipo/HistorialEstadoEquipo.jsx";
import GestionEstadoEquipo from "./estadoequipo/GestionEstadoEquipo.jsx";
import ControlReactivos from "./movimientosReactivos/ControlReactivos.jsx";
import FormularioAcceso from "./FormularioAcceso/FormularioAcceso.jsx";
import GestionUsuarios from "./usuarios/GestionUsuarios.jsx";

// ✅ Aprendiz/Instructor → formulario | Pasante/Gestor → pantalla espera
const FormularioRoute = ({ isAuth, userData, userRol, logOut, children }) => {
  if (!isAuth) return <Navigate to="/UserLogin" replace />;

  const estado = userData?.estado || userData?.user?.estado;
  const rolesFormulario = ['Aprendiz', 'Instructor'];
  const rolesEspera = ['Pasante', 'Gestor'];

  if (rolesFormulario.includes(userRol) && estado !== 'aprobado') {
    return <FormularioAcceso userData={userData} logOut={logOut} />;
  }

  if (rolesEspera.includes(userRol) && estado !== 'aprobado') {
    return (
      <div style={{
        minHeight: "100vh", background: "#f0f9ff",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
      }}>
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "48px 40px",
          maxWidth: "480px", width: "100%", textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)", border: "1px solid #e0f2fe"
        }}>
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>⏳</div>
          <h2 style={{ fontWeight: "700", color: "#0A1628", marginBottom: "10px" }}>Cuenta en revisión</h2>
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
            Tu cuenta como <strong>{userRol}</strong> está siendo revisada por el administrador.
            Recibirás una notificación cuando sea aprobada.
          </p>
          <div style={{
            background: "#fff8e1", border: "1px solid #ffe082",
            borderRadius: "10px", padding: "14px 18px", marginBottom: "24px"
          }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#7c5e00" }}>
              🔔 Revisa la campanita de notificaciones para saber cuando el admin te apruebe.
            </p>
          </div>
          <button onClick={logOut} style={{
            background: "transparent", border: "1px solid #e5e7eb",
            borderRadius: "10px", padding: "10px 28px",
            color: "#64748b", cursor: "pointer", fontSize: "13px"
          }}>Cerrar sesión</button>
        </div>
      </div>
    );
  }

  return children;
};

// ✅ Solo Administrador
const SoloAdminRoute = ({ isAuth, rol, children }) => {
  if (!isAuth) return <Navigate to="/UserLogin" replace />;
  if (rol !== 'Administrador') return <Navigate to="/home" replace />;
  return children;
};

// ✅ Admin + Pasante + Gestor aprobados
const AdminRoute = ({ isAuth, rol, userData, children }) => {
  if (!isAuth) return <Navigate to="/UserLogin" replace />;
  if (['Aprendiz', 'Instructor'].includes(rol)) return <Navigate to="/home" replace />;
  const estado = userData?.estado || userData?.user?.estado;
  if (['Pasante', 'Gestor'].includes(rol) && estado !== 'aprobado') {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { setIsAuth(false); setIsLoading(false); return; }
    try {
      const user = JSON.parse(stored);
      if (user?.token) { setIsAuth(true); setUserData(user); }
      else setIsAuth(false);
    } catch {
      localStorage.removeItem("user");
      setIsAuth(false);
    }
    setIsLoading(false);
  }, []);

  const logOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsAuth(false);
    setUserData(null);
  };

  // ✅ Recarga el usuario desde el backend y actualiza el estado
  const recargarUsuario = async () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return;
      const userActual = JSON.parse(stored);
      const id = userActual?.id_usuario || userActual?.user?.id_usuario;
      if (!id) return;

      const token = localStorage.getItem("token");
      const res = await apiAxios.get(`/api/auth/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userActualizado = { ...userActual, ...res.data };
      localStorage.setItem("user", JSON.stringify(userActualizado));
      setUserData(userActualizado);

      // Si fue rechazado, expulsar
      if (res.data.estado === 'rechazado') {
        logOut();
      }
    } catch { }
  };

  const userRol = userData?.rol || userData?.user?.rol;

  if (isLoading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <>
      {isAuth && (
        <Navbar
          isAuth={isAuth}
          logOut={logOut}
          users={userData}
          rol={userRol}
          onAprobado={recargarUsuario}
        />
      )}
      <div style={{ padding: "20px" }}>
        <Routes>

          {/* LOGIN */}
          <Route path="/UserLogin" element={isAuth ? <Navigate to="/home" replace /> : <UserLogin setIsAuth={setIsAuth} setUserData={setUserData} />} />

          {/* REGISTER */}
          <Route path="/register" element={isAuth ? <Navigate to="/home" replace /> : <Register />} />

          {/* HOME */}
          <Route path="/home" element={
            <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
              <Home />
            </FormularioRoute>
          } />

          {/* SOLICITUDES — Aprendiz/Instructor aprobados y Admin */}
          <Route path="/solicitud" element={
            <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
              <Crudsolicitud />
            </FormularioRoute>
          } />
          <Route path="/estadoxsolicitud" element={
            <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
              <CrudEstadoxSolicitud />
            </FormularioRoute>
          } />

          {/* SOLO ADMINISTRADOR */}
          <Route path="/gestion-usuarios" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><GestionUsuarios /></SoloAdminRoute>} />
          <Route path="/gestion-solicitudes" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><GestionSolicitudes /></SoloAdminRoute>} />
          <Route path="/estadoSolicitud" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><Crudestadosolicitud /></SoloAdminRoute>} />

          {/* ADMIN + PASANTE + GESTOR */}
          <Route path="/reactivos" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><CrudReactivos /></AdminRoute>} />
          <Route path="/equipos" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><CrudEquipo /></AdminRoute>} />
          <Route path="/movimientoreactivo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><CrudmovimientoReactivo /></AdminRoute>} />
          <Route path="/proveedor" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><Crudproveedor /></AdminRoute>} />
          <Route path="/salidas" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><Crudsalidas /></AdminRoute>} />
          <Route path="/estadoequipo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><Crudestadoequipo /></AdminRoute>} />
          <Route path="/solicitudxequipo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><CrudSolicitudxEquipo /></AdminRoute>} />
          <Route path="/historial-equipo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><HistorialEstadoEquipo /></AdminRoute>} />
          <Route path="/gestion-equipo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><GestionEstadoEquipo /></AdminRoute>} />
          <Route path="/control-reactivos" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><ControlReactivos /></AdminRoute>} />
          <Route path="/cuentadante" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><Crudcuentadantes /></AdminRoute>} />

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to={isAuth ? "/home" : "/UserLogin"} replace />} />

        </Routes>
      </div>
    </>
  );
}

export default App;