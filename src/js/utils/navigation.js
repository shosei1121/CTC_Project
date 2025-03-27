// 現在のページのパスを取得
function getCurrentPath() {
    return window.location.pathname;
}

// ナビゲーションの更新
export function updateNavigation() {
    const currentPath = getCurrentPath();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || (href === '/' && currentPath === '/index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ナビゲーションのクリックイベント
export function setupNavigation() {
    // 実行環境を検出（開発環境か本番環境か）
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
    
    // ナビゲーションリンクをすべて取得
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // 開発環境の場合のみパスを変換
        if (!isProduction && href !== '/') {
            if (href.startsWith('/')) {
                const page = href.substring(1); // 先頭の/を削除
                // /market → /src/pages/market.html のように変換
                link.setAttribute('href', `/src/pages/${page}.html`);
            }
        }
        // 本番環境（Amplify）では何もしない - 既存のパスのままにする
    });
}