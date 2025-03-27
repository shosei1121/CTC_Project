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
            
            // CSSリンクを直接置換
            content = content.replace(
              /<link\s+rel="stylesheet"\s+href="\.\.\/styles\/([^"]+)"/g, 
              '<link rel="stylesheet" href="/assets/$1"'
            );
            
            content = content.replace(
              /<link\s+rel="stylesheet"\s+href="\.\/src\/styles\/([^"]+)"/g, 
              '<link rel="stylesheet" href="/assets/$1"'
            );
            
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
      
      // 主要CSSを読み込む
      const mainCssPath = resolve(__dirname, 'dist/assets/styles.css');
      let mainCss = '';
      
      if (fs.existsSync(mainCssPath)) {
        mainCss = fs.readFileSync(mainCssPath, 'utf8');
        
        // 各HTMLファイルにインラインCSSを注入
        const htmlFiles = [];
        
        if (fs.existsSync(distDir)) {
          const files = fs.readdirSync(distDir);
          files.forEach(file => {
            if (file.endsWith('.html')) {
              htmlFiles.push(path.join(distDir, file));
            }
          });
        }
        
        htmlFiles.forEach(filePath => {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // <head>にインラインCSSを追加
          const headCloseTag = '</head>';
          const inlineCSS = `
  <!-- インライン主要スタイル -->
  <style>
    ${mainCss}
  </style>
`;
          
          if (content.includes(headCloseTag)) {
            content = content.replace(headCloseTag, inlineCSS + headCloseTag);
            fs.writeFileSync(filePath, content);
            console.log(`Added inline CSS to ${path.basename(filePath)}`);
          }
        });
      }
    }
  };
}

// フォルダ構造を維持してコピーする関数
function preserveFolderStructurePlugin() {
  return {
    name: 'preserve-folder-structure',
    closeBundle() {
      // src/stylesを丸ごとdist/stylesにコピー
      copyFolderRecursive('src/styles', 'dist/styles');
      
      // src/pagesを丸ごとdist/pagesにコピー
      copyFolderRecursive('src/pages', 'dist/pages');
      
      // src/jsを丸ごとdist/jsにコピー
      copyFolderRecursive('src/js', 'dist/js');
    }
  };
}

// フォルダをコピーするヘルパー関数
function copyFolderRecursive(source, target) {
  const sourceDir = resolve(__dirname, source);
  const targetDir = resolve(__dirname, target);
  
  // ターゲットディレクトリが存在しない場合は作成
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // ソースディレクトリのファイルをすべて読み込む
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);
    
    if (fs.statSync(sourcePath).isDirectory()) {
      // ディレクトリの場合は再帰的にコピー
      copyFolderRecursive(sourcePath, targetPath);
    } else {
      // ファイルの場合はそのままコピー
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

function copyAssetsPlugin() {
  return {
    name: 'copy-assets-plugin',
    closeBundle() {
      // CSSファイルをdist/assetsにコピー
      const stylesDir = resolve(__dirname, 'src/styles');
      const distAssetsDir = resolve(__dirname, 'dist/assets');
      
      if (fs.existsSync(stylesDir) && fs.existsSync(distAssetsDir)) {
        fs.readdirSync(stylesDir).forEach(file => {
          if (file.endsWith('.css')) {
            const srcFile = path.join(stylesDir, file);
            const destFile = path.join(distAssetsDir, file);
            fs.copyFileSync(srcFile, destFile);
            console.log(`Copied ${file} to assets directory`);
          }
        });
      }
    }
  };
}

function preserveInlineScriptsPlugin() {
  return {
    name: 'preserve-inline-scripts',
    transformIndexHtml(html) {
      // インラインスクリプトを保持
      return html;
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
  plugins: [
    copyHtmlPlugin(), 
    preserveInlineScriptsPlugin(),
    preserveFolderStructurePlugin(),
    copyAssetsPlugin()
  ],
  server: {
    port: 8080,
    open: true,
    proxy: {
      '/market': '/src/pages/market.html',
      '/mypage': '/src/pages/mypage.html',
      '/auth': '/src/pages/auth.html',
      '/product-detail': '/src/pages/product-detail.html'
    }
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