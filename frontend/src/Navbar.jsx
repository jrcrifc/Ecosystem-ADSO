import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isAuth, logOut, users }) => {
  const navigate = useNavigate();

  // --- DEPURACIÓN ---
  useEffect(() => {
    if (isAuth) {
      console.log("Revisando prop 'users' en consola:", users);
    }
  }, [users, isAuth]);

  // --- EXTRACCIÓN DE TU BASE DE DATOS ---
  // Buscamos dentro de 'users', 'users.user' o 'users.data' según cómo responda tu API
  const userData = Array.isArray(users) ? users[0] : (users?.user || users?.data || users);

  // Mapeo exacto a las columnas de tu tabla SQL
  const userName = userData?.nombres_apellidos;
  const userEmail = userData?.email;
  const userRol = userData?.rol;

  const handleClick = (path) => {
    if (!isAuth) {
      navigate("/UserLogin");
      return;
    }
    navigate(path);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm py-3">
      <div className="container-fluid">
        {/* LOGO */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-white text-success fw-bold rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 45, height: 45 }}
          >
            ES
          </div>
          <div className="text-white">
            <h5 className="m-0 fw-semibold">ECOSYSTEM</h5>
            <small className="opacity-75">Laboratorio Ambiental</small>
          </div>
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Si usas un componente estilizado aquí que reciba 'center', 
              asegúrate de llamarlo como $center={true} */}
          <ul className="navbar-nav ms-auto gap-2 align-items-center">
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/home")}>Inicio</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/movimientoreactivo")}>Movimientos Reactivos</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/reactivos")}>Reactivos</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/estadoSolicitud")}>Estado de Solicitudes</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/proveedor")}>Proveedores</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/estadoxsolicitud")}>Reporte de los estados de las solcitudes</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/estadoxequipo")}>Reporte de los estados de los equipos</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/solicitud")}>Solicitudes de prestamo de equipos</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/equipos")}>equipos</span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/cuentadante")}>cuentadantes</span>
            </li>
            {isAuth ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div 
                    className="rounded-circle bg-success d-flex align-items-center justify-content-center text-white fw-bold" 
                    style={{ width: "35px", height: "35px" }}
                  >
                    {userName ? userName.charAt(0).toUpperCase() : "?"}
                  </div>
                </a>

                <ul 
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0" 
                  style={{ minWidth: "250px", borderRadius: "12px", overflow: "hidden" }}
                >
                  <li className="p-4 bg-light border-bottom text-center">
                    <div>
                      {/* SOLO DATOS DE LA DB */}
                      {userName && <h6 className="m-0 fw-bold text-dark text-capitalize">{userName}</h6>}
                      {userEmail && <p className="text-muted mb-1 small">{userEmail}</p>}
                      {userRol && (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3">
                          {userRol}
                        </span>
                      )}
                    </div>
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