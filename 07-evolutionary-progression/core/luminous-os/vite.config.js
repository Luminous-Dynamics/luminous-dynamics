import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Sacred Vite configuration for LuminousOS
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@database': path.resolve(__dirname, './database'),
    },
  },
  
  server: {
    port: 5173,
    host: true, // Allow external connections
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'data-vendor': ['zustand', 'surrealdb.js', '@supabase/supabase-js'],
        },
      },
    },
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'three'],
  },
});