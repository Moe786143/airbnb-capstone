import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the Airbnb clone frontend.
// The dev server runs on 3000 to match the backend's default CLIENT_URL,
// so CORS works out of the box with no extra configuration.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
