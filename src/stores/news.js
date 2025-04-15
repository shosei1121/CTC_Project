import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [
      {
        id: 1,
        type: 'event',
        title: '春の収穫祭開催！',
        content: '地域の農家さんが集まり、新鮮な春野菜の販売や試食会を実施します。',
        date: '2024-04-01',
        image: '🌱'
      },
      {
        id: 2,
        type: 'news',
        title: '新規生産者の参加について',
        content: '新たに5名の生産者が参加しました。地域の特産品がさらに充実します。',
        date: '2024-03-25',
        image: '👨‍🌾'
      },
      {
        id: 3,
        type: 'important',
        title: 'システムメンテナンスのお知らせ',
        content: '3月31日深夜1時から3時まで、システムメンテナンスを実施いたします。',
        date: '2024-03-20',
        image: '🔧'
      }
    ],
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