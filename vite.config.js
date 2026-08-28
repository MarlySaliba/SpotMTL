import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '.', '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          changeOrigin: true,
          target: environment.VITE_API_PROXY_TARGET || 'http://localhost:3001',
        },
      },
    },
  }
})
