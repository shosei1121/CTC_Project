import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { news } from '@/data/news'

export const useNewsStore = defineStore('news', {
  state: () => ({
    news,
    readNewsIds: useLocalStorage('read-news-ids', [])
  }),
  getters: {
    getNewsByType: (state) => (type) => {
      return state.news.filter(item => item.type === type)
    },
    getAllNews: (state) => state.news.sort((a, b) => new Date(b.date) - new Date(a.date)),
    isRead: (state) => (id) => state.readNewsIds.includes(id)
  },
  actions: {
    markAsRead(id) {
      if (!this.readNewsIds.includes(id)) {
        this.readNewsIds.push(id)
      }
    }
  }
})