import { useState } from 'react'

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Crudconsumoreactivo from './consumosreactivos/crudconsumosreactivos'
import CrudIngresoReactivo from './ingresoreactivo/crudingresoreactivo'
import CrudEstadoSolicitud from './estadosolicitud/crudestadosolicitud'
import CrudSolicitudXEquipo from './solicitudxequipo/crudsolicitudxequipo'
function App() {
  

  return (
    <>
      <Routes>
        <Route path='/consumosreactivos' element={<Crudconsumoreactivo />}></Route>
        <Route path='/ingresoreactivo' element={<CrudIngresoReactivo />}></Route>
        <Route path='/estadosolicitud' element={<CrudEstadoSolicitud />}></Route>
        <Route path='/solicitudxequipo' element={<CrudSolicitudXEquipo />}></Route>
        
      </Routes>       
    </>
  )
}

export default App
