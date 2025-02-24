import { signUp } from '../../services/local-storage.js';

export async function connectMetaMask() {
    if (!window.ethereum) {
        throw new Error('MetaMaskがインストールされていません。');
    }

    try {
        // MetaMaskに接続
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];

        // 署名用のメッセージ
        const message = `CTCアプリケーションへようこそ!\n\nこの署名により、あなたのウォレットを認証します。\n\nアドレス: ${address}\n時間: ${new Date().toISOString()}`;

        // メッセージに署名
        const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address]
        });

        // ローカルストレージで認証
        const { user } = await signUp({
            email: `${address.toLowerCase()}@wallet.eth`,
            password: signature.slice(0, 20), // 署名の最初の20文字をパスワードとして使用
            options: {
                data: {
                    wallet_address: address.toLowerCase(),
                    auth_type: 'metamask'
                }
            }
        });

        return user;
    } catch (error) {
        console.error('MetaMask認証エラー:', error);
        throw error;
    }
}