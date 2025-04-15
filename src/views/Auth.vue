<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleMetaMask = async () => {
  if (!window.ethereum) {
    error.value = 'MetaMaskをインストールしてください'
    return
  }

  try {
    loading.value = true
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    if (accounts.length === 0) {
      throw new Error('MetaMaskのアカウントが見つかりません')
    }

    await authStore.signInWithMetaMask(accounts[0])
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const handleEmailSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'メールアドレスとパスワードを入力してください'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const { error: authError } = isLogin.value
      ? await authStore.signIn(email.value, password.value)
      : await authStore.signUp(email.value, password.value)

    if (authError) throw authError
  } catch (e) {
    error.value = e.message === 'Invalid login credentials'
      ? 'メールアドレスまたはパスワードが正しくありません'
      : e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<template>
  <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
      購入者アカウント
    </h1>

    <div class="mb-8">
      <button 
        @click="handleMetaMask"
        class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg transition-colors text-lg font-medium flex items-center justify-center"
        :disabled="loading"
      >
        <span class="mr-2">🦊</span>
        MetaMaskで続ける
      </button>
    </div>

    <div class="text-center text-gray-600 dark:text-gray-300 mb-8">
      または
    </div>

    <div class="mb-8 text-center">
      <RouterLink 
        to="/admin/login" 
        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        管理者・生産者の方はこちら
      </RouterLink>
    </div>

    <div class="flex mb-6 space-x-4 border-b dark:border-gray-700">
      <button
        :class="[
          'pb-2 px-4',
          isLogin
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 dark:text-gray-400'
        ]"
        @click="isLogin = true"
      >
        ログイン
      </button>
      <button
        :class="[
          'pb-2 px-4',
          !isLogin
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 dark:text-gray-400'
        ]"
        @click="isLogin = false"
      >
        新規登録
      </button>
    </div>

    <form @submit.prevent="handleEmailSubmit" class="space-y-6">
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {{ error }}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          メールアドレス
        </label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          パスワード
        </label>
        <input
          v-model="password"
          type="password"
          required
          minlength="6"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="パスワードを入力"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? '処理中...' : (isLogin ? 'ログイン' : '新規登録') }}
      </button>
    </form>
  </div>
</template>