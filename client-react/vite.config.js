import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permet l'accès externe au container
    proxy: {
      '/api/golang': {
        // Remplace localhost par le nom du service dans docker-compose
        target: 'http://api-golang:8080', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/golang/, ''),
        secure: false,
      },
      '/api/node': {
        // Remplace localhost par le nom du service dans docker-compose
        target: 'http://api-node:3000', 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/node/, ''),
        secure: false,
      },
    },
  },
});