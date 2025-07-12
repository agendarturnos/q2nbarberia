// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
    define: {
    'process.env.VITE_PROJECT_NAME': JSON.stringify(process.env.VITE_PROJECT_NAME)
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: false
  }
});
