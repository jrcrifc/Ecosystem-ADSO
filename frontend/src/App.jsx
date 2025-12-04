import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CrudEstadoEquipo from "./api/estadosequipo/CrudEstadoEquipo";
import CrudEstadoXEquipo from "./api/estadoxequipo/CrudEstadoXEquipo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/estados" replace />} />
        <Route path="/estados" element={<CrudEstadoEquipo />} />
        <Route path="/estados-x-equipo" element={<CrudEstadoXEquipo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
