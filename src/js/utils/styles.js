export function setupStyles() {
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
    
    // スタイルシートのパスを修正
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
        const href = link.getAttribute('href');
        
        if (isProduction) {
            // 本番環境: ../styles/xxx.css → /assets/xxx.css
            if (href && href.includes('../styles/')) {
                const styleName = href.split('/').pop();
                link.setAttribute('href', `/assets/${styleName}`);
            }
        }
    });
    
    // スクリプトのパスも修正
    document.querySelectorAll('script[src]').forEach(script => {
        const src = script.getAttribute('src');
        
        if (isProduction && src) {
            // 本番環境: ../js/xxx.js → /assets/xxx.js
            if (src.includes('../js/')) {
                const scriptName = src.split('/').pop();
                script.setAttribute('src', `/assets/${scriptName}`);
            }
        }
    });
    
    // ホームへのリンクを修正
    const homeLinks = document.querySelectorAll('a[href="/"]');
    homeLinks.forEach(link => {
        if (!isProduction) {
            link.setAttribute('href', '/index.html');
        }
    });
}

// ページロード前の高速パス修正
export function quickFixPaths() {
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
                         
    if (isProduction) {
        // 本番環境向けの緊急修正
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('../styles/')) {
                const styleName = href.split('/').pop();
                link.setAttribute('href', `/assets/${styleName}`);
            }
        });
    }
}

export function fixStylePaths() {
  // 本番環境かどうかを判定
  const isProduction = !window.location.hostname.includes('localhost') && 
                       !window.location.hostname.includes('127.0.0.1');
  
  if (isProduction) {
    // 既存のCSSリンクをすべて取得
    const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
    
    // 各リンクを検証し修正
    styleLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // 相対パスが含まれているか確認
      if (href.includes('../styles/')) {
        // スタイル名を抽出
        const styleName = href.split('/').pop();
        // 新しいパスを設定
        link.setAttribute('href', `/assets/${styleName}`);
      }
    });
    
    // 主要なスタイルがない場合は追加
    const hasMainStyle = Array.from(styleLinks).some(link => 
      link.getAttribute('href').includes('styles.css') || 
      link.getAttribute('href').includes('index')
    );
    
    if (!hasMainStyle) {
      const mainStyle = document.createElement('link');
      mainStyle.rel = 'stylesheet';
      mainStyle.href = '/assets/styles.css';
      document.head.appendChild(mainStyle);
    }
  }
} 