import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiAxios from '../api/axiosConfig'

export default function Register() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('aprendiz')
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
    if (!validateEmail(correo)) return setError('Ingresa un email válido')
    if (password.length < 6) return setError('La contraseña debe tener mínimo 6 caracteres')

    setLoading(true)
    try {
      const response = await apiAxios.post('/api/users/register', { userEmail: correo, password, userType })
      const { token } = response.data
      if (token) {
        localStorage.setItem('token', token)
        window.dispatchEvent(new Event('tokenUpdated'))
        setSuccess('¡Registro exitoso! Iniciando sesión...')
        setTimeout(() => navigate('/'), 1200)
      } else {
        setSuccess('¡Registro exitoso! Redirigiendo...')
        setTimeout(() => navigate('/login'), 1200)
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Error en el registro')
      setLoading(false)
    }
  }

  const roles = [
    { value: 'aprendiz', label: '🎓 Aprendiz' },
    { value: 'gestor', label: '📋 Gestor' },
    { value: 'instructor', label: '👨‍🏫 Instructor' },
    { value: 'pasante', label: '💼 Pasante' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .reg-root {
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

        .reg-bg-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
        }
        .reg-orb1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(0,200,100,0.12) 0%, transparent 70%);
          top: -200px; right: -200px;
          animation: regOrb1 14s ease-in-out infinite;
        }
        .reg-orb2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,160,80,0.1) 0%, transparent 70%);
          bottom: -100px; left: -100px;
          animation: regOrb2 18s ease-in-out infinite;
        }
        @keyframes regOrb1 {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(-50px, 40px); }
        }
        @keyframes regOrb2 {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(40px, -30px); }
        }

        .reg-card {
          background: rgba(10, 20, 14, 0.9);
          border: 1px solid rgba(0,200,100,0.15);
          border-radius: 24px;
          padding: 48px 44px;
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 1;
          backdrop-filter: blur(20px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          animation: regSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes regSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reg-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .reg-brand-icon {
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #00c864, #00ff8a);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 15px;
          color: #060d0a;
          box-shadow: 0 6px 18px rgba(0,200,100,0.4);
        }
        .reg-brand-text h5 {
          font-family: 'Outfit', sans-serif;
          font-weight: 800; font-size: 16px;
          color: #fff; margin: 0; letter-spacing: 1px;
        }
        .reg-brand-text span {
          font-size: 11px; color: rgba(0,200,100,0.6);
        }

        .reg-card h4 {
          font-family: 'Outfit', sans-serif;
          font-size: 26px; font-weight: 700;
          color: #fff; margin-bottom: 6px;
        }
        .reg-card > p {
          color: rgba(255,255,255,0.4);
          font-size: 14px; margin-bottom: 28px;
        }

        .r-label {
          display: block;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.8px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .r-input, .r-select {
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
        .r-input:focus, .r-select:focus {
          border-color: #00c864;
          background: rgba(0,200,100,0.05);
          box-shadow: 0 0 0 3px rgba(0,200,100,0.12);
        }
        .r-input::placeholder { color: rgba(255,255,255,0.2); }
        .r-input:disabled, .r-select:disabled { opacity: 0.5; }
        .r-select option { background: #0a1a0e; color: #fff; }

        .r-pass-wrap { position: relative; }
        .r-pass-wrap .r-input { padding-right: 48px; }
        .r-pass-toggle {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer; font-size: 16px;
          transition: color 0.2s;
        }
        .r-pass-toggle:hover { color: #00c864; }

        .r-hint {
          font-size: 11px; color: rgba(255,255,255,0.25);
          margin-top: 6px; display: block;
        }

        .r-roles {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .r-role-btn {
          padding: 11px 10px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .r-role-btn.active {
          border-color: #00c864;
          background: rgba(0,200,100,0.1);
          color: #00c864;
          font-weight: 600;
        }
        .r-role-btn:hover:not(.active) {
          border-color: rgba(0,200,100,0.3);
          color: rgba(255,255,255,0.7);
        }

        .r-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .r-alert.danger {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #fca5a5;
        }
        .r-alert.success {
          background: rgba(0,200,100,0.1);
          border: 1px solid rgba(0,200,100,0.25);
          color: #6ee7b7;
        }

        .r-btn-primary {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #00c864, #00ff8a);
          border: none; border-radius: 12px;
          color: #060d0a;
          font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 15px;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 6px 20px rgba(0,200,100,0.35);
          margin-bottom: 12px;
        }
        .r-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0,200,100,0.45);
        }
        .r-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .r-btn-ghost {
          width: 100%; padding: 13px;
          background: transparent;
          border: 1.5px solid rgba(0,200,100,0.2);
          border-radius: 12px;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; cursor: pointer;
          transition: all 0.2s;
        }
        .r-btn-ghost:hover:not(:disabled) {
          border-color: rgba(0,200,100,0.4);
          color: #00c864;
        }
        .r-btn-ghost:disabled { opacity: 0.5; }

        .r-field { margin-bottom: 20px; }
        .r-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 16px 0; color: rgba(255,255,255,0.15); font-size: 12px;
        }
        .r-divider::before, .r-divider::after {
          content: ''; flex: 1; height: 1px;
          background: rgba(255,255,255,0.08);
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-bg-orb reg-orb1"></div>
        <div className="reg-bg-orb reg-orb2"></div>

        <div className="reg-card">
          <div className="reg-brand">
            <div className="reg-brand-icon">ES</div>
            <div className="reg-brand-text">
              <h5>ECOSYSTEM</h5>
              <span>Laboratorio Ambiental</span>
            </div>
          </div>

          <h4>Crear cuenta</h4>
          <p>Únete al sistema de gestión de laboratorio</p>

          {error && <div className="r-alert danger">⚠️ {error}</div>}
          {success && <div className="r-alert success">✅ {success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="r-field">
              <label className="r-label">Correo electrónico</label>
              <input
                className="r-input"
                type="email"
                placeholder="tu@correo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="r-field">
              <label className="r-label">Contraseña</label>
              <div className="r-pass-wrap">
                <input
                  className="r-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button type="button" className="r-pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <span className="r-hint">Mínimo 6 caracteres</span>
            </div>

            <div className="r-field">
              <label className="r-label">Tipo de usuario</label>
              <div className="r-roles">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    className={`r-role-btn ${userType === r.value ? 'active' : ''}`}
                    onClick={() => setUserType(r.value)}
                    disabled={loading}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="r-btn-primary" type="submit" disabled={loading}>
              {loading ? '⏳ Registrando...' : 'Crear cuenta →'}
            </button>

            <div className="r-divider">ya tienes cuenta</div>

            <button className="r-btn-ghost" type="button" onClick={() => navigate('/login')} disabled={loading}>
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </>
  )
}