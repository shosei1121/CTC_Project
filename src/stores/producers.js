import { defineStore } from 'pinia'
import { ref } from 'vue'
import { producers } from '@/data/producers'

export const useProducersStore = defineStore('producers', () => {
  const producersList = ref([...producers])
  const followedProducers = ref([])

  const getProducerById = (id) => {
    return producersList.value.find(producer => producer.id === id)
  }

  const isFollowing = (producerId) => {
    return followedProducers.value.includes(producerId)
  }

  const followProducer = (producerId) => {
    if (!isFollowing(producerId)) {
      followedProducers.value.push(producerId)
    }
  }

  const unfollowProducer = (producerId) => {
    followedProducers.value = followedProducers.value.filter(id => id !== producerId)
  }

  const loadFollowedProducers = () => {
    // 将来的にはAPIから取得する
    return followedProducers.value
  }

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