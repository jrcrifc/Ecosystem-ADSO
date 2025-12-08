import { BrowserRouter, Routes, Route } from "react-router-dom";

import Equipos from "./equipo/Equipos.jsx";
import Estado from "./estado/estado.jsx";
import EstadoXEquipo from "./estadoequipo/CrudEstadoXEquipo.jsx";
import EstadoXSolicitud from "./estado/EstadoXSolicitud.jsx";
import Solicitud from "./solicitud/solicitud.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Equipos />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/estado" element={<Estado />} />
        <Route path="/estado-x-equipo" element={<EstadoXEquipo />} />
        <Route path="/estado-x-solicitud" element={<EstadoXSolicitud />} />
        <Route path="/solicitud" element={<Solicitud />} />

      </Routes>
    </BrowserRouter>
  );
}
