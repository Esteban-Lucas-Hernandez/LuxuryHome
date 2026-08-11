/**
 * @file eslint.config.js
 * @description Archivo de configuración Flat Config para ESLint en el proyecto frontend.
 * Define las reglas de linter para JavaScript ES2020+, hooks de React, integración con Vite
 * y variables globales de entorno de navegador.
 */

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignorar directorio de salida de compilación
  globalIgnores(['dist']),
  {
    // Aplicar a todos los archivos JavaScript y React JSX
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Regla de variables no usadas (permite componentes React desestructurados en mayúsculas)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
