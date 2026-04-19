import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

// MAMP is confirmed to be running Apache on port 8888
const SERVER_BASE = 'http://localhost:8888/ProMedias'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: SERVER_BASE,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: SERVER_BASE,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
