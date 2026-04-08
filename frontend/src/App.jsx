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
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ===============================
  // ✅ VALIDAR SESIÓN AL RECARGAR
  // ===============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      setIsAuth(false);
      setIsLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
      setIsAuth(true);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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
      <Navbar isAuth={isAuth} logOut={logOut} user={user} />

      <div style={{ padding: "20px" }}>
        <Routes>
          {/* ================= ROOT ================= */}
          <Route
            path="/"
            element={<Navigate to={isAuth ? "/home" : "/UserLogin"} replace />}
          />

          {/* ================= LOGIN ================= */}
          <Route
            path="/UserLogin"
            element={
              isAuth ? <Navigate to="/home" replace /> : <UserLogin setIsAuth={setIsAuth} setUser={setUser} />
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
              <PrivateRoute isAuth={isAuth} user={user}>
                <Home user={user} />
              </PrivateRoute>
            }
          />

          {/* ================= REACTIVOS ================= */}
          <Route
            path="/reactivos"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudReactivos user={user} />
              </PrivateRoute>
            }
          />

          {/* ================= MOVIMIENTOS ================= */}
          <Route
            path="/estadoSolicitud"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudmovimientoReactivo user={user} />
              </PrivateRoute>
            }
          />

          {/* ================= EQUIPOS ================= */}
          <Route
            path="/equipos"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudEquipo user={user} />
              </PrivateRoute>
            }
          />

          {/* ================= PROVEEDORES ================= */}
          <Route
            path="/proveedor"
            element={
              <PrivateRoute isAuth={isAuth}>
                {user?.rol_usuario === 'instructor' ? (
                  <Crudproveedor user={user} />
                ) : (
                  <Navigate to="/home" replace />
                )}
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