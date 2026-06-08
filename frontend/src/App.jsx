// Importa React y los hooks useState y useEffect para manejo de estado y efectos
import React, { useState, useEffect } from "react";
// Importa Routes, Route y Navigate de React Router para definir rutas y redirecciones
import { Routes, Route, Navigate } from "react-router-dom";
// Importa el componente Sidebar de navegación lateral
import Sidebar from "./Sidebar";
// Importa la instancia de Axios configurada para peticiones HTTP
import apiAxios from "./api/axiosConfig.js";
// Importa el socket para comunicación en tiempo real con el servidor
import socket from "./socket.js";
// Importa SweetAlert2 para mostrar alertas estilizadas al usuario
import Swal from "sweetalert2";

// Importa los componentes de cada módulo del sistema
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

// Define el componente FormularioRoute que protege rutas para usuarios en revisión
const FormularioRoute = ({ isAuth, userData, userRol, logOut, children }) => {
  // Redirige al login si el usuario no está autenticado
  if (!isAuth) return <Navigate to="/UserLogin" replace />;

  // Obtiene el estado de aprobación del usuario
  const estado = userData?.estado || userData?.user?.estado;
  // Lista de roles que requieren aprobación del administrador
  const rolesRevision = ['Aprendiz', 'Instructor', 'Pasante', 'Gestor'];

  // Si el usuario está rechazado o inactivo, no renderiza nada
  if (estado === 'inactivo' || estado === 'rechazado') {
    return null;
  }

  // Si el rol requiere aprobación y no está aprobado, muestra pantalla de espera
  if (rolesRevision.includes(userRol) && estado !== 'aprobado') {
    return (
      <div style={{
        minHeight: "100vh", background: "#f0f9ff",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
      }}>
        {/* Tarjeta blanca con mensaje de cuenta en revisión */}
        <div style={{
          background: "#fff", borderRadius: "20px", padding: "48px 40px",
          maxWidth: "480px", width: "100%", textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)", border: "1px solid #e0f2fe"
        }}>
          {/* Ícono de reloj de arena indicando espera */}
          <div style={{ fontSize: "56px", marginBottom: "20px" }}>⏳</div>
          {/* Título del mensaje de revisión */}
          <h2 style={{ fontWeight: "700", color: "#0A1628", marginBottom: "10px" }}>Cuenta en revisión</h2>
          {/* Texto explicativo con el rol del usuario */}
          <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.7", marginBottom: "24px" }}>
            Tu cuenta como <strong>{userRol}</strong> está siendo revisada por el administrador.
            Recibirás una notificación cuando sea aprobada.
          </p>
          {/* Banner amarillo indicando que revise las notificaciones */}
          <div style={{
            background: "#fff8e1", border: "1px solid #ffe082",
            borderRadius: "10px", padding: "14px 18px", marginBottom: "24px"
          }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#7c5e00" }}>
              🔔 Revisa la campanita de notificaciones para saber cuando el admin te apruebe.
            </p>
          </div>
          {/* Botón para cerrar sesión y regresar al login */}
          <button onClick={logOut} style={{
            background: "transparent", border: "1px solid #e5e7eb",
            borderRadius: "10px", padding: "10px 28px",
            color: "#64748b", cursor: "pointer", fontSize: "13px"
          }}>Cerrar sesión</button>
        </div>
      </div>
    );
  }

  // Renderiza el contenido hijo si pasó todas las verificaciones
  return children;
};

// Define el componente SoloAdminRoute que solo permite acceso a administradores
const SoloAdminRoute = ({ isAuth, rol, children }) => {
  // Redirige al login si no está autenticado
  if (!isAuth) return <Navigate to="/UserLogin" replace />;
  // Redirige al home si no es administrador
  if (rol !== 'Administrador') return <Navigate to="/home" replace />;
  // Renderiza el contenido protegido si es admin
  return children;
};

// Define el componente AdminRoute para admin, pasantes y gestores aprobados
const AdminRoute = ({ isAuth, rol, userData, children }) => {
  // Redirige al login si no está autenticado
  if (!isAuth) return <Navigate to="/UserLogin" replace />;
  // Bloquea el acceso a aprendices e instructores
  if (['Aprendiz', 'Instructor'].includes(rol)) return <Navigate to="/home" replace />;
  // Obtiene el estado de aprobación del usuario
  const estado = userData?.estado || userData?.user?.estado;
  // Si es pasante o gestor no aprobado, redirige al home
  if (['Pasante', 'Gestor'].includes(rol) && estado !== 'aprobado') {
    return <Navigate to="/home" replace />;
  }
  // Renderiza el contenido si pasó las verificaciones
  return children;
};

