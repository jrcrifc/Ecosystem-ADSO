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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Separa bibliotecas pesadas en sus propios chunks bajo demanda
            if (id.includes('recharts')) {
              return 'vendor-charts';
            }
            if (id.includes('xlsx') || id.includes('jspdf') || id.includes('html2canvas')) {
              return 'vendor-export';
            }
            if (id.includes('react-data-table-component') || id.includes('styled-components')) {
              return 'vendor-datatable';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react';
            }
          }
        }
      }
    },
    chunkSizeWarningLimit: 800,
  },
  server: {
    proxy: {
      // Redirige todas las peticiones /api (incluyendo socket.io) al backend en puerto 8000
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,  // Habilita el proxy para WebSockets (Socket.IO)
      }
    }
  }
})

