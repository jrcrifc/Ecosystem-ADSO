// Importa React para poder usar JSX en el renderizado
import React from 'react'
// Importa ReactDOM para montar la aplicación en el DOM
import ReactDOM from 'react-dom/client'
// Importa BrowserRouter para habilitar el enrutamiento en la aplicación
import { BrowserRouter } from 'react-router-dom'
// Importa StyleSheetManager para solucionar advertencias de styled-components
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
// Importa el componente raíz App que contiene todas las rutas y la lógica
import App from './App.jsx'

// Importa los estilos CSS de Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// Importa el JavaScript de Bootstrap con Popper.js para componentes interactivos
import "bootstrap/dist/js/bootstrap.bundle.min.js";
// Importa los estilos personalizados del tema de Ecosystem
import "./theme.css";

// Limpia cualquier residuo del tema oscuro eliminado del proyecto
localStorage.removeItem("theme");
// Remueve el atributo data-theme del HTML para evitar estilos obsoletos
document.documentElement.removeAttribute("data-theme");

// Importa Bootstrap completo para acceso a sus funcionalidades JavaScript
import * as bootstrap from 'bootstrap';

// Función para filtrar custom props y evitar advertencias en consola con react-data-table-component
const customPropFilter = (prop) => {
  if (['center', 'align', 'wrap', 'allowOverflow', 'minWidth', 'maxWidth'].includes(prop)) {
    return false;
  }
  return isPropValid(prop);
};

// Renderiza la aplicación React en el elemento root del HTML
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StyleSheetManager shouldForwardProp={customPropFilter}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StyleSheetManager>
  </React.StrictMode>
)
