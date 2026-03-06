import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAxios from '../api/axiosConfig'

export default function Login() {
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!validateEmail(userEmail)) return setError('Ingresa un email válido')
    if (password.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres')

    setLoading(true)
    try {
      const res = await apiAxios.post('/api/users/login', { userEmail, password })
      const { token } = res.data
      localStorage.setItem('token', token)
      setSuccess('¡Bienvenido de vuelta!')
      window.dispatchEvent(new Event('tokenUpdated'))
      setTimeout(() => navigate('/'), 800)
    } catch (err) {
      setError(err.response?.data?.msg || 'Credenciales incorrectas')
      setLoading(false)
    }
  }

  const resetDatabase = async () => {
    try {
      await apiAxios.post('/api/users/reset')
      alert('Base de datos reiniciada (dev)')
    } catch (err) {
      alert('Error: ' + (err.response?.data?.msg || err.message))
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060d0a;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .login-bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }
        .orb1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,200,100,0.15) 0%, transparent 70%);
          top: -100px; left: -150px;
          animation: orbFloat1 12s ease-in-out infinite;
        }
        .orb2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,255,140,0.1) 0%, transparent 70%);
          bottom: -80px; right: -100px;
          animation: orbFloat2 15s ease-in-out infinite;
        }
        .orb3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(0,180,80,0.08) 0%, transparent 70%);
          top: 50%; left: 50%;
          animation: orbFloat3 10s ease-in-out infinite;
        }

        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(40px, 30px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-30px, -40px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
        }

        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 900px;
          width: 100%;
          background: rgba(10, 20, 14, 0.85);
          border: 1px solid rgba(0, 200, 100, 0.15);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,200,100,0.05);
          position: relative;
          z-index: 1;
          backdrop-filter: blur(20px);
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-left {
          background: linear-gradient(160deg, #0a2e1a 0%, #051a0d 50%, #020f07 100%);
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300c864' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .brand-icon {
          width: 52px; height: 52px;
          background: linear-gradient(135deg, #00c864, #00ff8a);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 18px;
          color: #060d0a;
          box-shadow: 0 8px 24px rgba(0,200,100,0.4);
        }
        .brand-text h3 {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: 20px;
          color: #fff;
          margin: 0;
          letter-spacing: 1px;
        }
        .brand-text span {
          font-size: 12px;
          color: rgba(0,200,100,0.7);
          letter-spacing: 0.5px;
        }

        .left-headline {
          position: relative;
        }
        .left-headline h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 36px;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin-bottom: 16px;
        }
        .left-headline h2 span {
          color: #00c864;
        }
        .left-headline p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          line-height: 1.7;
        }

        .left-stats {
          display: flex;
          gap: 20px;
        }
        .stat-pill {
          background: rgba(0,200,100,0.08);
          border: 1px solid rgba(0,200,100,0.2);
          border-radius: 12px;
          padding: 12px 16px;
          text-align: center;
        }
        .stat-pill strong {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #00c864;
        }
        .stat-pill span {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.5px;
        }

        .login-right {
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-right h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }
        .login-right p {
          color: rgba(255,255,255,0.4);
          font-size: 14px;
          margin-bottom: 32px;
        }

        .eco-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .eco-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 13px 16px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .eco-input:focus {
          border-color: #00c864;
          background: rgba(0,200,100,0.05);
          box-shadow: 0 0 0 3px rgba(0,200,100,0.12);
        }
        .eco-input::placeholder { color: rgba(255,255,255,0.2); }
        .eco-input:disabled { opacity: 0.5; }

        .pass-wrapper {
          position: relative;
        }
        .pass-wrapper .eco-input { padding-right: 48px; }
        .pass-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          transition: color 0.2s;
        }
        .pass-toggle:hover { color: #00c864; }

        .eco-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .eco-alert.danger {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
        }
        .eco-alert.success {
          background: rgba(0,200,100,0.1);
          border: 1px solid rgba(0,200,100,0.25);
          color: #6ee7b7;
        }

        .eco-btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #00c864, #00ff8a);
          border: none;
          border-radius: 12px;
          color: #060d0a;
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(0,200,100,0.35);
          margin-bottom: 12px;
        }
        .eco-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,200,100,0.45);
        }
        .eco-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .eco-btn-ghost {
          width: 100%;
          padding: 13px;
          background: transparent;
          border: 1.5px solid rgba(0,200,100,0.25);
          border-radius: 12px;
          color: #00c864;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .eco-btn-ghost:hover:not(:disabled) {
          background: rgba(0,200,100,0.08);
          border-color: #00c864;
        }
        .eco-btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

        .eco-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 16px 0;
          color: rgba(255,255,255,0.15);
          font-size: 12px;
        }
        .eco-divider::before, .eco-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .eco-field { margin-bottom: 20px; }

        @media (max-width: 640px) {
          .login-grid { grid-template-columns: 1fr; }
          .login-left { display: none; }
          .login-right { padding: 40px 28px; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-bg-orb orb1"></div>
        <div className="login-bg-orb orb2"></div>
        <div className="login-bg-orb orb3"></div>

        <div className="login-grid">
          {/* LEFT PANEL */}
          <div className="login-left">
            <div className="brand-logo">
              <div className="brand-icon">ES</div>
              <div className="brand-text">
                <h3>ECOSYSTEM</h3>
                <span>Laboratorio Ambiental</span>
              </div>
            </div>

            <div className="left-headline">
              <h2>Gestión<br />inteligente de<br /><span>laboratorio</span></h2>
              <p>Control de reactivos, equipos y solicitudes en un solo lugar.</p>
            </div>

            <div className="left-stats">
              <div className="stat-pill">
                <strong>100%</strong>
                <span>DIGITAL</span>
              </div>
              <div className="stat-pill">
                <strong>24/7</strong>
                <span>ACCESO</span>
              </div>
              <div className="stat-pill">
                <strong>JWT</strong>
                <span>SEGURO</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="login-right">
            <h4>Iniciar sesión</h4>
            <p>Ingresa tus credenciales para continuar</p>

            {error && <div className="eco-alert danger">⚠️ {error}</div>}
            {success && <div className="eco-alert success">✅ {success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="eco-field">
                <label className="eco-label">Correo electrónico</label>
                <input
                  className="eco-input"
                  type="email"
                  placeholder="tu@correo.com"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="eco-field">
                <label className="eco-label">Contraseña</label>
                <div className="pass-wrapper">
                  <input
                    className="eco-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button className="eco-btn-primary" type="submit" disabled={loading}>
                {loading ? '⏳ Iniciando sesión...' : 'Entrar →'}
              </button>

              <div className="eco-divider">o</div>

              <button className="eco-btn-ghost" type="button" onClick={() => navigate('/register')} disabled={loading}>
                Crear cuenta nueva
              </button>

              {import.meta.env.DEV && (
                <button type="button" onClick={resetDatabase} disabled={loading}
                  style={{ width:'100%', background:'none', border:'none', color:'rgba(239,68,68,0.5)', fontSize:'12px', marginTop:'16px', cursor:'pointer' }}>
                  ⚠️ Reset DB (dev only)
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  )
}