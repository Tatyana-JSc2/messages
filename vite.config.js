import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'




export default defineConfig({
  plugins: [react()],
  server: {
    host: 'bezdogg.loesk.ru',
    port: 8090,
    proxy: {
      '/api': {
        target: 'http://81.200.119.76:4000', // порт твоего Axum
        changeOrigin: true,
      },
    },
  },
});
