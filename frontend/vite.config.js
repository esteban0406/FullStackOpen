import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }    
  },

  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      console.log(`[Proxy Request] ${req.method} ${req.url}`)
      next()
    })
  }
})