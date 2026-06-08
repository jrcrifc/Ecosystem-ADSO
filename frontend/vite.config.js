/**
 * @file vite.config.js
 * @description Archivo de configuración de Vite para el proyecto frontend.
 * Vite es el empaquetador (bundler) y servidor de desarrollo utilizado.
 * Aquí se definen los plugins y opciones de compilación.
 */

// Importa la función defineConfig de Vite para tener autocompletado y validación de tipos
import { defineConfig } from 'vite'
// Importa el plugin de React que usa SWC (compilador más rápido que Babel) para transformar JSX
import react from '@vitejs/plugin-react-swc'

// Documentación oficial: https://vite.dev/config/
// Se exporta la configuración de Vite usando defineConfig
export default defineConfig({
  // Array de plugins que Vite utilizará durante el desarrollo y la compilación
  plugins: [
    react() // Activa el soporte para React con SWC (compilación rápida de JSX/TSX)
  ],
})
