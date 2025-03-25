// ローカルストレージのキー
const STORAGE_KEYS = {
    USERS: 'users',
    PROFILES: 'profiles',
    PRODUCTS: 'products',
    CHANNELS: 'channels',
    USER_NFTS: 'user_nfts',
    TRANSACTIONS: 'transactions',
    PURCHASED_NFTS: 'purchased_nfts'
};

// 初期データ
const initialData = {
    products: [
        // 山田農園のNFT
        {
            id: '1',
            name: '朝採れ野菜セットNFT',
            location: '長野県',
            price: 50000,
            rating: 4.8,
            sales: 120,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=vegetables1',
            description: '山田農園で朝採れた新鮮な季節の野菜をデジタルアートで表現。',
            channel_id: '1',
            sold: false
        },
        {
            id: '2',
            name: '有機りんごNFT',
            location: '長野県',
            price: 75000,
            rating: 4.5,
            sales: 85,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=apple1',
            description: '無農薬で育てた蜜入りりんごの収穫の瞬間を切り取ったアート作品。',
            channel_id: '1',
            sold: false
        },
        {
            id: '3',
            name: '山田農園の四季NFT',
            location: '長野県',
            price: 45000,
            rating: 4.7,
            sales: 150,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=seasons1',
            description: '一年を通じて変化する農園の風景を四季折々で表現。',
            channel_id: '1',
            sold: false
        },
        {
            id: '4',
            name: '伝統野菜の物語NFT',
            location: '長野県',
            price: 60000,
            rating: 4.6,
            sales: 95,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=traditional1',
            description: '代々受け継がれてきた伝統野菜の栽培方法と歴史を表現。',
            channel_id: '1',
            sold: false
        },
        // 海辺の牧場のNFT
        {
            id: '5',
            name: '朝焼けの牧場NFT',
            location: '千葉県',
            price: 55000,
            rating: 4.7,
            sales: 110,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=sunrise1',
            description: '海辺の牧場で撮影された美しい朝焼けの風景。',
            channel_id: '2',
            sold: false
        },
        {
            id: '6',
            name: 'ジャージー牛の一日NFT',
            location: '千葉県',
            price: 70000,
            rating: 4.6,
            sales: 80,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=jersey1',
            description: '牧場のジャージー牛たちの日常を切り取った作品。',
            channel_id: '2',
            sold: false
        },
        {
            id: '7',
            name: '海風と緑のハーモニーNFT',
            location: '千葉県',
            price: 48000,
            rating: 4.8,
            sales: 130,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=harmony1',
            description: '潮風に揺れる牧草地の美しい風景を表現。',
            channel_id: '2',
            sold: false
        },
        // 緑の大地農場のNFT
        {
            id: '8',
            name: '大地の恵みNFT',
            location: '北海道',
            price: 65000,
            rating: 4.9,
            sales: 140,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=harvest1',
            description: '広大な大地で育まれた作物の収穫風景。',
            channel_id: '3',
            sold: false
        },
        {
            id: '9',
            name: '北の大地の物語NFT',
            location: '北海道',
            price: 80000,
            rating: 4.8,
            sales: 95,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=story1',
            description: '北海道の雄大な自然と農業の調和を表現。',
            channel_id: '3',
            sold: false
        },
        {
            id: '10',
            name: '雪解けの春NFT',
            location: '北海道',
            price: 58000,
            rating: 4.7,
            sales: 115,
            image_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=spring1',
            description: '春を迎えた畑の目覚めを切り取った瞬間。',
            channel_id: '3',
            sold: false
        }
    ],
    channels: [
        {
            id: '1',
            name: '山田農園',
            image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yamada',
            likes: 15000,
            is_live: true,
            description: '代々続く有機農法にこだわる農園です。新鮮な野菜とともに、農園の四季折々の風景をNFTとして提供しています。',
            location: '長野県',
            specialties: ['有機野菜', '果物', '山菜'],
            farming_style: '有機農法',
            established: '1950年'
        },
        {
            id: '2',
            name: '海辺の牧場',
            image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=umibe',
            likes: 12000,
            is_live: false,
            description: '潮風と緑豊かな環境で育つ牧場の動物たちの日常をNFTに。自然との共生を大切にしています。',
            location: '千葉県',
            specialties: ['乳製品', '放牧卵', '食肉'],
            farming_style: '放牧式',
            established: '1985年'
        },
        {
            id: '3',
            name: '緑の大地農場',
            image_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=midori',
            likes: 18000,
            is_live: true,
            description: '北海道の広大な大地で、自然と共に歩む農業を実践。四季折々の風景と収穫の喜びをNFTに込めています。',
            location: '北海道',
            specialties: ['小麦', '大豆', 'じゃがいも'],
            farming_style: '自然循環農法',
            established: '1975年'
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

export async function updateProfile(updates) {
    const { user } = await getUser();
    if (!user) throw new Error('User not authenticated');

    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
    const profileIndex = profiles.findIndex(p => p.id === user.id);
    
    if (profileIndex === -1) throw new Error('Profile not found');

    profiles[profileIndex] = {
        ...profiles[profileIndex],
        ...updates,
        updated_at: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    return profiles[profileIndex];
}

// 商品関連
export async function fetchProducts() {
    const products = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const purchasedNfts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASED_NFTS) || '[]');
    
    // 購入済みNFTの状態を反映
    return products.map(product => ({
        ...product,
        sold: purchasedNfts.includes(product.id)
    }));
}

export async function searchProducts(searchTerm) {
    const products = await fetchProducts();
    return products.filter(p => 
        !p.sold && (
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.location.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
}

export async function filterProducts({ sortBy, region }) {
    let products = await fetchProducts();
    
    // 販売中のNFTのみをフィルタリング
    products = products.filter(p => !p.sold);
    
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

export async function getChannelProducts(channelId) {
    const products = await fetchProducts();
    return products.filter(p => !p.sold && p.channel_id === channelId);
}

// NFT購入
export async function purchaseProduct(productId, paymentType) {
    const { user } = await getUser();
    if (!user) throw new Error('ユーザーが認証されていません。');

    const products = await fetchProducts();
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('商品が見つかりません。');
    if (product.sold) throw new Error('この商品は既に購入されています。');

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

    // 購入済みNFTの記録
    const purchasedNfts = JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASED_NFTS) || '[]');
    purchasedNfts.push(productId);
    localStorage.setItem(STORAGE_KEYS.PURCHASED_NFTS, JSON.stringify(purchasedNfts));

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