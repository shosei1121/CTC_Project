import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useProducerStore = defineStore('producer', () => {
  const authStore = useAuthStore()
  const followedProducers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const isFollowing = computed(() => (producerId) => {
    return followedProducers.value.includes(producerId)
  })

  async function loadFollowedProducers() {
    if (!authStore.isAuthenticated) return

    try {
      loading.value = true
      // ローカルストレージからフォロー中の生産者を読み込む
      const storedFollows = localStorage.getItem(`followedProducers_${authStore.user.id}`)
      followedProducers.value = storedFollows ? JSON.parse(storedFollows) : []
    } catch (err) {
      error.value = '生産者の読み込みに失敗しました'
      console.error('Error loading followed producers:', err)
    } finally {
      loading.value = false
    }
  }

  async function followProducer(producerId) {
    if (!authStore.isAuthenticated) return false

    try {
      loading.value = true
      if (!followedProducers.value.includes(producerId)) {
        followedProducers.value.push(producerId)
        // ローカルストレージに保存
        localStorage.setItem(`followedProducers_${authStore.user.id}`, JSON.stringify(followedProducers.value))
      }
      return true
    } catch (err) {
      error.value = 'フォローに失敗しました'
      console.error('Error following producer:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function unfollowProducer(producerId) {
    if (!authStore.isAuthenticated) return false

    try {
      loading.value = true
      followedProducers.value = followedProducers.value.filter(id => id !== producerId)
      // ローカルストレージに保存
      localStorage.setItem(`followedProducers_${authStore.user.id}`, JSON.stringify(followedProducers.value))
      return true
    } catch (err) {
      error.value = 'フォロー解除に失敗しました'
      console.error('Error unfollowing producer:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    followedProducers,
    loading,
    error,
    isFollowing,
    loadFollowedProducers,
    followProducer,
    unfollowProducer
  }
})