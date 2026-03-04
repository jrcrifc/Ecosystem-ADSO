import { Link, NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm py-3">
      <div className="container-fluid">

        {/* LOGO + TITULO */}
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-white text-success fw-bold rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 45, height: 45 }}
          >
            ES
          </div>
          <div className="text-white">
            <h5 className="m-0 fw-semibold">SYSTEM</h5>
            <small className="opacity-75">Laboratorio Ambiental</small>
          </div>
        </div>

        {/* BOTON RESPONSIVE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* LINKS */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2">

            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                Inicio 
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/reactivos">
                inventario de reactivos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/estadoSolicitud">
                Estado de Solicitudes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/equipos">
               Solicitud de Equipos
              </NavLink>
            </li>            

            <li className="nav-item">
              <NavLink className="nav-link" to="/proveedor">
                Proveedores
              </NavLink>
            </li>

            {/* ===== MENU USUARIO ===== 
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 35, height: 35, fontSize: 14 }}
                >
                  CI
                </div>
                Usuario
              </a>

              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li>
                  <Link className="dropdown-item" to="/perfil">
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/configuracion">
                    Configuración
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item text-danger" to="/login">
                    Cerrar Sesión
                  </Link>
                </li>
              </ul>
            </li>
*/}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
