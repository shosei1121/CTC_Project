<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const isAdmin = computed(() => authStore.isAdmin)

const navItems = computed(() => {
  if (isAdmin.value) {
    return [
      { path: '/admin', icon: '📊', label: 'ダッシュボード' },
      { path: '/admin?section=producers', icon: '👥', label: '生産者管理' },
      { path: '/admin?section=users', icon: '👤', label: 'ユーザー' },
      { path: '/admin?section=settings', icon: '⚙️', label: '設定' }
    ]
  }
  return [
    { path: '/', icon: '🏠', label: 'ホーム' },
    { path: '/marketplace', icon: '📦', label: 'マーケット' },
    { path: '/tools', icon: '🛠️', label: 'ツール' },
    { path: '/profile', icon: '👤', label: 'マイページ' }
  ]
})

const isActive = (path) => {
  if (path.includes('?')) {
    // 管理者画面のセクション付きパスの場合
    const [basePath, query] = path.split('?')
    const [key, value] = query.split('=')
    return route.path === basePath && route.query[key] === value
  }
  
  // 管理者画面のダッシュボードの場合
  if (path === '/admin') {
    return route.path === '/admin' && !route.query.section
  }
  
  // 通常画面の場合
  return route.path === path
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
    <div class="grid grid-cols-4 h-16">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center text-xs"
        :class="isActive(item.path) ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'"
      >
        <span class="text-xl mb-1">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </div>
  </nav>
</template>