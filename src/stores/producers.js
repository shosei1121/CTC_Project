import { defineStore } from 'pinia'
import { ref } from 'vue'
import { producers } from '@/data/producers'

export const useProducersStore = defineStore('producers', () => {
  const producersList = ref([...producers])
  const followedProducers = ref([])

  // ローカルストレージからフォロー状態を読み込む
  const loadFollowedProducersFromStorage = () => {
    const stored = localStorage.getItem('followedProducers')
    if (stored) {
      followedProducers.value = JSON.parse(stored)
    }
  }

  // フォロー状態をローカルストレージに保存
  const saveFollowedProducersToStorage = () => {
    localStorage.setItem('followedProducers', JSON.stringify(followedProducers.value))
  }

  const getProducerById = (id) => {
    return producersList.value.find(producer => producer.id === id)
  }

  const isFollowing = (producerId) => {
    return followedProducers.value.includes(producerId)
  }

  const followProducer = (producerId) => {
    if (!isFollowing(producerId)) {
      followedProducers.value.push(producerId)
      saveFollowedProducersToStorage()
    }
  }

  const unfollowProducer = (producerId) => {
    followedProducers.value = followedProducers.value.filter(id => id !== producerId)
    saveFollowedProducersToStorage()
  }

  const loadFollowedProducers = () => {
    loadFollowedProducersFromStorage()
    return followedProducers.value
  }

  // 初期化時にフォロー状態を読み込む
  loadFollowedProducersFromStorage()

  return {
    producers: producersList,
    followedProducers,
    getProducerById,
    isFollowing,
    followProducer,
    unfollowProducer,
    loadFollowedProducers
  }
})