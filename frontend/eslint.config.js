/**
 * @file eslint.config.js
 * @description Configuración de ESLint para el proyecto frontend.
 * ESLint es una herramienta de análisis estático que detecta errores y
 * problemas de estilo en el código JavaScript/JSX antes de ejecutarlo.
 * Usa el nuevo formato "flat config" de ESLint.
 */

// Importa la configuración base recomendada de ESLint para JavaScript
import js from '@eslint/js'
// Importa las variables globales del navegador (window, document, etc.)
import globals from 'globals'
// Plugin que verifica el uso correcto de los hooks de React (useEffect, useState, etc.)
import reactHooks from 'eslint-plugin-react-hooks'
// Plugin que asegura que los componentes exportados sean compatibles con React Fast Refresh (HMR)
import reactRefresh from 'eslint-plugin-react-refresh'
// Funciones auxiliares para definir la configuración y los archivos ignorados
import { defineConfig, globalIgnores } from 'eslint/config'

// Exporta la configuración de ESLint como un array de objetos de reglas
export default defineConfig([
  // Ignora globalmente la carpeta 'dist' (archivos compilados de producción)
  globalIgnores(['dist']),
  {
    // Define a qué archivos aplica esta configuración (todos los .js y .jsx)
    files: ['**/*.{js,jsx}'],
    // Extiende las configuraciones recomendadas de cada plugin
    extends: [
      js.configs.recommended,                    // Reglas base recomendadas de JavaScript
      reactHooks.configs['recommended-latest'],  // Reglas para hooks de React
      reactRefresh.configs.vite,                 // Reglas para compatibilidad con Vite HMR
    ],
    // Configuración del lenguaje y parser
    languageOptions: {
      ecmaVersion: 2020,          // Versión de ECMAScript soportada (ES2020)
      globals: globals.browser,   // Variables globales del navegador (window, document, fetch, etc.)
      parserOptions: {
        ecmaVersion: 'latest',    // Usa la última versión de ECMAScript disponible
        ecmaFeatures: { jsx: true }, // Habilita el soporte para sintaxis JSX de React
        sourceType: 'module',     // Indica que el código usa módulos ES (import/export)
      },
    },
    // Reglas personalizadas del proyecto
    rules: {
      // Permite variables no usadas si su nombre empieza con mayúscula o guion bajo
      // Esto evita errores con componentes React importados que se usan solo en JSX
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
