import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

const CMS_BASE = 'http://localhost:3001'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Payload REST API
      '/api': {
        target: CMS_BASE,
        changeOrigin: true,
        secure: false,
      },
      // Payload media uploads
      '/media': {
        target: CMS_BASE,
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
