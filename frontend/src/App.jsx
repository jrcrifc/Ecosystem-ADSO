import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";

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
// ✅ Solo usuarios logueados
const PrivateRoute = ({ isAuth, children }) =>
  isAuth ? children : <Navigate to="/UserLogin" replace />;

// ✅ Solo roles distintos a Aprendiz
const AdminRoute = ({ isAuth, rol, children }) => {
  if (!isAuth) return <Navigate to="/UserLogin" replace />;
  if (rol === "Aprendiz") return <Navigate to="/home" replace />;
  return children;
};

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      setIsAuth(false);
      setIsLoading(false);
      return;
    }
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        setIsAuth(true);
        setUserData(user);
      } else {
        setIsAuth(false);
      }
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

  const userRol = userData?.user?.rol || userData?.rol;

  if (isLoading) return <div className="text-center mt-5">Cargando...</div>;

  return (
    <>
      {isAuth && <Navbar isAuth={isAuth} logOut={logOut} users={userData} rol={userRol} />}

      <div style={{ padding: "20px" }}>
        <Routes>

          {/* LOGIN */}
          <Route path="/UserLogin" element={isAuth ? <Navigate to="/home" replace /> : <UserLogin setIsAuth={setIsAuth} setUserData={setUserData} />} />

          {/* REGISTER */}
          <Route path="/register" element={isAuth ? <Navigate to="/home" replace /> : <Register />} />

          {/* HOME — todos */}
          <Route path="/home" element={<PrivateRoute isAuth={isAuth}><Home /></PrivateRoute>} />

          {/* SOLICITUD — todos los logueados */}
          <Route path="/solicitud" element={<PrivateRoute isAuth={isAuth}><Crudsolicitud /></PrivateRoute>} />
          <Route path="/estadoxsolicitud" element={<PrivateRoute isAuth={isAuth}><CrudEstadoxSolicitud /></PrivateRoute>} />

          {/* ========= SOLO ADMIN ========= */}
          <Route path="/cuentadante" element={<AdminRoute isAuth={isAuth} rol={userRol}><Crudcuentadantes /></AdminRoute>} />
          <Route path="/reactivos" element={<AdminRoute isAuth={isAuth} rol={userRol}><CrudReactivos /></AdminRoute>} />
          <Route path="/movimientoreactivo" element={<AdminRoute isAuth={isAuth} rol={userRol}><CrudmovimientoReactivo /></AdminRoute>} />
          <Route path="/proveedor" element={<AdminRoute isAuth={isAuth} rol={userRol}><Crudproveedor /></AdminRoute>} />
          <Route path="/equipos" element={<AdminRoute isAuth={isAuth} rol={userRol}><CrudEquipo /></AdminRoute>} />
          <Route path="/salidas" element={<AdminRoute isAuth={isAuth} rol={userRol}><Crudsalidas /></AdminRoute>} />
          <Route path="/estadoequipo" element={<AdminRoute isAuth={isAuth} rol={userRol}><Crudestadoequipo /></AdminRoute>} />
          <Route path="/estadoSolicitud" element={<AdminRoute isAuth={isAuth} rol={userRol}><Crudestadosolicitud /></AdminRoute>} />
          <Route path="/gestion-solicitudes"element={<AdminRoute isAuth={isAuth} rol={userRol}><GestionSolicitudes /></AdminRoute>}/>
          <Route path="/solicitudxequipo" element={<AdminRoute isAuth={isAuth} rol={userRol}><CrudSolicitudxEquipo /></AdminRoute>} />
          <Route path="/historial-equipo" element={<AdminRoute isAuth={isAuth} rol={userRol}><HistorialEstadoEquipo /></AdminRoute>} />
          <Route path="/gestion-equipo" element={<AdminRoute isAuth={isAuth} rol={userRol}><GestionEstadoEquipo /></AdminRoute>} />
          <Route path="/control-reactivos" element={<AdminRoute isAuth={isAuth} rol={userRol}><ControlReactivos /></AdminRoute>} />
          {/* DEFAULT */}
          <Route path="*" element={<Navigate to={isAuth ? "/home" : "/UserLogin"} replace />} />

        </Routes>
      </div>
    </>
  );
}

export default App;