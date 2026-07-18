import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      "/api": {
        // Use 127.0.0.1 — on Windows, "localhost" can resolve to ::1 while Node listens on IPv4.
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
})
