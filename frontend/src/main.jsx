import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



import Crudproveedor from './proveedores/Crudproveedor.jsx';
import CrudResponsables from './responsable/CrudResponsable.jsx';
import CrudpersonaSolicitante from './personaSolicitante/CrudpersonaSolicitante.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <CrudResponsables />
    <Crudproveedor />
    <CrudpersonaSolicitante />

  </React.StrictMode>,
)