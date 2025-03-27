import { checkAuth } from './auth/auth-check.js';
import { setupNavigation, updateNavigation } from './utils/navigation.js';
import { getUserProfile, purchaseProduct, fetchProducts, fetchChannels } from '../services/local-storage.js';

let currentProduct = null;
let userProfile = null;
let currentChannel = null;

async function loadUserProfile() {
    userProfile = await getUserProfile();
    if (userProfile) {
        const currentPointsElement = document.getElementById('currentPoints');
        if (currentPointsElement) {
            currentPointsElement.textContent = userProfile.points.toLocaleString();
        }
    }
}

async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = '/src/pages/market.html';
        return;
    }

    const products = await fetchProducts();
    currentProduct = products.find(p => p.id === productId);

    if (!currentProduct) {
        window.location.href = '/src/pages/market.html';
        return;
    }

    // 商品詳細を表示
    document.getElementById('productImage').src = currentProduct.image_url;
    document.getElementById('productImage').alt = currentProduct.name;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productLocation').textContent = `📍 ${currentProduct.location}`;
    document.getElementById('productPrice').textContent = `¥${currentProduct.price.toLocaleString()}`;
    document.getElementById('productRating').innerHTML = `
        <span class="stars">⭐️ ${currentProduct.rating}</span>
        <span class="sales">販売数: ${currentProduct.sales}</span>
    `;
    document.getElementById('productDescription').textContent = currentProduct.description;

    // 農家（チャンネル）情報を表示
    const channels = await fetchChannels();
    currentChannel = channels.find(c => c.id === currentProduct.channel_id);
    
    if (currentChannel) {
        const farmerInfo = document.getElementById('farmerInfo');
        if (farmerInfo) {
            document.getElementById('farmerAvatar').src = currentChannel.image_url;
            document.getElementById('farmerName').textContent = currentChannel.name;
            document.getElementById('farmerLocation').textContent = `📍 ${currentChannel.location}`;
            document.getElementById('farmerDescription').textContent = currentChannel.description;
            document.getElementById('farmerEstablished').textContent = currentChannel.established;
            document.getElementById('farmerStyle').textContent = currentChannel.farming_style;
            document.getElementById('farmerSpecialties').textContent = currentChannel.specialties.join('、');
            
            // チャンネルページへのリンク
            const farmerHeader = farmerInfo.querySelector('.farmer-header');
            farmerHeader.style.cursor = 'pointer';
            farmerHeader.addEventListener('click', () => {
                window.location.href = `/src/pages/market.html?channel=${currentChannel.id}`;
            });

            // フォローボタンの状態を設定
            const followButton = document.getElementById('followButton');
            const isFollowing = localStorage.getItem(`follow_${currentChannel.id}`) === 'true';
            if (isFollowing) {
                followButton.classList.add('active');
                followButton.textContent = 'フォロー中';
            }
            followButton.addEventListener('click', handleFollow);
        }
    }

    // いいねボタンの状態を設定
    const likeButton = document.getElementById('likeButton');
    if (likeButton) {
        const isLiked = localStorage.getItem(`like_${productId}`) === 'true';
        if (isLiked) {
            likeButton.classList.add('active');
        }
        likeButton.addEventListener('click', handleLike);
    }
}

// いいね機能の処理
function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentProduct) return;
    
    const productId = currentProduct.id;
    const isLiked = localStorage.getItem(`like_${productId}`) === 'true';
    
    localStorage.setItem(`like_${productId}`, !isLiked);
    e.target.classList.toggle('active');
}

// フォロー機能の処理
function handleFollow(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentChannel) return;
    
    const channelId = currentChannel.id;
    const isFollowing = localStorage.getItem(`follow_${channelId}`) === 'true';
    
    localStorage.setItem(`follow_${channelId}`, !isFollowing);
    e.target.classList.toggle('active');
    e.target.textContent = !isFollowing ? 'フォロー中' : 'フォロー';
}

// 戻るボタンの処理
document.getElementById('backButton')?.addEventListener('click', () => {
    window.history.back();
});

// モーダル管理
window.closeAllModals = function() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// 閉じるボタンの設定
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeAllModals();
    }
});

// 購入ボタンのイベント
document.getElementById('buyButton')?.addEventListener('click', () => {
    document.getElementById('paymentModal').style.display = 'block';
});

// 決済方法の選択
document.getElementById('pointsPayment')?.addEventListener('click', async () => {
    if (!currentProduct || !userProfile) return;

    if (userProfile.points >= currentProduct.price) {
        try {
            await purchaseProduct(currentProduct.id, 'point');
            document.getElementById('paymentModal').style.display = 'none';
            document.getElementById('completionModal').style.display = 'block';
        } catch (error) {
            alert('購入に失敗しました。もう一度お試しください。');
        }
    } else {
        alert('ポイントが不足しています。');
    }
});

document.getElementById('creditPayment')?.addEventListener('click', () => {
    document.getElementById('paymentModal').style.display = 'none';
    document.getElementById('creditCardModal').style.display = 'block';
});

// クレジットカード決済
document.getElementById('creditCardForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
        await purchaseProduct(currentProduct.id, 'credit');
        document.getElementById('creditCardModal').style.display = 'none';
        document.getElementById('completionModal').style.display = 'block';
    } catch (error) {
        alert('決済に失敗しました。もう一度お試しください。');
    }
});

// カード番号のフォーマット
document.getElementById('cardNumber')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value;
});

// 有効期限のフォーマット
document.getElementById('expiryDate')?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
});

// CVVの数字のみ入力
document.getElementById('cvv')?.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// 初期化
async function init() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = '/src/pages/auth.html';
        return;
    }

    await Promise.all([
        loadUserProfile(),
        loadProductDetails()
    ]);

    setupNavigation();
    updateNavigation();
}

document.addEventListener('DOMContentLoaded', init);