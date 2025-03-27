import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// HTMLファイルをコピーしてCSSパスを修正する関数
function copyHtmlPlugin() {
  return {
    name: 'copy-html-plugin',
    closeBundle() {
      // src/pages内のHTMLファイルをdistディレクトリにコピー
      const pagesDir = resolve(__dirname, 'src/pages');
      const distDir = resolve(__dirname, 'dist');
      
      if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);
        files.forEach(file => {
          if (file.endsWith('.html')) {
            let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
            
            // CSSパスを修正
            content = content.replace(/href="\.\.\/styles\//g, 'href="/assets/');
            content = content.replace(/href="\/src\/styles\//g, 'href="/assets/');
            
            // JSパスを修正
            content = content.replace(/src="\.\.\/js\//g, 'src="/assets/');
            content = content.replace(/src="\/src\/js\//g, 'src="/assets/');
            
            // インポートパスを修正
            content = content.replace(/from '\.\.\/js\//g, 'from "/assets/');
            content = content.replace(/from '\/src\/js\//g, 'from "/assets/');
            
            fs.writeFileSync(path.join(distDir, file), content);
            console.log(`Copied and modified ${file} to dist directory`);
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
    historyApiFallback: true
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