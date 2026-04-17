import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

const WP_BASE = 'http://localhost/promedias-cms';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // WordPress REST API
      '/wp-json': {
        target: WP_BASE,
        changeOrigin: true,
        secure: false,
      },
      // WordPress media uploads (product images, ACF images, etc.)
      '/wp-content': {
        target: WP_BASE,
        changeOrigin: true,
        secure: false,
      },
      // WordPress admin-ajax (if needed)
      '/wp-admin': {
        target: WP_BASE,
        changeOrigin: true,
        secure: false,
      },
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
