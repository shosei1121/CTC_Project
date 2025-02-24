document.addEventListener('DOMContentLoaded', () => {
    // タブ切り替え機能
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // アクティブなタブのクラスを削除
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // クリックされたタブをアクティブに
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
});