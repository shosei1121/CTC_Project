import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// HTMLファイルをコピーして修正する関数
function copyHtmlPlugin() {
  return {
    name: 'copy-html-plugin',
    closeBundle() {
      // index.htmlをコピーして修正
      const indexPath = resolve(__dirname, 'index.html');
      const distIndexPath = resolve(__dirname, 'dist/index.html');
      
      if (fs.existsSync(indexPath) && fs.existsSync(distIndexPath)) {
        let content = fs.readFileSync(distIndexPath, 'utf8');
        
        // 本番環境用にリンクパスを修正 (絶対パスに)
        content = content.replace(/href="\.\/src\/pages\/market\.html"/g, 'href="/market.html"');
        content = content.replace(/href="\.\/src\/pages\/mypage\.html"/g, 'href="/mypage.html"');
        content = content.replace(/href="\.\/src\/pages\/auth\.html"/g, 'href="/auth.html"');
        content = content.replace(/window\.location\.href = '\.\/src\/pages\/auth\.html'/g, 'window.location.href = \'/auth.html\'');
        
        // CSSとJSの参照も修正
        content = content.replace(/href="\.\/src\/styles\//g, 'href="/assets/');
        content = content.replace(/src="\.\/src\/js\//g, 'src="/assets/');
        content = content.replace(/from '\.\/src\/js\//g, 'from "/assets/');
        
        // ホーム用のパスも修正
        content = content.replace(/href="\.\/"/g, 'href="/"');
        
        // 変更した内容を書き込み
        fs.writeFileSync(distIndexPath, content);
        console.log(`Modified index.html links for production`);
      }
      
      // src/pages内のHTMLファイルをdistディレクトリのルートにコピー
      const pagesDir = resolve(__dirname, 'src/pages');
      const distDir = resolve(__dirname, 'dist');
      
      if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);
        files.forEach(file => {
          if (file.endsWith('.html')) {
            const srcFile = path.join(pagesDir, file);
            let content = fs.readFileSync(srcFile, 'utf8');
            
            // *** CSSリンクのパスをより確実に修正 ***
            // 相対パスをアセットパスに変換
            content = content.replace(/href="\.\.\/styles\/([^"]+)\.css"/g, 'href="/assets/$1.css"');
            content = content.replace(/href="\.\.\/styles\//g, 'href="/assets/');
            
            // その他のパス修正も確実に
            content = content.replace(/href="..\/..\/index.html"/g, 'href="/"');
            content = content.replace(/href="..\/..\/"/g, 'href="/"');
            
            // ほかのページへのリンクも修正
            content = content.replace(/href="\.\.\/market\.html"/g, 'href="/market.html"');
            content = content.replace(/href="\.\.\/mypage\.html"/g, 'href="/mypage.html"');
            content = content.replace(/href="\.\.\/auth\.html"/g, 'href="/auth.html"');
            
            // CSSとJSの参照も修正
            content = content.replace(/href="\.\.\/styles\//g, 'href="/assets/');
            content = content.replace(/src="\.\.\/js\//g, 'src="/assets/');
            content = content.replace(/from '\.\.\/js\//g, 'from "/assets/');
            
            const destFile = path.join(distDir, file);
            fs.writeFileSync(destFile, content);
            console.log(`Copied and modified ${file} to dist directory root`);
          }
        });
      }
      
      // CSSファイルのパス調整も確認
      // HTMLファイル内のCSSリンクも修正されているか確認
    }
  };
}

export default defineConfig({
  base: '/',  // 絶対パスを使用
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html')
      }
    },
    cssCodeSplit: true
  },
  plugins: [copyHtmlPlugin()],
  server: {
    port: 8080,
    open: true
  },
  preview: {
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