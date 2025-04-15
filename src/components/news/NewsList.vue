<script setup>
import { ref, computed } from 'vue'
import { useNewsStore } from '@/stores/news'

const newsStore = useNewsStore()
const selectedFilter = ref('all')
const showUnreadOnly = ref(false)

const filters = [
  { id: 'all', label: 'すべて' },
  { id: 'event', label: 'イベント' },
  { id: 'important', label: '重要' },
  { id: 'news', label: 'お知らせ' }
]

const filteredNews = computed(() => {
  let news = selectedFilter.value === 'all' 
    ? newsStore.getAllNews 
    : newsStore.getNewsByType(selectedFilter.value)
  
  if (showUnreadOnly.value) {
    news = news.filter(item => !newsStore.isRead(item.id))
  }
  
  return news
})

const getNewsTypeStyle = (type) => {
  switch (type) {
    case 'event':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'important':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}

const handleNewsClick = (id) => {
  newsStore.markAsRead(id)
}
</script>

<template>
  <div 
    class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    role="region"
    aria-label="お知らせ一覧"
  >
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
        お知らせ
      </h2>
      
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.id"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            selectedFilter === filter.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
          @click="selectedFilter = filter.id"
        >
          {{ filter.label }}
        </button>
        
        <button
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
            showUnreadOnly
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
          @click="showUnreadOnly = !showUnreadOnly"
        >
          未読のみ
        </button>
      </div>
    </div>

    <div class="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
      <article
        v-for="item in filteredNews"
        :key="item.id"
        :class="[
          'border-b dark:border-gray-700 last:border-0 pb-4 last:pb-0 p-3 rounded-lg transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700',
          newsStore.isRead(item.id) ? 'opacity-75' : ''
        ]"
        @click="handleNewsClick(item.id)"
      >
        <div class="flex items-start gap-4">
          <div class="text-3xl">{{ item.image }}</div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getNewsTypeStyle(item.type)
                ]"
              >
                {{ item.type === 'event' ? 'イベント' : item.type === 'important' ? '重要' : 'お知らせ' }}
              </span>
              <time class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(item.date) }}
              </time>
              <span 
                v-if="!newsStore.isRead(item.id)"
                class="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full"
              >
                NEW
              </span>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {{ item.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              {{ item.content }}
            </p>
          </div>
        </div>
      </article>

      <div 
        v-if="filteredNews.length === 0"
        class="text-center py-8 text-gray-500 dark:text-gray-400"
      >
        表示できるお知らせはありません
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

@media (prefers-color-scheme: dark) {
  .custom-scrollbar {
    scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(75, 85, 99, 0.5);
  }
}
</style>