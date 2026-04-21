import React from "react";
import { useNavigate } from "react-router-dom";
import Campanita from "./FormularioAcceso/Campanita.jsx";

const Navbar = ({ isAuth, logOut, users, rol, onAprobado }) => {
  const navigate = useNavigate();

  const userData = Array.isArray(users) ? users[0] : (users?.user || users?.data || users);
  const userName = userData?.nombres_apellidos;
  const userEmail = userData?.email;
  const userRol = rol || userData?.rol;

  const esAdmin = userRol === 'Administrador';
  const esGestorPasante = ['Pasante', 'Gestor'].includes(userRol);
  const esAprendizInstructor = ['Aprendiz', 'Instructor'].includes(userRol);

  const handleClick = (path) => {
    if (!isAuth) { navigate("/UserLogin"); return; }
    navigate(path);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm py-3">
      <div className="container-fluid">

        <div className="d-flex align-items-center gap-3">
          <div className="bg-white text-success fw-bold rounded-circle d-flex align-items-center justify-content-center" style={{ width: 45, height: 45 }}>
            ES
          </div>
          <div className="text-white">
            <h5 className="m-0 fw-semibold">ECOSYSTEM</h5>
            <small className="opacity-75">Laboratorio Ambiental</small>
          </div>
        </div>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2 align-items-center">

            {/* Inicio — todos */}
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/home")}>Inicio</span>
            </li>

            {/* Solicitudes — Aprendiz e Instructor */}
            {(esAdmin || esAprendizInstructor) && (
              <>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/solicitud")}>Solicitudes</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/estadoxsolicitud")}>Historial Solicitudes</span>
                </li>
              </>
            )}

            {/* Módulos — Admin + Pasante + Gestor */}
            {(esAdmin || esGestorPasante) && (
              <>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/equipos")}>Equipos</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/estadoequipo")}>Estado del Equipo</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/solicitudxequipo")}>Solicitud x Equipo</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/historial-equipo")}>Historial Equipos</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/gestion-equipo")}>Gestión Equipos</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/cuentadante")}>Cuentadantes</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/proveedor")}>Proveedores</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/reactivos")}>Reactivos</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/movimientoreactivo")}>Movimientos Reactivos</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/control-reactivos")}>Control Reactivos</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/salidas")}>Salidas Reactivos</span>
                </li>
              </>
            )}

            {/* Solo Administrador */}
            {esAdmin && (
              <>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/estadoSolicitud")}>Estados Solicitud</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/gestion-solicitudes")}>Gestión Solicitudes</span>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/gestion-usuarios")}>👥 Gestión Usuarios</span>
                </li>
              </>
            )}

            {/* Campanita — todos los logueados */}
            {isAuth && (
              <li className="nav-item">
                <Campanita userData={userData} onAprobado={onAprobado} />
              </li>
            )}

            {/* Perfil */}
            {isAuth ? (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#" id="navbarDropdown" role="button"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                    style={{
                      width: "35px", height: "35px",
                      backgroundColor: esAdmin ? "#dc3545" : esGestorPasante ? "#f59e0b" : "#28a745"
                    }}
                  >
                    {userName ? userName.charAt(0).toUpperCase() : "?"}
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0" style={{ minWidth: "250px", borderRadius: "12px", overflow: "hidden" }}>
                  <li className="p-4 bg-light border-bottom text-center">
                    {userName && <h6 className="m-0 fw-bold text-dark text-capitalize">{userName}</h6>}
                    {userEmail && <p className="text-muted mb-1 small">{userEmail}</p>}
                    {userRol && (
                      <span className={`badge px-3 ${esAdmin ? "bg-danger" : esGestorPasante ? "bg-warning text-dark" : "bg-success"}`}>
                        {esAdmin ? `👑 ${userRol}` : esGestorPasante ? `⚙️ ${userRol}` : `🎓 ${userRol}`}
                      </span>
                    )}
                  </li>
                  <li>
                    <button className="dropdown-item py-3 text-center fw-bold text-danger" onClick={logOut}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => navigate("/UserLogin")}>Login</span>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;