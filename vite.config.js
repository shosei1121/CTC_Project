import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        market: resolve(__dirname, 'src/pages/market.html'),
        mypage: resolve(__dirname, 'src/pages/mypage.html'),
        auth: resolve(__dirname, 'src/pages/auth.html'),
        'product-detail': resolve(__dirname, 'src/pages/product-detail.html')
      }
    }
  },
  server: {
    port: 8080,
    open: true
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