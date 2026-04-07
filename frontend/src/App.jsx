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

const PrivateRoute = ({ isAuth, children }) =>
  isAuth ? children : <Navigate to="/UserLogin" replace />;

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
      if (user?.token || user) {
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

  if (isLoading)
    return <div className="text-center mt-5">Cargando...</div>;

  return (
    <>
      {isAuth && <Navbar isAuth={isAuth} logOut={logOut} users={userData} />}

      <div style={{ padding: "20px" }}>
        <Routes>
          <Route
            path="/UserLogin"
            element={
              isAuth ? (
                <Navigate to="/home" replace />
              ) : (
                <UserLogin setIsAuth={setIsAuth} setUserData={setUserData} />
              )
            }
          />

          <Route
            path="/register"
            element={isAuth ? <Navigate to="/home" replace /> : <Register />}
          />

          <Route
            path="/home"
            element={
              <PrivateRoute isAuth={isAuth}>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/reactivos"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudReactivos />
              </PrivateRoute>
            }
          />

          <Route
            path="/estadoSolicitud"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudmovimientoReactivo />
              </PrivateRoute>
            }
          />

          <Route
            path="/equipos"
            element={
              <PrivateRoute isAuth={isAuth}>
                <CrudEquipo />
              </PrivateRoute>
            }
          />

          <Route
            path="/proveedor"
            element={
              <PrivateRoute isAuth={isAuth}>
                <Crudproveedor />
              </PrivateRoute>
            }
          />

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