import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import apiAxios from "./api/axiosConfig.js";
import socket from "./socket.js";
import Swal from "sweetalert2";

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
import HistorialEstadoEquipo from "./estadoequipo/HistorialEstadoEquipo.jsx";
import GestionEstadoEquipo from "./estadoequipo/GestionEstadoEquipo.jsx";
import ControlReactivos from "./movimientosReactivos/ControlReactivos.jsx";
import FormularioAcceso from "./FormularioAcceso/FormularioAcceso.jsx";
import GestionUsuarios from "./usuarios/GestionUsuarios.jsx";
import LogActividades from "./usuarios/LogActividades.jsx";
import SalidasReactivos from "./salidasReactivos/crudsalidareactivo.jsx";
import TopBar from "./TopBar.jsx";
import PerfilUsuario from "./Home/PerfilUsuario.jsx";
import OlvidarPassword from "./Home/OlvidarPassword.jsx";
import AcercaDe from "./Home/AcercaDe.jsx";

// ✅ Aprendiz/Instructor → formulario | Pasante/Gestor → pantalla espera
const FormularioRoute = ({ isAuth, userData, userRol, logOut, children }) => {
  if (!isAuth) return <Navigate to="/UserLogin" replace />;

  const estado = userData?.estado || userData?.user?.estado;
  const rolesRevision = ['Aprendiz', 'Instructor', 'Pasante', 'Gestor'];

  // Fail-safe: Si por alguna razón el estado es inactivo o rechazado y sigue logueado, no mostrar la pantalla de revisión
  if (estado === 'inactivo' || estado === 'rechazado') {
    return null; 
  }

  if (rolesRevision.includes(userRol) && estado !== 'aprobado') {
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

// ✅ Solo quienes pueden HACER solicitudes (Aprendiz, Instructor, Admin)
const SolicitanteRoute = ({ isAuth, rol, children }) => {
  if (!isAuth) return <Navigate to="/UserLogin" replace />;
  const rolesPermitidos = ['Aprendiz', 'Instructor', 'Administrador'];
  if (!rolesPermitidos.includes(rol)) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);



  // ✅ Escuchar eventos de cierre de sesión forzado
  useEffect(() => {
    if (!isAuth || !userData) return;
    
    const id = userData?.id_usuario || userData?.user?.id_usuario;
    if (!id) return;

    // Asegurar que el usuario está en su sala para recibir el evento
    if (socket.connected) {
      socket.emit("join", id);
    }
    
    const handleConnect = () => socket.emit("join", id);
    socket.on("connect", handleConnect);

    const handleForceLogout = (data) => {
      logOut();
      Swal.fire({
        icon: "error",
        title: "Acceso Revocado",
        text: data.mensaje || "Has sido desconectado por el administrador.",
        confirmButtonColor: "#d33",
        allowOutsideClick: false
      });
    };

    socket.on("force_logout", handleForceLogout);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("force_logout", handleForceLogout);
    };
  }, [isAuth, userData]);

  const logOut = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setIsAuth(false);
    setUserData(null);
  };

  const recargarUsuario = async (id, token, userActual) => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");
      
      const finalUser = userActual || (storedUser ? JSON.parse(storedUser) : null);
      const finalId = id || finalUser?.id_usuario || finalUser?.user?.id_usuario;
      const finalToken = token || storedToken;

      if (!finalId || !finalToken) return;

      const res = await apiAxios.get(`/api/auth/usuarios/${finalId}`, {
        headers: { Authorization: `Bearer ${finalToken}` }
      });

      const userActualizado = { ...userActual, ...res.data };
      sessionStorage.setItem("user", JSON.stringify(userActualizado));
      setUserData(userActualizado);

      // Si fue rechazado o inactivado, expulsar
      if (res.data.estado === 'rechazado' || res.data.estado === 'inactivo') {
        logOut();
        Swal.fire({
          icon: "error",
          title: "Acceso Denegado",
          text: res.data.estado === 'rechazado' 
            ? "Tu cuenta fue rechazada por el administrador." 
            : "Tu cuenta ha sido inactivada.",
          confirmButtonColor: "#d33",
          allowOutsideClick: false
        });
      }
    } catch { }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) { setIsAuth(false); setIsLoading(false); return; }
    try {
      const user = JSON.parse(stored);
      if (user?.token) { 
        setIsAuth(true); 
        setUserData(user); 
        const id = user?.id_usuario || user?.user?.id_usuario;
        recargarUsuario(id, user.token, user).finally(() => setIsLoading(false));
      } else {
        setIsAuth(false);
        setIsLoading(false);
      }
    } catch {
      sessionStorage.removeItem("user");
      setIsAuth(false);
      setIsLoading(false);
    }
  }, []);

  const userRol = userData?.rol || userData?.user?.rol;

  if (isLoading) return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "#f0f9ff"
    }}>
      <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <p style={{ marginTop: "16px", color: "#0077B6", fontWeight: "600", fontSize: "14px" }}>
        Iniciando Ecosystem...
      </p>
    </div>
  );

  return (
    <div className="sidebar-layout">
      {isAuth && (
        <Sidebar
          isAuth={isAuth}
          logOut={logOut}
          users={userData}
          rol={userRol}
          onAprobado={recargarUsuario}
        />
      )}
      <main className="sidebar-main-content" style={!isAuth ? { marginLeft: 0 } : {}}>
        {isAuth && (
          <TopBar
            userData={userData}
            userRol={userRol}
            logOut={logOut}
            onAprobado={recargarUsuario}
          />
        )}
        <div style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
          <Routes>

            {/* LOGIN */}
            <Route path="/UserLogin" element={isAuth ? <Navigate to="/home" replace /> : <UserLogin setIsAuth={setIsAuth} setUserData={setUserData} />} />

            {/* REGISTER */}
            <Route path="/register" element={isAuth ? <Navigate to="/home" replace /> : <Register />} />

            {/* OLVIDAR PASSWORD */}
            <Route path="/olvidar-password" element={isAuth ? <Navigate to="/home" replace /> : <OlvidarPassword />} />

            {/* HOME */}
            <Route path="/acerca-de" element={<AcercaDe />} />
            <Route path="/home" element={
              <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                <Home />
              </FormularioRoute>
            } />

            {/* PERFIL */}
            <Route path="/perfil" element={
              <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                <PerfilUsuario />
              </FormularioRoute>
            } />

            {/* SOLICITUDES */}
            <Route path="/solicitud" element={
              <SolicitanteRoute isAuth={isAuth} rol={userRol}>
                <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                  <Crudsolicitud />
                </FormularioRoute>
              </SolicitanteRoute>
            } />
            <Route path="/estadoxsolicitud" element={
              <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                <CrudEstadoxSolicitud />
              </FormularioRoute>
            } />

            {/* SOLO ADMINISTRADOR */}
            <Route path="/gestion-usuarios" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><GestionUsuarios /></SoloAdminRoute>} />
            <Route path="/auditoria" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><LogActividades /></SoloAdminRoute>} />
            <Route path="/gestion-solicitudes" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><GestionSolicitudes /></SoloAdminRoute>} />
            <Route path="/estadoSolicitud" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><Crudestadosolicitud /></SoloAdminRoute>} />

            {/* ADMIN + PASANTE + GESTOR */}
            <Route path="/reactivos" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><CrudReactivos /></AdminRoute>} />
            <Route path="/equipos" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><CrudEquipo /></AdminRoute>} />
            <Route path="/movimientoreactivo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><CrudmovimientoReactivo /></AdminRoute>} />
            <Route path="/proveedor" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><Crudproveedor /></SoloAdminRoute>} />
            <Route path="/salidas" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><Crudsalidas /></AdminRoute>} />
            <Route path="/estadoequipo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><Crudestadoequipo /></AdminRoute>} />
            <Route path="/historial-equipo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><HistorialEstadoEquipo /></AdminRoute>} />
            <Route path="/gestion-equipo" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><GestionEstadoEquipo /></AdminRoute>} />
            <Route path="/control-reactivos" element={<AdminRoute isAuth={isAuth} rol={userRol} userData={userData}><ControlReactivos /></AdminRoute>} />
            <Route path="/cuentadante" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><Crudcuentadantes /></SoloAdminRoute>} />

            {/* DEFAULT */}
            <Route path="*" element={<Navigate to={isAuth ? "/home" : "/UserLogin"} replace />} />

          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;