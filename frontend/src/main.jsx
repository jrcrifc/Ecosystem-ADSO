import React from "react";
import ReactDOM from "react-dom/client";
import App from "./api/App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// CRUD Responsable
import CrudResponsable from "./responsable/CrudResponsable.jsx";

// CRUD Estado Equipo
import CrudEstadoEquipo from "./estadosequipo/CrudEstadoEquipo.jsx";

// CRUD Estado x Equipo
import CrudEstadoXEquipo from "./estadoxequipo/CrudEstadoXEquipo.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />

    {/* CRUD Responsable */}
    <CrudResponsable />

    {/* CRUD Estado Equipo */}
    <CrudEstadoEquipo />

    {/* CRUD Estado x Equipo */}
    <CrudEstadoXEquipo />
  </React.StrictMode>
);
