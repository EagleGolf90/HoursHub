import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createLocationsApiMiddleware } from './server/locationsApi'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'locations-api',
      configureServer(server) {
        server.middlewares.use(createLocationsApiMiddleware())
      },
      configurePreviewServer(server) {
        server.middlewares.use(createLocationsApiMiddleware())
      },
    },
  ],
})
