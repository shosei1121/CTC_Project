import { getUser, signOut } from '../../services/local-storage.js';

export async function checkAuth() {
    const { user } = await getUser();
    return user;
}

export async function requireAuth() {
    const user = await checkAuth();
    if (!user) {
        window.location.href = '/auth.html';
        return null;
    }
    return user;
}

export { signOut };