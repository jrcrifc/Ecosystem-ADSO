import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isAuth, logOut, user, updateUserPhoto }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Mapeo directo a tu modelo de Sequelize: nombres
  // Si user existe, usa user.nombres. Si no, muestra "Cargando..."
const userName = user?.nombres ? user.nombres : "Cargando...";
  const userPhoto = user?.photo || null; // Si luego añades campo 'photo' a tu modelo

  const handleClick = (path) => {
    if (!isAuth) {
      navigate("/UserLogin");
      return;
    }
    navigate(path);
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && updateUserPhoto) {
      updateUserPhoto(file);
    }
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
          <ul className="navbar-nav ms-auto gap-2 align-items-center">
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/home")}>
                Inicio
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/reactivos")}>
                Inventario de Reactivos
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/estadoSolicitud")}>
                Estado de Solicitudes
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/equipos")}>
                Solicitud de Equipos
              </span>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: "pointer" }} onClick={() => handleClick("/proveedor")}>
                Proveedores
              </span>
            </li>

            {/* LOGIN / PERFIL DESPLEGABLE */}
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
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white overflow-hidden" 
                    style={{ width: "35px", height: "35px" }}
                  >
                    {userPhoto ? (
                      <img src={userPhoto} alt="profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <span className="fw-bold">{userName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                </a>

                <ul 
                  className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-0" 
                  style={{ minWidth: "220px", borderRadius: "12px", overflow: "hidden" }}
                >
                  {/* Header: Datos de la BD */}
                  <li className="p-3 bg-light border-bottom text-center">
                    <div className="position-relative d-inline-block mb-2">
                      <div 
                        className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center overflow-hidden" 
                        style={{ width: 60, height: 60, cursor: 'pointer', border: '2px solid #0d6efd' }}
                        onClick={handleAvatarClick}
                      >
                        {userPhoto ? (
                          <img src={userPhoto} alt="profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                          <span className="text-primary fw-bold fs-4">{userName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                        onChange={handleFileChange} 
                      />
                    </div>
                    <div>
                      {/* Aquí aparece el nombre exacto de la columna 'nombres' */}
                      <p className="m-0 fw-bold text-dark" style={{ lineHeight: 1.2 }}>
                        {userName}
                      </p>
                      <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                        ID: {user?.documentos || 'Usuario'}
                      </small>
                    </div>
                  </li>

                  {/* Footer: Logout */}
                  <li className="border-top">
                    <button className="dropdown-item py-2 fw-semibold text-danger" onClick={logOut}>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <span
                  className="nav-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/UserLogin")}
                >
                  Login
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;