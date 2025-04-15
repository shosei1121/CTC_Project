<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const userType = ref('admin') // 'admin' or 'producer'

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    error.value = 'メールアドレスとパスワードを入力してください'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const { error: authError } = await authStore.signIn(email.value, password.value, true)
    if (authError) throw authError

    // ユーザータイプと実際の権限が一致しているか確認
    if (userType.value === 'admin' && !authStore.isAdmin) {
      throw new Error('管理者アカウントではありません')
    } else if (userType.value === 'producer' && !authStore.isProducer) {
      throw new Error('生産者アカウントではありません')
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    if (authStore.isAdmin) {
      router.push('/admin')
    } else if (authStore.isProducer) {
      router.push('/producer/dashboard')
    }
  }
})
</script>

<template>
  <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mt-8">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
      運営者ログイン
    </h1>

    <div class="mb-8 text-center">
      <RouterLink 
        to="/auth" 
        class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        購入者の方はこちら
      </RouterLink>
    </div>

    <div class="flex mb-6 space-x-4 border-b dark:border-gray-700">
      <button
        :class="[
          'pb-2 px-4',
          userType === 'admin'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 dark:text-gray-400'
        ]"
        @click="userType = 'admin'"
      >
        管理者
      </button>
      <button
        :class="[
          'pb-2 px-4',
          userType === 'producer'
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-500 dark:text-gray-400'
        ]"
        @click="userType = 'producer'"
      >
        生産者
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
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
          :placeholder="userType === 'admin' ? 'admin@example.com' : 'producer@example.com'"
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
        {{ loading ? '処理中...' : 'ログイン' }}
      </button>
    </form>
  </div>
</template>