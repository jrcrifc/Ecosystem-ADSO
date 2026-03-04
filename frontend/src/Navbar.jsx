import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const parseToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setUser(null);
    const payload = parseToken(token);
    if (!payload) return setUser(null);
    setUser({ userEmail: payload.userEmail || payload.email });
  }, []);

  useEffect(() => {
    const handle = () => {
      const token = localStorage.getItem('token');
      if (!token) return setUser(null);
      const payload = parseToken(token);
      setUser(payload ? { userEmail: payload.userEmail || payload.email } : null);
    };
    window.addEventListener('tokenUpdated', handle);
    return () => window.removeEventListener('tokenUpdated', handle);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('tokenUpdated'));
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-success navbar-dark shadow-sm py-3">
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
              <NavLink className="nav-link text-white" activeClassName="fw-bold" to="/home">
                Inicio 
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" activeClassName="fw-bold" to="/reactivos">
                inventario de reactivos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-white" activeClassName="fw-bold" to="/estadoSolicitud">
                Estado de Solicitudes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link text-white" activeClassName="fw-bold" to="/equipos">
               Solicitud de Equipos
              </NavLink>
            </li>            

            <li className="nav-item">
              <NavLink className="nav-link text-white" activeClassName="fw-bold" to="/proveedor">
                Proveedores
              </NavLink>
            </li>

            {/* User menu or login/register */}
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle border-0 bg-transparent text-white d-flex align-items-center gap-2"
                  id="userDropdown"
                  onClick={() => setOpen(!open)}
                  style={{ cursor: 'pointer' }}
                >
                  <div
                    className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 35, height: 35, fontSize: 14 }}
                  >
                    {user.userEmail.charAt(0)?.toUpperCase()}
                  </div>
                  {user.userEmail}
                </button>
                {open && (
                  <ul className="dropdown-menu dropdown-menu-end shadow show position-absolute" style={{ display: 'block', right: 0 }}>
                    <li>
                      <Link className="dropdown-item" to="/perfil" onClick={() => setOpen(false)}>
                        Mi Perfil
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/configuracion" onClick={() => setOpen(false)}>
                        Configuración
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        Cerrar sesión
                      </button>
                    </li>
                  </ul>
                )}
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
