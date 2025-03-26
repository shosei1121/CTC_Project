import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        market: resolve(__dirname, 'src/pages/market.html'),
        mypage: resolve(__dirname, 'src/pages/mypage.html'),
        auth: resolve(__dirname, 'src/pages/auth.html')
      }
    },
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js']
  }
});