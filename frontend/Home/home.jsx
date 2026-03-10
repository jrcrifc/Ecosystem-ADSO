import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const navigate = useNavigate();

  // Detectar si hay token
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
    setUser(payload ? { userEmail: payload.userEmail || payload.email || '' } : null);
  }, []);

  useEffect(() => {
    const handle = () => {
      const token = localStorage.getItem('token');
      if (!token) return setUser(null);
      const payload = parseToken(token);
      setUser(payload ? { userEmail: payload.userEmail || payload.email || '' } : null);
    };
    window.addEventListener('tokenUpdated', handle);
    return () => window.removeEventListener('tokenUpdated', handle);
  }, []);

  // Auto-rotar features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: '🔬', title: 'Inventario de Reactivos', desc: 'Control en tiempo real de entradas y salidas con alertas automáticas de stock.', color: '#00c864', route: '/movimientoreactivo' },
    { icon: '🧪', title: 'Salidas de Reactivos', desc: 'Registra y controla cada salida con trazabilidad completa del laboratorio.', color: '#3b82f6', route: '/salidas' },
    { icon: '⚙️', title: 'Gestión de Equipos', desc: 'Registro fotográfico, estado y control de todos los equipos disponibles.', color: '#f59e0b', route: '/equipos' },
    { icon: '📋', title: 'Solicitud de Préstamos', desc: 'Pide equipos de forma digital con seguimiento del estado de tu solicitud.', color: '#8b5cf6', route: '/solicitud' },
  ];

  const quickLinks = [
    { icon: '⚗️', label: 'Reactivos', route: '/reactivos', bg: 'rgba(0,200,100,0.12)', border: 'rgba(0,200,100,0.25)', color: '#00c864' },
    { icon: '📦', label: 'Movimientos', route: '/movimientoreactivo', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', color: '#3b82f6' },
    { icon: '🚪', label: 'Salidas', route: '/salidas', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b' },
    { icon: '🏷️', label: 'Préstamos', route: '/solicitud', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', color: '#8b5cf6' },
    { icon: '🖥️', label: 'Equipos', route: '/equipos', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', color: '#ec4899' },
    { icon: '🏢', label: 'Proveedores', route: '/proveedor', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.25)', color: '#14b8a6' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');

        .home-root {
          background: #0b1512;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          min-height: 100vh;
        }

        /* ===== HERO ===== */
        .hero {
          min-height: calc(100vh - 64px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 60px 24px;
        }

        .hero-mesh {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 20% 50%, rgba(0,200,100,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 30%, rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 60% 80%, rgba(139,92,246,0.1) 0%, transparent 60%);
        }

        .hero-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 32px 32px;
        }

        .hero-inner {
          position: relative;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 60px;
          align-items: center;
          max-width: 1100px;
          width: 100%;
        }

        .hero-left {}

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,200,100,0.1);
          border: 1px solid rgba(0,200,100,0.3);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          color: #00c864;
          font-weight: 600;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }
        .hero-dot {
          width: 7px; height: 7px;
          background: #00c864;
          border-radius: 50%;
          box-shadow: 0 0 8px #00c864;
          animation: blink 2s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(40px, 5vw, 60px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 16px;
          letter-spacing: -1.5px;
        }
        .hero-title .eco-name {
          background: linear-gradient(135deg, #00ff87, #00c864);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-title .sub-line {
          color: rgba(255,255,255,0.85);
          display: block;
          font-size: 0.75em;
          font-weight: 600;
          letter-spacing: -1px;
        }

        .hero-desc {
          font-size: 16px;
          color: rgba(255,255,255,0.5);
          line-height: 1.75;
          margin-bottom: 36px;
          max-width: 460px;
        }

        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

        .btn-primary-eco {
          padding: 13px 28px;
          background: linear-gradient(135deg, #00c864, #00ff87);
          border: none; border-radius: 12px;
          color: #060d0a;
          font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 15px;
          cursor: pointer; text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 6px 20px rgba(0,200,100,0.4);
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary-eco:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(0,200,100,0.5);
          color: #060d0a;
        }

        .btn-secondary-eco {
          padding: 13px 28px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; font-size: 15px;
          cursor: pointer; text-decoration: none;
          transition: all 0.25s;
          display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-secondary-eco:hover {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-color: rgba(255,255,255,0.2);
        }

        /* ===== FEATURE ROTATOR ===== */
        .hero-right {}

        .feature-rotator {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
        }

        .feature-display {
          padding: 36px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: all 0.4s;
        }

        .feature-display .f-icon {
          font-size: 40px;
          margin-bottom: 16px;
          display: block;
        }
        .feature-display h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }
        .feature-display p {
          color: rgba(255,255,255,0.45);
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .feature-go-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 9px;
          border: none;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          align-self: flex-start;
          font-family: 'DM Sans', sans-serif;
        }

        .feature-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .feature-tab {
          padding: 16px 8px;
          text-align: center;
          cursor: pointer;
          border: none;
          background: transparent;
          color: rgba(255,255,255,0.3);
          font-size: 20px;
          transition: all 0.2s;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }
        .feature-tab:last-child { border-right: none; }
        .feature-tab.active {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
        .feature-tab.active::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
        }

        /* ===== DASHBOARD (LOGGED IN) ===== */
        .dashboard {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .welcome-banner {
          background: linear-gradient(135deg, rgba(0,200,100,0.15) 0%, rgba(0,100,50,0.1) 50%, rgba(0,0,0,0) 100%);
          border: 1px solid rgba(0,200,100,0.2);
          border-radius: 20px;
          padding: 32px 36px;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }
        .welcome-text h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }
        .welcome-text h2 span { color: #00c864; }
        .welcome-text p {
          color: rgba(255,255,255,0.45);
          font-size: 14px; margin: 0;
        }
        .welcome-avatar {
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #00c864, #00ff87);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 24px;
          color: #060d0a;
          box-shadow: 0 8px 24px rgba(0,200,100,0.4);
          flex-shrink: 0;
        }

        .section-title {
          font-family: 'Outfit', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 12px;
          margin-bottom: 16px;
        }

        .quick-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }

        .quick-card {
          border-radius: 16px;
          padding: 24px 20px;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid;
          text-decoration: none;
        }
        .quick-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.3);
        }
        .quick-card-icon {
          font-size: 28px;
          flex-shrink: 0;
        }
        .quick-card-text strong {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
        }
        .quick-card-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
        }
        .quick-card-arrow {
          margin-left: auto;
          font-size: 16px;
          color: rgba(255,255,255,0.2);
          transition: all 0.2s;
        }
        .quick-card:hover .quick-card-arrow {
          transform: translateX(4px);
          color: rgba(255,255,255,0.5);
        }

        /* ===== FEATURES SECTION (both) ===== */
        .features-section {
          padding: 80px 24px;
          background: rgba(255,255,255,0.02);
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .features-section-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .features-header {
          text-align: center;
          margin-bottom: 52px;
        }
        .section-tag {
          display: inline-block;
          font-size: 11px; font-weight: 700;
          color: #00c864;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .features-header h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 36px; font-weight: 800;
          color: #fff; letter-spacing: -1px;
          margin-bottom: 12px;
        }
        .features-header p {
          color: rgba(255,255,255,0.35);
          font-size: 15px; max-width: 420px;
          margin: 0 auto; line-height: 1.7;
        }

        .feat-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }
        .feat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 28px;
          transition: all 0.3s;
          cursor: default;
        }
        .feat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          box-shadow: 0 20px 40px rgba(0,0,0,0.25);
        }
        .feat-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px;
          margin-bottom: 18px;
        }
        .feat-card h5 {
          font-family: 'Outfit', sans-serif;
          font-size: 17px; font-weight: 700;
          color: #fff; margin-bottom: 8px;
        }
        .feat-card p {
          color: rgba(255,255,255,0.38);
          font-size: 13px; line-height: 1.7; margin: 0;
        }

        /* ===== FOOTER ===== */
        .eco-footer {
          padding: 36px 24px;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
        }
        .footer-brand {
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          margin-bottom: 12px;
        }
        .footer-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #00c864, #00ff87);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 12px;
          color: #060d0a;
        }
        .footer-name {
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 14px;
          color: #fff; letter-spacing: 1px;
        }
        .eco-footer p {
          color: rgba(255,255,255,0.2);
          font-size: 13px; margin: 0;
        }

        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; }
          .hero-right { display: none; }
          .quick-grid { grid-template-columns: repeat(2, 1fr); }
          .feat-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .quick-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="home-root">

        {user ? (
          /* ===== VISTA LOGUEADO ===== */
          <>
            <div className="dashboard">
              {/* Banner de bienvenida */}
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h2>¡Bienvenido, <span>{user.userEmail?.split('@')[0] || 'Usuario'}</span>! 👋</h2>
                  <p>¿Qué vas a gestionar hoy? Selecciona un módulo para comenzar.</p>
                </div>
                <div className="welcome-avatar">
                  {user.userEmail?.charAt(0)?.toUpperCase() || '?'}
                </div>
              </div>

              {/* Accesos rápidos */}
              <p className="section-title">⚡ Accesos rápidos</p>
              <div className="quick-grid">
                {quickLinks.map(link => (
                  <a
                    key={link.route}
                    href={link.route}
                    className="quick-card"
                    style={{ background: link.bg, borderColor: link.border }}
                  >
                    <span className="quick-card-icon">{link.icon}</span>
                    <div className="quick-card-text">
                      <strong>{link.label}</strong>
                      <span>Gestionar →</span>
                    </div>
                    <span className="quick-card-arrow" style={{ color: link.color }}>›</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Features info */}
            <section className="features-section">
              <div className="features-section-inner">
                <div className="features-header">
                  <span className="section-tag">Módulos disponibles</span>
                  <h2>Todo en un solo lugar</h2>
                  <p>Cada módulo está diseñado para el flujo real de trabajo del laboratorio.</p>
                </div>
                <div className="feat-grid">
                  {[
                    { icon: '🔬', bg: 'rgba(0,200,100,0.1)', title: 'Inventario de Reactivos', desc: 'Control en tiempo real de entradas y salidas con alertas de stock bajo.' },
                    { icon: '🧪', bg: 'rgba(59,130,246,0.1)', title: 'Salidas de Reactivos', desc: 'Registra y controla cada salida con trazabilidad completa.' },
                    { icon: '⚙️', bg: 'rgba(245,158,11,0.1)', title: 'Gestión de Equipos', desc: 'Registro fotográfico, estado y control de todos los equipos.' },
                    { icon: '📋', bg: 'rgba(139,92,246,0.1)', title: 'Solicitud de Préstamos', desc: 'Solicita equipos con seguimiento del estado en tiempo real.' },
                  ].map((f, i) => (
                    <div className="feat-card" key={i}>
                      <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                      <h5>{f.title}</h5>
                      <p>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ===== VISTA NO LOGUEADO ===== */
          <>
            <section className="hero">
              <div className="hero-mesh"></div>
              <div className="hero-dots"></div>
              <div className="hero-inner">
                <div className="hero-left">
                  <div className="hero-badge">
                    <div className="hero-dot"></div>
                    Sistema activo — SENA Laboratorio Ambiental
                  </div>
                  <h1 className="hero-title">
                    <span className="eco-name">Ecosystem</span>
                    <span className="sub-line">Gestión de laboratorio</span>
                  </h1>
                  <p className="hero-desc">
                    Plataforma digital para el control de reactivos, equipos y solicitudes de préstamo. Todo en un solo lugar, seguro y en tiempo real.
                  </p>
                  <div className="hero-actions">
                    <a href="/login" className="btn-primary-eco">Iniciar sesión →</a>
                    <a href="/register" className="btn-secondary-eco">Crear cuenta</a>
                  </div>
                </div>

                {/* Feature rotator */}
                <div className="hero-right">
                  <div className="feature-rotator">
                    <div className="feature-display" style={{ borderBottom: `2px solid ${features[activeFeature].color}20` }}>
                      <span className="f-icon">{features[activeFeature].icon}</span>
                      <h3>{features[activeFeature].title}</h3>
                      <p>{features[activeFeature].desc}</p>
                      <button
                        className="feature-go-btn"
                        style={{
                          background: `${features[activeFeature].color}20`,
                          color: features[activeFeature].color,
                          border: `1px solid ${features[activeFeature].color}40`
                        }}
                        onClick={() => navigate('/login')}
                      >
                        Acceder → (requiere login)
                      </button>
                    </div>
                    <div className="feature-tabs">
                      {features.map((f, i) => (
                        <button
                          key={i}
                          className={`feature-tab ${activeFeature === i ? 'active' : ''}`}
                          onClick={() => setActiveFeature(i)}
                          style={activeFeature === i ? { borderTop: `2px solid ${f.color}` } : {}}
                        >
                          {f.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="features-section">
              <div className="features-section-inner">
                <div className="features-header">
                  <span className="section-tag">Funcionalidades</span>
                  <h2>Todo lo que necesitas</h2>
                  <p>Herramientas diseñadas para el flujo de trabajo real de un laboratorio ambiental.</p>
                </div>
                <div className="feat-grid">
                  {[
                    { icon: '🔬', bg: 'rgba(0,200,100,0.1)', title: 'Inventario de Reactivos', desc: 'Control en tiempo real de entradas y salidas de reactivos con alertas de stock bajo.' },
                    { icon: '🧪', bg: 'rgba(59,130,246,0.1)', title: 'Solicitud de Préstamos', desc: 'Solicita equipos del laboratorio de forma digital con aprobación y seguimiento.' },
                    { icon: '⚙️', bg: 'rgba(245,158,11,0.1)', title: 'Gestión de Equipos', desc: 'Registro fotográfico, estado y trazabilidad completa de todos los equipos.' },
                    { icon: '📊', bg: 'rgba(139,92,246,0.1)', title: 'Control de Proveedores', desc: 'Directorio y gestión de proveedores vinculados a los movimientos de reactivos.' },
                  ].map((f, i) => (
                    <div className="feat-card" key={i}>
                      <div className="feat-icon" style={{ background: f.bg }}>{f.icon}</div>
                      <h5>{f.title}</h5>
                      <p>{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer className="eco-footer">
          <div className="footer-brand">
            <div className="footer-icon">ES</div>
            <span className="footer-name">ECOSYSTEM</span>
          </div>
          <p>© 2026 Ecosystem · Desarrollado con ♥ por el equipo ADSO · SENA</p>
        </footer>

      </div>
    </>
  );
};

export default Home;