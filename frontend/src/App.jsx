// App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import CrudReactivos from "./reactivos/crudreactivos.jsx";
import CrudmovimientoReactivo from "./movimientosReactivos/crudmovimientoreactivo.jsx";
import Crudproveedor from "./proveedores/Crudproveedor.jsx";
import CrudEquipo from "./equipos/crudequipos.jsx";
import Home from "./Home/home.jsx";
import UserLogin from "./Home/userLogin.jsx";
import Register from "./Home/Register.jsx";

// ===============================
// ✅ RUTAS PRIVADAS
// ===============================
const PrivateRoute = ({ isAuth, children }) =>
  isAuth ? children : <Navigate to="/UserLogin" replace />;

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ===============================
  // ✅ VALIDAR SESIÓN AL RECARGAR
  // ===============================
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      setIsAuth(false);
      setIsLoading(false);
      return;
    }

    try {
      const user = JSON.parse(stored);
      setIsAuth(!!user?.token);
    } catch {
      localStorage.removeItem("user");
      setIsAuth(false);
    }

    setIsLoading(false);
  }, []);

  // ===============================
  // ✅ LOGOUT
  // ===============================
  const logOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  if (isLoading)
    return <div className="text-center mt-5">Cargando...</div>;

  return (
    <>
      {isAuth && <Navbar isAuth={isAuth} logOut={logOut} />}

      <div style={{ padding: "20px" }}>
        <Routes>
          {/* ================= LOGIN ================= */}
          <Route
            path="/UserLogin"
            element={
              isAuth ? <Navigate to="/home" replace /> : <UserLogin setIsAuth={setIsAuth} />
            }
          />

          {/* ================= REGISTER ================= */}
          <Route
            path="/register"
            element={isAuth ? <Navigate to="/home" replace /> : <Register />}
          />

          {/* ================= HOME ================= */}
          <Route
            path="/home"
            element={
              <PrivateRoute isAuth={isAuth}>
                <Home />
              </PrivateRoute>
            }
          />

          {/* ================= REACTIVOS ================= */}
          <Route
            path="/reactivos"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudReactivos />
              </PrivateRoute>
            }
          />

          {/* ================= MOVIMIENTOS ================= */}
          <Route
            path="/estadoSolicitud"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudmovimientoReactivo />
              </PrivateRoute>
            }
          />

          {/* ================= EQUIPOS ================= */}
          <Route
            path="/equipos"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudEquipo />
              </PrivateRoute>
            }
          />

          {/* ================= PROVEEDORES ================= */}
          <Route
            path="/proveedor"
            element={
              <PrivateRoute isAuth={isAuth}>
                <Crudproveedor />
              </PrivateRoute>
            }
          />

          {/* ================= DEFAULT ================= */}
          <Route
            path="*"
            element={<Navigate to={isAuth ? "/home" : "/UserLogin"} replace />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;