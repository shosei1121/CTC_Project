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
    // 環境を検出
    const isProduction = !window.location.hostname.includes('localhost') && 
                         !window.location.hostname.includes('127.0.0.1');
    
    // ナビゲーションリンクをすべて取得
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '/') return; // ホームはスキップ
        
        if (!isProduction) {
            // 開発環境: すべてのリンクを/src/pages/xxx.htmlに変換
            let pageName = href.startsWith('/') ? href.substring(1) : href;
            // 既に.htmlが含まれている場合は削除
            pageName = pageName.replace('.html', '');
            link.setAttribute('href', `/src/pages/${pageName}.html`);
        } else {
            // 本番環境: すべてのリンクを/xxx形式に統一（.html除去）
            let pageName = href.startsWith('/') ? href.substring(1) : href;
            pageName = pageName.replace('.html', '');
            link.setAttribute('href', `/${pageName}`);
        }
    });
}