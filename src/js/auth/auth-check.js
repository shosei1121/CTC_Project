import { getUser, signOut } from '../../services/local-storage.js';

export async function checkAuth() {
    const { user } = await getUser();
    return user;
}

export async function requireAuth() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = '/src/pages/auth.html';
        return null;
    }
    return user;
}

export async function handleSignOut() {
    try {
        await signOut();
        
        // 環境に応じたリダイレクト
        const isProduction = !window.location.hostname.includes('localhost') && 
                            !window.location.hostname.includes('127.0.0.1');
        
        if (isProduction) {
            window.location.href = '/'; // 本番環境ではルートへ
        } else {
            window.location.href = '/index.html'; // 開発環境ではindex.htmlへ
        }
    } catch (error) {
        console.error('ログアウトエラー:', error);
    }
}

export { signOut };