import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const useProducerStore = defineStore('producer', () => {
  const authStore = useAuthStore()
  const followedProducers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const isFollowing = computed(() => (producerId) => {
    return followedProducers.value.some(follow => follow.producer_id === producerId)
  })

  async function loadFollowedProducers() {
    if (!authStore.isAuthenticated) return

    try {
      loading.value = true
      const { data, error: err } = await supabase
        .from('follows')
        .select(`
          producer_id,
          producer_profiles (
            id,
            name,
            location,
            image
          )
        `)
        .eq('user_id', authStore.user.id)

      if (err) throw err
      followedProducers.value = data
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
      const { error: err } = await supabase
        .from('follows')
        .insert({
          user_id: authStore.user.id,
          producer_id: producerId
        })

      if (err) throw err
      await loadFollowedProducers()
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
      const { error: err } = await supabase
        .from('follows')
        .delete()
        .eq('user_id', authStore.user.id)
        .eq('producer_id', producerId)

      if (err) throw err
      await loadFollowedProducers()
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