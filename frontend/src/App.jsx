import { useState } from 'react'

import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import CrudMovimientoreactivo from './movimientoreactivo/crudmovimientoreactivo'
import CrudEquipos from './equipos/crudequipos'
import CrudReactivos from './reactivos/crudreactivos'
import Crudsalidas from './salidas/crudsalidareactivo'
import CrudProveedor from './proveedores/Crudproveedor'


function App() {
  

  return (
    <>
      <Routes>
        <Route path='/reactivos' element={<CrudReactivos />}></Route>
        <Route path='/salidas' element={<Crudsalidas />}></Route>
        <Route path='/movimientos' element={<CrudMovimientoreactivo />}></Route>
        <Route path='/proveedor' element={<CrudProveedor/>}></Route>
        <Route path='/equipos' element={<CrudEquipos/>}></Route>
      </Routes>       
    </>
  )
}

export default App
