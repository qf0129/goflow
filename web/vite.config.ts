import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // port: 1420,
    // strictPort: true,
    proxy: {
      "/v1/apis": {
        target: "http://localhost:27666",
      }
    },
  },
})
