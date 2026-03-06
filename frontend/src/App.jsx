import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import CrudReactivos from './reactivos/crudreactivos.jsx';
import CrudmovimientoReactivo from './movimientosReactivos/crudmovimientoreactivo.jsx';
import Crudproveedor from './proveedores/Crudproveedor.jsx';
import CrudEquipo from './equipos/crudequipos.jsx';
import CrudSalidas from './salidasReactivos/crudsalidareactivo.jsx';
import CrudSolicitud from './Solicitud/crudsolicitud.jsx';
import CrudEstadosolicitud from './estadosolicitud/crudestadosolicitud.jsx';
import Home from '../Home/home.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Profile from './perfil/Profile.jsx';
import Settings from './perfil/Settings.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CrudEstadoEquipo from './estadoequipo/crudestadoequipo.jsx';
function App() { 
return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          
          {/* Rutas protegidas - requieren autenticación */}
          <Route path="/perfil" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/configuracion" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
          <Route path='/reactivos' element={<ProtectedRoute><CrudReactivos/></ProtectedRoute>} />
          <Route path='/proveedor' element={<ProtectedRoute><Crudproveedor/></ProtectedRoute>} />
          <Route path='/equipos' element={<ProtectedRoute><CrudEquipo/></ProtectedRoute>} />
          <Route path="/movimientoreactivo" element={<ProtectedRoute><CrudmovimientoReactivo/></ProtectedRoute>} />
          <Route path='/salidas' element={<ProtectedRoute><CrudSalidas/></ProtectedRoute>} />
          <Route path='/solicitud' element={<ProtectedRoute><CrudSolicitud/></ProtectedRoute>} />
          <Route path='/estadoequipo' element={<ProtectedRoute><CrudEstadoEquipo/></ProtectedRoute>} />
          <Route path="/estadosolicitud" element={<ProtectedRoute><CrudEstadosolicitud/></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
