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
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href === getCurrentPath()) {
                e.preventDefault(); // 同じページの場合は遷移をキャンセル
            }
        });
    });
}