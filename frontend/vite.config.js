import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"
import process from "process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    headers: {
      // Allow Google OAuth popup to communicate back with the opener window
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
