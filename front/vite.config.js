/**
 * @file vite.config.js
 * @description Configuración principal de Vite para el entorno de desarrollo y construcción.
 * Incluye el plugin de React y reglas de proxy inverso para conectar peticiones de la API
 * y recursos estáticos con el servidor backend de Django.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración exportada de Vite (https://vite.dev/config/)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige /api/* → http://localhost:8000/api/*
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      // Redirige /static/* → http://localhost:8000/static/*
      // Esto evita el error CORS al cargar los .glb y las imágenes
      '/static': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
