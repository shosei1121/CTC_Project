import { 
    fetchProducts, 
    searchProducts, 
    filterProducts,
    fetchChannels,
    getUserProfile,
    getChannelProducts
} from '../services/local-storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    let userProfile = null;

    // URLパラメータからチャンネルIDを取得
    const urlParams = new URLSearchParams(window.location.search);
    const selectedChannelId = urlParams.get('channel');

    // ユーザープロフィールの読み込み
    async function loadUserProfile() {
        userProfile = await getUserProfile();
        const currentPointsElement = document.getElementById('currentPoints');
        if (userProfile && currentPointsElement) {
            currentPointsElement.textContent = userProfile.points.toLocaleString();
        }
    }

    // 商品一覧の表示
    async function renderProducts(products) {
        const grid = document.getElementById('productGrid');
        if (!grid) return;

        grid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="favorite-btn" data-product-id="${product.id}">❤️</div>
                <img src="${product.image_url}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <p class="product-location">📍 ${product.location}</p>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">⭐️ ${product.rating}</span>
                        <span class="sales">販売数: ${product.sales}</span>
                    </div>
                    <p class="product-price">¥${product.price.toLocaleString()}</p>
                </div>
            </div>
        `).join('');

        // 商品カードのクリックイベントを設定
        grid.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // お気に入りボタンのクリック時は詳細ページに遷移しない
                if (e.target.classList.contains('favorite-btn')) {
                    e.preventDefault();
                    return;
                }

                const productId = card.dataset.id;
                window.location.href = `/src/pages/product-detail.html?id=${productId}`;
            });
        });
    }

    // チャンネル一覧の表示
    async function renderChannels() {
        const channels = await fetchChannels();
        const channelList = document.querySelector('.channel-list');
        const marketHome = document.getElementById('marketHome');
        
        if (!channelList || !marketHome) return;

        // チャンネルが選択されている場合はホームセクションを非表示
        if (selectedChannelId) {
            marketHome.style.display = 'none';
        } else {
            marketHome.style.display = 'block';
            channelList.innerHTML = channels.map(channel => `
                <a href="/src/pages/market.html?channel=${channel.id}" class="channel-item">
                    <div class="channel-avatar">
                        <img src="${channel.image_url}" alt="${channel.name}">
                        ${channel.is_live ? '<span class="live-badge">LIVE</span>' : ''}
                    </div>
                    <p class="channel-name">${channel.name}</p>
                    <p class="channel-likes">❤️ ${(channel.likes / 1000).toFixed(1)}K</p>
                </a>
            `).join('');
        }
    }

    // 初期表示
    const products = await fetchProducts();
    let filteredProducts = products;

    // チャンネルが選択されている場合は、そのチャンネルの商品のみを表示
    if (selectedChannelId) {
        filteredProducts = products.filter(p => p.channel_id === selectedChannelId);
        
        // チャンネル情報を表示
        const channels = await fetchChannels();
        const selectedChannel = channels.find(c => c.id === selectedChannelId);
        if (selectedChannel) {
            const marketContainer = document.querySelector('.market-container');
            const channelHeader = document.createElement('div');
            channelHeader.className = 'channel-header-large';
            channelHeader.innerHTML = `
                <div class="channel-info-large">
                    <img src="${selectedChannel.image_url}" alt="${selectedChannel.name}" class="channel-avatar-large">
                    <div class="channel-details-large">
                        <h2>${selectedChannel.name}</h2>
                        <p class="channel-location">📍 ${selectedChannel.location}</p>
                        <p class="channel-description">${selectedChannel.description}</p>
                        <div class="channel-stats">
                            <div class="stat-item">
                                <span class="stat-label">創業</span>
                                <span class="stat-value">${selectedChannel.established || '未設定'}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">農法</span>
                                <span class="stat-value">${selectedChannel.farming_style || '未設定'}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">専門分野</span>
                                <span class="stat-value">${selectedChannel.specialties ? selectedChannel.specialties.join('、') : '未設定'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            marketContainer.insertBefore(channelHeader, marketContainer.firstChild);
        }
    }

    await Promise.all([
        loadUserProfile(),
        renderChannels(),
        renderProducts(filteredProducts)
    ]);

    // フィルター機能
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const sortBy = btn.dataset.sort;
            const region = document.querySelector('.region-select').value;
            let products = await filterProducts({ sortBy, region });
            
            // チャンネルが選択されている場合は、そのチャンネルの商品のみをフィルター
            if (selectedChannelId) {
                products = products.filter(p => p.channel_id === selectedChannelId);
            }
            
            renderProducts(products);
        });
    });

    // 地域フィルター
    const regionSelect = document.querySelector('.region-select');
    regionSelect?.addEventListener('change', async (e) => {
        const region = e.target.value;
        const sortBy = document.querySelector('.filter-btn.active').dataset.sort;
        let products = await filterProducts({ sortBy, region });
        
        // チャンネルが選択されている場合は、そのチャンネルの商品のみをフィルター
        if (selectedChannelId) {
            products = products.filter(p => p.channel_id === selectedChannelId);
        }
        
        renderProducts(products);
    });
});