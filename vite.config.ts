import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Añade esta sección de aquí abajo:
  server: {
    allowedHosts: [
      'adjunctly-unemitted-braiden.ngrok-free.dev'
    ]
  }
})