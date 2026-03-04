import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import CrudReactivos from './reactivos/crudreactivos.jsx';
import CrudmovimientoReactivo from './movimientosReactivos/crudmovimientoreactivo.jsx';
import Crudproveedor from './proveedores/Crudproveedor.jsx';
import CrudEquipo from './equipos/crudequipos.jsx';
import Home from '../Home/home.jsx';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Profile from './perfil/Profile.jsx';
import Settings from './perfil/Settings.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
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
          <Route path="/estadoSolicitud" element={<ProtectedRoute><CrudmovimientoReactivo/></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