// Define el componente SolicitanteRoute para roles que pueden crear solicitudes
const SolicitanteRoute = ({ isAuth, rol, children }) => {
  // Redirige al login si no está autenticado
  if (!isAuth) return <Navigate to="/UserLogin" replace />;
  // Lista de roles autorizados para crear solicitudes
  const rolesPermitidos = ['Aprendiz', 'Instructor', 'Administrador'];
  // Redirige al home si el rol no está en la lista permitida
  if (!rolesPermitidos.includes(rol)) return <Navigate to="/home" replace />;
  // Renderiza el contenido si tiene permiso
  return children;
};

// Define el componente principal App que gestiona autenticación, layout y rutas
function App() {
  // Estado que indica si el usuario está autenticado
  const [isAuth, setIsAuth] = useState(false);
  // Estado que indica si la verificación de sesión está en curso
  const [isLoading, setIsLoading] = useState(true);
  // Estado que almacena los datos del usuario autenticado
  const [userData, setUserData] = useState(null);

  // Efecto para escuchar eventos de cierre de sesión forzado vía Socket.io
  useEffect(() => {
    // No hace nada si el usuario no está autenticado o no tiene datos
    if (!isAuth || !userData) return;

    // Obtiene el ID del usuario para unirse a su sala de Socket.io
    const id = userData?.id_usuario || userData?.user?.id_usuario;
    // Sale si no hay ID disponible
    if (!id) return;

    // Si el socket ya está conectado, se une a la sala del usuario
    if (socket.connected) {
      socket.emit("join", id);
    }

    // Handler que se une a la sala al reconectar el socket
    const handleConnect = () => socket.emit("join", id);
    // Registra el handler en el evento connect del socket
    socket.on("connect", handleConnect);

    // Handler para cuando el administrador fuerza el cierre de sesión
    const handleForceLogout = (data) => {
      // Ejecuta la función de cierre de sesión
      logOut();
      // Muestra una alerta de acceso revocado con SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Acceso Revocado",
        text: data.mensaje || "Has sido desconectado por el administrador.",
        confirmButtonColor: "#d33",
        allowOutsideClick: false
      });
    };

    // Registra el handler para el evento force_logout
    socket.on("force_logout", handleForceLogout);

    // Limpieza: elimina los listeners al desmontar el componente
    return () => {
      socket.off("connect", handleConnect);
      socket.off("force_logout", handleForceLogout);
    };
  }, [isAuth, userData]);

  // Función que cierra la sesión del usuario y limpia los datos
  const logOut = () => {
    // Elimina los datos del usuario del sessionStorage
    sessionStorage.removeItem("user");
    // Elimina el token JWT del sessionStorage
    sessionStorage.removeItem("token");
    // Marca la autenticación como falsa
    setIsAuth(false);
    // Limpia los datos del usuario del estado
    setUserData(null);
  };

  // Función que recarga los datos del usuario desde el servidor
  const recargarUsuario = async (id, token, userActual) => {
    try {
      // Obtiene datos guardados en sessionStorage como respaldo
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      // Determina el usuario final priorizando los parámetros recibidos
      const finalUser = userActual || (storedUser ? JSON.parse(storedUser) : null);
      const finalId = id || finalUser?.id_usuario || finalUser?.user?.id_usuario;
      const finalToken = token || storedToken;

      // Sale si no hay ID o token para hacer la petición
      if (!finalId || !finalToken) return;

      // Hace una petición GET al backend para obtener los datos actualizados del usuario
      const res = await apiAxios.get(`/api/auth/usuarios/${finalId}`, {
        headers: { Authorization: `Bearer ${finalToken}` }
      });

      // Combina los datos actuales con los nuevos del servidor
      const userActualizado = { ...userActual, ...res.data };
      // Guarda los datos actualizados en sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userActualizado));
      // Actualiza el estado con los nuevos datos
      setUserData(userActualizado);

      // Si el usuario fue rechazado o inactivado, cierra la sesión forzadamente
      if (res.data.estado === 'rechazado' || res.data.estado === 'inactivo') {
        // Ejecuta el cierre de sesión
        logOut();
        // Muestra alerta explicando el motivo
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
    } catch { /* Silencia errores para mantener los datos actuales */ }
  };

  // Efecto que verifica la sesión al cargar la aplicación
  useEffect(() => {
    // Lee los datos del usuario desde sessionStorage
    const stored = sessionStorage.getItem("user");
    // Si no hay datos guardados, el usuario no está autenticado
    if (!stored) { setIsAuth(false); setIsLoading(false); return; }
    try {
      // Parsea los datos JSON del usuario
      const user = JSON.parse(stored);
      // Si tiene token, restaura la sesión
      if (user?.token) {
        // Marca como autenticado y carga los datos del usuario
        setIsAuth(true);
        setUserData(user);
        // Obtiene el ID del usuario para recargar datos actualizados
        const id = user?.id_usuario || user?.user?.id_usuario;
        // Recarga los datos del servidor y finaliza la carga
        recargarUsuario(id, user.token, user).finally(() => setIsLoading(false));
      } else {
        // Sin token, no está autenticado
        setIsAuth(false);
        setIsLoading(false);
      }
    } catch {
      // Si hay error al parsear, limpia sessionStorage
      sessionStorage.removeItem("user");
      setIsAuth(false);
      setIsLoading(false);
    }
  }, []);

  // Obtiene el rol del usuario desde los datos o desde el objeto anidado
  const userRol = userData?.rol || userData?.user?.rol;

  // Muestra pantalla de carga mientras se verifica la sesión
  if (isLoading) return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "#f0f9ff"
    }}>
      {/* Spinner animado de Bootstrap con color primario */}
      <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      {/* Texto informativo debajo del spinner */}
      <p style={{ marginTop: "16px", color: "#0077B6", fontWeight: "600", fontSize: "14px" }}>
        Iniciando Ecosystem...
      </p>
    </div>
  );

  // Renderizado principal con layout sidebar + contenido
  return (
    <div className="sidebar-layout">
      {/* Renderiza el sidebar solo si el usuario está autenticado */}
      {isAuth && (
        <Sidebar
          isAuth={isAuth}
          logOut={logOut}
          users={userData}
          rol={userRol}
          onAprobado={recargarUsuario}
        />
      )}
      {/* Área principal de contenido */}
      <main className="sidebar-main-content" style={!isAuth ? { marginLeft: 0 } : {}}>
        {/* Renderiza la TopBar solo si el usuario está autenticado */}
        {isAuth && (
          <TopBar
            userData={userData}
            userRol={userRol}
            logOut={logOut}
            onAprobado={recargarUsuario}
          />
        )}
        {/* Contenedor del contenido con ancho máximo centrado */}
        <div style={{ padding: "24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
          {/* Define todas las rutas de la aplicación */}
          <Routes>

            {/* Ruta pública de login con redirección si ya está autenticado */}
            <Route path="/UserLogin" element={isAuth ? <Navigate to="/home" replace /> : <UserLogin setIsAuth={setIsAuth} setUserData={setUserData} />} />

            {/* Ruta pública de registro con redirección si ya está autenticado */}
            <Route path="/register" element={isAuth ? <Navigate to="/home" replace /> : <Register />} />

            {/* Ruta pública de recuperación de contraseña */}
            <Route path="/olvidar-password" element={isAuth ? <Navigate to="/home" replace /> : <OlvidarPassword />} />

            {/* Ruta de Acerca de, accesible para todos */}
            <Route path="/acerca-de" element={<AcercaDe />} />

            {/* Ruta protegida del dashboard principal con FormularioRoute */}
            <Route path="/home" element={
              <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                <Home />
              </FormularioRoute>
            } />

            {/* Ruta protegida del perfil del usuario */}
            <Route path="/perfil" element={
              <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                <PerfilUsuario />
              </FormularioRoute>
            } />

            {/* Ruta de solicitudes protegida por SolicitanteRoute y FormularioRoute */}
            <Route path="/solicitud" element={
              <SolicitanteRoute isAuth={isAuth} rol={userRol}>
                <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                  <Crudsolicitud />
                </FormularioRoute>
              </SolicitanteRoute>
            } />

            {/* Ruta protegida de estado por solicitud */}
            <Route path="/estadoxsolicitud" element={
              <FormularioRoute isAuth={isAuth} userData={userData} userRol={userRol} logOut={logOut}>
                <CrudEstadoxSolicitud />
              </FormularioRoute>
            } />

            {/* Rutas exclusivas del administrador */}
            <Route path="/gestion-usuarios" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><GestionUsuarios /></SoloAdminRoute>} />
            <Route path="/auditoria" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><LogActividades /></SoloAdminRoute>} />
            <Route path="/gestion-solicitudes" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><GestionSolicitudes /></SoloAdminRoute>} />
            <Route path="/estadoSolicitud" element={<SoloAdminRoute isAuth={isAuth} rol={userRol}><Crudestadosolicitud /></SoloAdminRoute>} />

            {/* Rutas para admin, pasantes y gestores aprobados */}
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

            {/* Ruta comodín que redirige al home o login según autenticación */}
            <Route path="*" element={<Navigate to={isAuth ? "/home" : "/UserLogin"} replace />} />

          </Routes>
        </div>
      </main>
    </div>
  );
}

// Exporta el componente App para ser renderizado en main.jsx
export default App;