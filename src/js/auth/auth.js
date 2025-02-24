import { signInWithPassword, signUp } from '../../services/local-storage.js';
import { connectMetaMask } from './web3-auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authMessage = document.getElementById('authMessage');
    const metamaskButton = document.getElementById('metamaskButton');

    // MetaMaskログイン
    metamaskButton.addEventListener('click', async () => {
        try {
            showMessage('MetaMaskに接続中...', '');
            await connectMetaMask();
            showMessage('認証に成功しました！', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            console.error('MetaMask error:', error);
            showMessage(error.message || 'MetaMask認証に失敗しました。', 'error');
        }
    });

    // タブ切り替え
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const forms = document.querySelectorAll('.auth-form');
            forms.forEach(form => form.classList.remove('active'));
            
            const targetForm = tab.getAttribute('data-tab') === 'login' ? loginForm : signupForm;
            targetForm.classList.add('active');
            
            authMessage.textContent = '';
            authMessage.className = 'auth-message';
        });
    });

    // ログイン処理
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            showMessage('ログイン中...', '');
            const { user } = await signInWithPassword({
                email,
                password
            });

            if (!user) throw new Error('ログインに失敗しました。');

            showMessage('ログインに成功しました！', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            console.error('Login error:', error);
            showMessage('ログインに失敗しました。メールアドレスとパスワードを確認してください。', 'error');
        }
    });

    // 新規登録処理
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showMessage('パスワードが一致しません。', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('パスワードは6文字以上で入力してください。', 'error');
            return;
        }

        try {
            showMessage('アカウント作成中...', '');
            const { user } = await signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
                    }
                }
            });

            if (!user) throw new Error('アカウント作成に失敗しました。');

            showMessage('アカウントを作成しました！', 'success');
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } catch (error) {
            console.error('Signup error:', error);
            if (error.message.includes('User already registered')) {
                showMessage('このメールアドレスは既に登録されています。', 'error');
            } else {
                showMessage('アカウント作成に失敗しました。', 'error');
            }
        }
    });

    function showMessage(message, type) {
        authMessage.textContent = message;
        authMessage.className = `auth-message ${type}`;
    }
});