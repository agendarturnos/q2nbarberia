// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',   // escucha en todas las interfaces
    port: 5173,        // o el puerto que prefieras
    strictPort: true,  // falla si el puerto ya está en uso
    open: false        // no abre el navegador automáticamente
  }
});
