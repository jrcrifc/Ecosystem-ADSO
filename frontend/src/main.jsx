import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Mostrar en consola el origen del frontend (útil para comprobar en qué puerto está corriendo)
console.log('Frontend origin:', window.location.origin);

import CrudEstadoSolicitud from './estadosolicitud/crudestadosolicitud.jsx';
import CrudEstadoEquipo from './estadoequipo/crudestadoequipo.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={
            <div className="text-center mt-5">
              <img src="/ecosistem.jpeg" alt="Ecosystem" className="mb-4" style={{maxWidth: '200px', borderRadius: '12px', boxShadow: '0 12px 40px rgba(2,6,23,0.45)'}} />
              <div>
                <Link className="btn btn-primary me-2" to="/login">Iniciar sesión</Link>
                <Link className="btn btn-primary" to="/register">Registrarse</Link>
              </div>
            </div>
          } />
          <Route path="estadosolicitud" element={<CrudEstadoSolicitud />} />
          <Route path="estadoequipo" element={<CrudEstadoEquipo />} />
  
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)