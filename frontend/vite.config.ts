import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    host: true,
    strictPort: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', 'framer-motion'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          charts: ['recharts', 'chart.js'],
          analytics: ['@tanstack/react-query']
        }
      }
    },
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
});