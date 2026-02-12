import { useState } from 'react'

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Crudinventarioreactivo from './inventarioreactivo/crudinventarioreactivo'
import CrudSolicitud from './solicitud/crudsolicitud'
import CrudReactivos from './reactivos/crudreactivos'
import Crudsalidas from './salidas/crudsalidareactivo'
import Crudsolicitudxequipo from './solicitudxequipo/crudsolicitudxequipo'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/reactivos' element={<CrudReactivos />}></Route>
        <Route path='/salidas' element={<Crudsalidas />}></Route>
        <Route path='/solicitud' element={<CrudSolicitud />}></Route>
        <Route path='/solicitudxequipo' element={<Crudsolicitudxequipo/>}></Route>
        <Route path='/inventarioreactivo' element={<Crudinventarioreactivo/>}></Route>
      </Routes>       
    </>
  )
}

export default App
