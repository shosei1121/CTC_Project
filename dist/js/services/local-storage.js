// ローカルストレージのキー
const STORAGE_KEYS = {
    USERS: 'users',
    PROFILES: 'profiles',
    PRODUCTS: 'products',
    CHANNELS: 'channels',
    USER_NFTS: 'user_nfts',
    TRANSACTIONS: 'transactions'
};

// 初期データ
const initialData = {
    products: [
        {
            id: '1',
            name: 'Cosmic Butterfly NFT',
            location: '東京',
            price: 50000,
            rating: 4.8,
            sales: 120,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=butterfly',
            description: '宇宙を舞う神秘的な蝶をモチーフにしたデジタルアート作品。'
        },
        {
            id: '2',
            name: 'Digital Samurai',
            location: '大阪',
            price: 75000,
            rating: 4.5,
            sales: 85,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=samurai',
            description: '現代的な解釈で描かれた侍のデジタルアート。'
        },
        {
            id: '3',
            name: 'Future City 2050',
            location: '福岡',
            price: 45000,
            rating: 4.7,
            sales: 150,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=city',
            description: '2050年の未来都市を想像して描かれたデジタルアート。'
        }
    ],
    channels: [
        {
            id: '1',
            name: 'CryptoArt Gallery',
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=gallery',
            likes: 15000,
            is_live: true
        },
        {
            id: '2',
            name: 'NFT Collectors',
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=collectors',
            likes: 12000,
            is_live: false
        }
    ]
};

// ローカルストレージの初期化
export function initializeStorage() {
    Object.entries(STORAGE_KEYS).forEach(([key, value]) => {
        if (!localStorage.getItem(value)) {
            localStorage.setItem(value, JSON.stringify(initialData[value.toLowerCase()] || []));
        }
    });
}

// ユーザー認証
export async function signInWithPassword({ email, password }) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        throw new Error('Invalid login credentials');
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    return { user };
}

export async function signUp({ email, password, options }) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    if (users.some(u => u.email === email)) {
        throw new Error('User already registered');
    }

    const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        ...options?.data
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // プロフィールの作成
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const newProfile = {
        id: newUser.id,
        email: newUser.email,
        username: options?.data?.username || `User${newUser.id.substring(0, 8)}`,
        points: 1000, // 初期ポイント
        created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

    return { user: newUser };
}

export async function signOut() {
    localStorage.removeItem('currentUser');
}

// ユーザー情報の取得
export async function getUser() {
    const user = localStorage.getItem('currentUser');
    return user ? { user: JSON.parse(user) } : { user: null };
}

// プロフィール関連
export async function getUserProfile() {
    const { user } = await getUser();
    if (!user) return null;

    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    return profiles.find(p => p.id === user.id);
}

// 商品関連
export async function fetchProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
}

export async function searchProducts(searchTerm) {
    const products = await fetchProducts();
    return products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
}

export async function filterProducts({ sortBy, region }) {
    let products = await fetchProducts();
    
    if (region) {
        products = products.filter(p => p.location.toLowerCase().includes(region.toLowerCase()));
    }

    if (sortBy) {
        switch (sortBy) {
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'price':
                products.sort((a, b) => a.price - b.price);
                break;
        }
    }

    return products;
}

// チャンネル関連
export async function fetchChannels() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANNELS) || '[]');
}

// NFT購入
export async function purchaseProduct(productId, paymentType) {
    const { user } = await getUser();
    if (!user) throw new Error('ユーザーが認証されていません。');

    const products = await fetchProducts();
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('商品が見つかりません。');

    // トランザクションの記録
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    transactions.push({
        id: crypto.randomUUID(),
        user_id: user.id,
        type: paymentType,
        amount: product.price,
        description: `${product.name}の購入`,
        created_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

    // NFTの記録
    const userNfts = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_NFTS) || '[]');
    userNfts.push({
        id: crypto.randomUUID(),
        user_id: user.id,
        product_id: productId,
        token_id: `NFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        purchased_at: new Date().toISOString(),
        products: product
    });
    localStorage.setItem(STORAGE_KEYS.USER_NFTS, JSON.stringify(userNfts));

    // ポイント決済の場合はポイントを減算
    if (paymentType === 'point') {
        const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
        const userProfile = profiles.find(p => p.id === user.id);
        if (userProfile) {
            userProfile.points -= product.price;
            localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
        }
    }

    return true;
}

// NFTの取得
export async function getUserNFTs() {
    const { user } = await getUser();
    if (!user) return [];

    const userNfts = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_NFTS) || '[]');
    return userNfts.filter(nft => nft.user_id === user.id);
}

// 取引履歴の取得
export async function getTransactions() {
    const { user } = await getUser();
    if (!user) return [];

    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS) || '[]');
    return transactions.filter(tx => tx.user_id === user.id);
}