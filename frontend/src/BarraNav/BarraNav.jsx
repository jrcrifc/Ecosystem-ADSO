import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './BarraNav.css';

export default function BarraNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // background class depends on login state
  const navBgClass = user ? 'bg-dark' : 'bg-transparent';
  // reorder scrolled class later when rendering

  // Añadir clase cuando el usuario haga scroll para mayor profundidad/efecto
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  // Decodifica el token (seguro para tokens JWT) y extrae userEmail
  const parseToken = (token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (err) {
      return null
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return setUser(null)
    const payload = parseToken(token)
    if (!payload) {
      localStorage.removeItem('token')
      return setUser(null)
    }
    setUser({
      userEmail: payload.userEmail || payload.email,
      userId: payload.userId,
      userType: payload.userType || payload.tipo_usuario || null,
      admin: payload.admin || false
    })
  }, [location])

  // Escuchar cambios en el token (login/logout desde otros componentes)
  useEffect(() => {
    const handleTokenUpdate = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        return
      }
      const payload = parseToken(token)
      if (!payload) {
        localStorage.removeItem('token')
        setUser(null)
        return
      }
      setUser({
        userEmail: payload.userEmail || payload.email,
        userId: payload.userId,
        userType: payload.userType || payload.tipo_usuario || null,
        admin: payload.admin || false
      })
    }

    window.addEventListener('tokenUpdated', handleTokenUpdate)
    return () => window.removeEventListener('tokenUpdated', handleTokenUpdate)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    // Disparar evento personalizado para que otros componentes se actualicen
    window.dispatchEvent(new Event('tokenUpdated'))
    navigate('/login')
  }

  return (
    <nav className={`barra-navbar navbar navbar-expand-lg navbar-dark ${navBgClass} ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/" onClick={closeMenu}>
          <img src="/ecosistem.jpeg" alt="Ecosystem Logo" />
          Ecosystem
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleMenu}
          aria-controls="navMenu"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navMenu">
          {/* when no user, center the two buttons and apply width 100% */}
          <ul className={`navbar-nav ${!user ? 'justify-content-center w-100' : 'ms-auto'}`}>
            {user && <li className="nav-item"><Link className="nav-link" to="/" onClick={closeMenu}>Inicio</Link></li>}

            {/* Mostrar enlaces de 'Estados' sólo si el usuario está autenticado */}
            {user && <li className="nav-item"><Link className="nav-link" to="/estadosolicitud" onClick={closeMenu}>Estados Solicitud</Link></li>}
            {user && <li className="nav-item"><Link className="nav-link" to="/estadoequipo" onClick={closeMenu}>Estados Equipo</Link></li>}

            {/* Login sólo si NO hay usuario; Registrarse siempre visible */}
            {!user && (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-primary" to="/login" onClick={closeMenu}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/register" onClick={closeMenu}>Registrarse</Link>
                </li>
              </>
            )}

            {/* Mostrar nombre a la derecha junto a 'Registrarse' si hay usuario (con dropdown) */}
            {user && (
              <li className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle border-0 bg-transparent" 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  style={{cursor: 'pointer'}}
                >
                  {user.userEmail}
                </button>
                {isUserMenuOpen && (
                  <ul className="dropdown-menu dropdown-menu-end show position-absolute" style={{display: 'block', right: 0}}>
                    <li><Link className="dropdown-item" to="/profile" onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}>Perfil</Link></li>
                    <li><Link className="dropdown-item" to="/settings" onClick={() => { setIsUserMenuOpen(false); closeMenu(); }}>Ajustes</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item border-0 bg-transparent w-100 text-start" onClick={() => { setIsUserMenuOpen(false); closeMenu(); logout(); }}>Cerrar sesión</button></li>
                  </ul>
                )}
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
