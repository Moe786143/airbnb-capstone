import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for the host admin dashboard.
// Port 5174 keeps it clear of the customer frontend on 3000, so both apps
// can run against the same backend at the same time.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
  },
});
