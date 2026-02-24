import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import CrudReactivos from './reactivos/crudreactivos.jsx';
import CrudmovimientoReactivo from './movimientosReactivos/crudmovimientoreactivo.jsx';
import Crudproveedor from './proveedores/Crudproveedor.jsx';
import CrudEquipo from './equipos/crudequipos.jsx';
import Home from '../Home/home.jsx';
function App() { 
return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          < Route path="/estadoSolicitud" element={<CrudmovimientoReactivo/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path='/reactivos' element={<CrudReactivos/>}></Route>
          <Route path='/proveedor' element={<Crudproveedor/>}></Route>
          <Route path='/equipos' element={<CrudEquipo/>}></Route>
          
        </Routes>
      </div>
    </>
  );
}

export default App;
