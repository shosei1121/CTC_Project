import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// HTMLファイルをコピーする関数
function copyHtmlPlugin() {
  return {
    name: 'copy-html-plugin',
    closeBundle() {
      // src/pages内のHTMLファイルをdistディレクトリのルートにコピー
      const pagesDir = resolve(__dirname, 'src/pages');
      const distDir = resolve(__dirname, 'dist');
      
      if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);
        files.forEach(file => {
          if (file.endsWith('.html')) {
            const srcFile = path.join(pagesDir, file);
            const destFile = path.join(distDir, file);
            fs.copyFileSync(srcFile, destFile);
            console.log(`Copied ${file} to dist directory root`);
          }
        });
      }
    }
  };
}

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html')
      }
    }
  },
  plugins: [copyHtmlPlugin()],
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