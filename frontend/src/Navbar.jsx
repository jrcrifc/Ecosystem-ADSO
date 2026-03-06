import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const parseToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch { return null; }
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.nav-user-menu')) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('tokenUpdated'));
    navigate('/login');
  };

  const navLinks = [
    { to: '/reactivos', label: 'Reactivos' },
    { to: '/movimientoreactivo', label: 'Movimientos' },
    { to: '/salidas', label: 'Salidas' },
    { to: '/solicitud', label: 'Préstamos' },
    { to: '/equipos', label: 'Equipos' },
    { to: '/proveedor', label: 'Proveedores' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        .eco-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
          background: ${scrolled ? 'rgba(6,13,10,0.95)' : '#060d0a'};
          border-bottom: 1px solid ${scrolled ? 'rgba(0,200,100,0.15)' : 'rgba(0,200,100,0.08)'};
          backdrop-filter: blur(20px);
        }

        .eco-nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .eco-nav-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #00c864, #00ff8a);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 13px;
          color: #060d0a;
          box-shadow: 0 4px 12px rgba(0,200,100,0.35);
          flex-shrink: 0;
        }
        .eco-nav-brand-text .name {
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 15px;
          color: #fff; letter-spacing: 0.5px;
          display: block; line-height: 1;
        }
        .eco-nav-brand-text .sub {
          font-size: 10px;
          color: rgba(0,200,100,0.6);
          letter-spacing: 0.5px;
        }

        .eco-nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }

        .eco-nav-links a {
          padding: 7px 13px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .eco-nav-links a:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .eco-nav-links a.active {
          color: #00c864;
          background: rgba(0,200,100,0.1);
          font-weight: 600;
        }

        .eco-nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .eco-nav-home {
          padding: 7px 13px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: all 0.2s;
        }
        .eco-nav-home:hover { color: #fff; background: rgba(255,255,255,0.06); }
        .eco-nav-home.active { color: #00c864; background: rgba(0,200,100,0.1); font-weight: 600; }

        .nav-login-btn {
          padding: 8px 18px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          border: 1.5px solid rgba(0,200,100,0.3);
          background: transparent;
          color: #00c864;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-login-btn:hover {
          background: rgba(0,200,100,0.1);
          border-color: #00c864;
          color: #00c864;
        }

        .nav-register-btn {
          padding: 8px 18px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          border: none;
          background: linear-gradient(135deg, #00c864, #00ff8a);
          color: #060d0a;
          text-decoration: none;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 3px 10px rgba(0,200,100,0.3);
        }
        .nav-register-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 16px rgba(0,200,100,0.4);
          color: #060d0a;
        }

        .nav-user-menu {
          position: relative;
        }
        .nav-user-btn {
          display: flex;
          align-items: center;
          gap: 9px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 7px 12px;
          cursor: pointer;
          transition: all 0.2s;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-user-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(0,200,100,0.3);
        }
        .nav-avatar {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #00c864, #00ff8a);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 12px;
          color: #060d0a;
          flex-shrink: 0;
        }
        .nav-user-email {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nav-chevron {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          transition: transform 0.2s;
        }
        .nav-chevron.open { transform: rotate(180deg); }

        .nav-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 180px;
          background: #0a1a0e;
          border: 1px solid rgba(0,200,100,0.15);
          border-radius: 12px;
          padding: 6px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.5);
          animation: dropDown 0.15s ease;
        }
        @keyframes dropDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .nav-dropdown a, .nav-dropdown button {
          display: block;
          width: 100%;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          box-sizing: border-box;
        }
        .nav-dropdown a:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .nav-dropdown .logout-btn { color: rgba(239,68,68,0.7); }
        .nav-dropdown .logout-btn:hover { background: rgba(239,68,68,0.1); color: #ef4444; }
        .nav-dropdown hr { border-color: rgba(255,255,255,0.06); margin: 4px 0; }

        /* Mobile */
        @media (max-width: 768px) {
          .eco-nav-links { display: none; }
          .nav-user-email { display: none; }
        }
      `}</style>

      <nav className="eco-nav">
        {/* BRAND */}
        <Link to="/home" className="eco-nav-brand">
          <div className="eco-nav-icon">ES</div>
          <div className="eco-nav-brand-text">
            <span className="name">ECOSYSTEM</span>
            <span className="sub">Laboratorio Ambiental</span>
          </div>
        </Link>

        {/* CENTER LINKS */}
        <ul className="eco-nav-links">
          <li>
            <NavLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>
              Inicio
            </NavLink>
          </li>
          {user && navLinks.map(link => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* RIGHT */}
        <div className="eco-nav-right">
          {user ? (
            <div className="nav-user-menu">
              <button className="nav-user-btn" onClick={() => setOpen(!open)}>
                <div className="nav-avatar">
                  {user.userEmail.charAt(0).toUpperCase()}
                </div>
                <span className="nav-user-email">{user.userEmail}</span>
                <span className={`nav-chevron ${open ? 'open' : ''}`}>▼</span>
              </button>
              {open && (
                <div className="nav-dropdown">
                  <Link to="/perfil" onClick={() => setOpen(false)}>👤 Mi Perfil</Link>
                  <Link to="/configuracion" onClick={() => setOpen(false)}>⚙️ Configuración</Link>
                  <hr />
                  <button className="logout-btn" onClick={logout}>🚪 Cerrar sesión</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink to="/login" className="nav-login-btn">Iniciar sesión</NavLink>
              <NavLink to="/register" className="nav-register-btn">Registrarse</NavLink>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;