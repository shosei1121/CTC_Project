<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const isMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.signOut()
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-white dark:bg-gray-800 shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <RouterLink 
          :to="isAdmin ? '/admin' : '/'" 
          class="text-xl font-bold text-gray-800 dark:text-white"
        >
          {{ isAdmin ? '管理者ダッシュボード' : 'CTCマーケット' }}
        </RouterLink>

        <div class="hidden md:flex items-center">
          <!-- 管理者画面では大きめのログアウトボタンのみ表示 -->
          <button
            v-if="isAdmin"
            @click="handleLogout"
            class="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg text-base font-medium transition-colors"
          >
            ログアウト
          </button>
          
          <!-- 一般ユーザー向けナビゲーション -->
          <template v-else>
            <RouterLink
              v-for="item in [
                { name: 'ホーム', path: '/' },
                { name: 'マーケット', path: '/marketplace' },
                { name: 'マイページ', path: '/profile' }
              ]"
              :key="item.name"
              :to="item.path"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-500': route.path === item.path }"
            >
              {{ item.name }}
            </RouterLink>
            
            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログアウト
            </button>
            <RouterLink
              v-else
              to="/auth"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ログイン
            </RouterLink>
          </template>
        </div>

        <button
          @click="isMenuOpen = !isMenuOpen"
          class="md:hidden text-gray-600 dark:text-gray-300"
        >
          <span class="sr-only">メニュー</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div
        v-show="isMenuOpen"
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <!-- モバイル表示でも管理者画面ではログアウトボタンのみ表示 -->
          <button
            v-if="isAdmin"
            @click="handleLogout"
            class="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-3 rounded-lg text-base font-medium text-center"
          >
            ログアウト
          </button>
          
          <!-- 一般ユーザー向けモバイルナビゲーション -->
          <template v-else>
            <RouterLink
              v-for="item in [
                { name: 'ホーム', path: '/' },
                { name: 'マーケット', path: '/marketplace' },
                { name: 'マイページ', path: '/profile' }
              ]"
              :key="item.name"
              :to="item.path"
              class="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
              :class="{ 'text-blue-500': route.path === item.path }"
              @click="isMenuOpen = false"
            >
              {{ item.name }}
            </RouterLink>
            
            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="block w-full text-left text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              ログアウト
            </button>
            <RouterLink
              v-else
              to="/auth"
              class="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
              @click="isMenuOpen = false"
            >
              ログイン
            </RouterLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>