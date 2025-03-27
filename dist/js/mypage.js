import { checkAuth } from './auth/auth-check.js';
import { setupNavigation, updateNavigation } from './utils/navigation.js';
import { getUserProfile, getUserNFTs, getTransactions, updateProfile, fetchProducts, fetchChannels } from '../services/local-storage.js';
import { connectMetaMask } from './auth/web3-auth.js';

async function loadUserProfile() {
    try {
        const profile = await getUserProfile();
        if (!profile) return;

        // プロフィール情報の更新
        const profileElements = {
            name: document.getElementById('profileName'),
            email: document.getElementById('profileEmail'),
            points: document.getElementById('userPoints'),
            avatar: document.getElementById('profileAvatar')
        };

        if (profileElements.name) profileElements.name.textContent = profile.username || 'ユーザー名未設定';
        if (profileElements.email) profileElements.email.textContent = profile.email;
        if (profileElements.points) profileElements.points.textContent = profile.points.toLocaleString();
        if (profileElements.avatar) {
            profileElements.avatar.src = profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
        }

        // MetaMask連携状態の更新
        const connectMetamaskBtn = document.getElementById('connectMetamaskBtn');
        if (connectMetamaskBtn) {
            if (profile.wallet_address) {
                connectMetamaskBtn.textContent = 'MetaMask連携済み';
                connectMetamaskBtn.disabled = true;
            } else {
                connectMetamaskBtn.addEventListener('click', handleMetaMaskConnect);
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// アバター画像のアップロード処理
function setupAvatarUpload() {
    const profileAvatar = document.getElementById('profileAvatar');
    const avatarInput = document.getElementById('avatarInput');
    const editAvatarModal = document.getElementById('editAvatarModal');
    const closeAvatarBtn = editAvatarModal.querySelector('.close-btn');
    const avatarPreview = document.getElementById('avatarPreview');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');

    // プロフィール画像クリックでモーダルを開く
    profileAvatar?.addEventListener('click', () => {
        editAvatarModal.style.display = 'block';
    });

    closeAvatarBtn?.addEventListener('click', () => {
        editAvatarModal.style.display = 'none';
        avatarPreview.src = '';
        avatarInput.value = '';
    });

    avatarInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB制限
                alert('画像サイズは5MB以下にしてください。');
                avatarInput.value = '';
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('画像ファイルを選択してください。');
                avatarInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                avatarPreview.src = event.target.result;
                saveAvatarBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });

    saveAvatarBtn?.addEventListener('click', async () => {
        const file = avatarInput.files[0];
        if (!file) return;

        try {
            const base64Image = avatarPreview.src;
            await updateProfile({ avatar_url: base64Image });
            
            // プロフィールアバターを更新
            if (profileAvatar) {
                profileAvatar.src = base64Image;
            }

            editAvatarModal.style.display = 'none';
            avatarInput.value = '';
            saveAvatarBtn.disabled = true;
        } catch (error) {
            console.error('Error updating avatar:', error);
            alert('アバターの更新に失敗しました。');
        }
    });
}

async function loadUserNFTs() {
    try {
        const nfts = await getUserNFTs();
        const nftGrid = document.getElementById('nftGrid');
        if (!nftGrid) return;

        if (nfts && nfts.length > 0) {
            nftGrid.innerHTML = nfts.map(nft => `
                <div class="nft-card">
                    <img src="${nft.products.image_url}" alt="${nft.products.name}" class="nft-image">
                    <div class="nft-info">
                        <h3 class="nft-name">${nft.products.name}</h3>
                        <p class="nft-date">購入日: ${new Date(nft.purchased_at).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');
        } else {
            nftGrid.innerHTML = '<p class="no-data">所有しているNFTはありません</p>';
        }
    } catch (error) {
        console.error('Error loading NFTs:', error);
        const nftGrid = document.getElementById('nftGrid');
        if (nftGrid) {
            nftGrid.innerHTML = '<p class="error-message">NFTの読み込みに失敗しました</p>';
        }
    }
}

async function loadLikedNFTs() {
    try {
        const products = await fetchProducts();
        const likedNftGrid = document.getElementById('likedNftGrid');
        if (!likedNftGrid) return;

        const likedNFTs = products.filter(product => 
            localStorage.getItem(`like_${product.id}`) === 'true'
        );

        if (likedNFTs.length > 0) {
            likedNftGrid.innerHTML = likedNFTs.map(nft => `
                <div class="nft-card" onclick="window.location.href='/src/pages/product-detail.html?id=${nft.id}'">
                    <img src="${nft.image_url}" alt="${nft.name}" class="nft-image">
                    <div class="nft-info">
                        <h3 class="nft-name">${nft.name}</h3>
                        <p class="nft-location">📍 ${nft.location}</p>
                        <p class="nft-price">¥${nft.price.toLocaleString()}</p>
                    </div>
                </div>
            `).join('');
        } else {
            likedNftGrid.innerHTML = '<p class="no-data">いいねしたNFTはありません</p>';
        }
    } catch (error) {
        console.error('Error loading liked NFTs:', error);
        const likedNftGrid = document.getElementById('likedNftGrid');
        if (likedNftGrid) {
            likedNftGrid.innerHTML = '<p class="error-message">いいねしたNFTの読み込みに失敗しました</p>';
        }
    }
}

async function loadFollowedChannels() {
    try {
        const channels = await fetchChannels();
        const followedChannelsContainer = document.getElementById('followedChannels');
        if (!followedChannelsContainer) return;

        const followedChannels = channels.filter(channel =>
            localStorage.getItem(`follow_${channel.id}`) === 'true'
        );

        if (followedChannels.length > 0) {
            followedChannelsContainer.innerHTML = followedChannels.map(channel => `
                <div class="followed-channel-card" onclick="window.location.href='/src/pages/market.html?channel=${channel.id}'">
                    <img src="${channel.image_url}" alt="${channel.name}" class="channel-image">
                    <div class="channel-info">
                        <h3 class="channel-name">${channel.name}</h3>
                        <p class="channel-location">📍 ${channel.location}</p>
                        <p class="channel-description">${channel.description}</p>
                        <div class="channel-stats">
                            <span class="stat-item">❤️ ${channel.likes.toLocaleString()}</span>
                            <span class="stat-item">🌾 ${channel.farming_style}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            followedChannelsContainer.innerHTML = '<p class="no-data">フォロー中の生産者はいません</p>';
        }
    } catch (error) {
        console.error('Error loading followed channels:', error);
        const followedChannelsContainer = document.getElementById('followedChannels');
        if (followedChannelsContainer) {
            followedChannelsContainer.innerHTML = '<p class="error-message">フォロー中の生産者の読み込みに失敗しました</p>';
        }
    }
}

async function loadTransactionHistory() {
    try {
        const transactions = await getTransactions();
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        if (transactions && transactions.length > 0) {
            historyList.innerHTML = transactions.map(tx => `
                <div class="history-item">
                    <div class="history-details">
                        <h3 class="history-title">${tx.description}</h3>
                        <p class="history-date">${new Date(tx.created_at).toLocaleString()}</p>
                    </div>
                    <div class="history-amount ${tx.type === 'point' ? 'points' : 'money'}">
                        ${tx.type === 'point' ? '🏆' : '💰'} ${tx.amount.toLocaleString()}
                    </div>
                </div>
            `).join('');
        } else {
            historyList.innerHTML = '<p class="no-data">取引履歴はありません</p>';
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
        const historyList = document.getElementById('historyList');
        if (historyList) {
            historyList.innerHTML = '<p class="error-message">取引履歴の読み込みに失敗しました</p>';
        }
    }
}

function setupProfileEditing() {
    const editNameBtn = document.getElementById('editNameBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const editProfileForm = document.getElementById('editProfileForm');
    const closeBtn = editProfileModal.querySelector('.close-btn');

    editNameBtn?.addEventListener('click', () => {
        const currentName = document.getElementById('profileName').textContent;
        document.getElementById('editUsername').value = currentName;
        editProfileModal.style.display = 'block';
    });

    closeBtn?.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    editProfileForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUsername = document.getElementById('editUsername').value;
        
        try {
            await updateProfile({ username: newUsername });
            await loadUserProfile();
            editProfileModal.style.display = 'none';
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('プロフィールの更新に失敗しました。');
        }
    });
}

async function handleMetaMaskConnect() {
    try {
        await connectMetaMask();
        await loadUserProfile();
    } catch (error) {
        console.error('MetaMask connection error:', error);
        alert('MetaMaskとの連携に失敗しました。');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await Promise.all([
            loadUserProfile(),
            loadUserNFTs(),
            loadLikedNFTs(),
            loadFollowedChannels(),
            loadTransactionHistory()
        ]);
        setupProfileEditing();
        setupAvatarUpload();
    } catch (error) {
        console.error('Error initializing mypage:', error);
    }
});