export function setupStyles() {
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
    
    // すべてのCSSリンク要素を取得
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
    
    cssLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (isProduction) {
            // 本番環境: ../styles/xxx.css → /assets/xxx.css に変換
            if (href.includes('../styles/')) {
                const newHref = href.replace('../styles/', '/assets/');
                link.setAttribute('href', newHref);
            } else if (href.includes('./src/styles/')) {
                const newHref = href.replace('./src/styles/', '/assets/');
                link.setAttribute('href', newHref);
            }
        } else {
            // 開発環境: 相対パスが正しいことを確認
            // 必要に応じてパスを調整
        }
    });
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