import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProducersStore = defineStore('producers', () => {
  const producers = ref([
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Sakura Tanaka',
      location: '長野県安曇野市',
      since: '2010年',
      image: 'https://images.unsplash.com/photo-1622030411594-c282a63aa1bc',
      description: '代々続く農家の4代目。自然と調和した持続可能な農業を実践しています。特に果物栽培に力を入れており、リンゴやブドウの栽培を行っています。',
      specialties: ['リンゴ', 'ブドウ', '桃'],
      certifications: ['有機JAS認証', 'GLOBALG.A.P.認証'],
      farm_details: {
        size: '5ヘクタール',
        mainCrops: 'りんご、ぶどう、桃',
        farming: '有機農法',
        shipping: '全国発送可能'
      },
      contact: {
        email: 'sakura@example.com',
        phone: '0263-XX-XXXX',
        hours: '9:00-17:00（土日祝休）'
      },
      created_at: '2024-04-14T00:00:00Z'
    }
  ])

  const follows = ref([])

  const addProducer = (producer) => {
    producers.value.push(producer)
  }

  const getProducerById = (id) => {
    return producers.value.find(producer => producer.id === id)
  }

  const followProducer = (userId, producerId) => {
    follows.value.push({
      id: crypto.randomUUID(),
      user_id: userId,
      producer_id: producerId,
      created_at: new Date().toISOString()
    })
  }

  const unfollowProducer = (userId, producerId) => {
    follows.value = follows.value.filter(
      follow => !(follow.user_id === userId && follow.producer_id === producerId)
    )
  }

  const getFollowedProducers = (userId) => {
    const userFollows = follows.value.filter(follow => follow.user_id === userId)
    return userFollows.map(follow => getProducerById(follow.producer_id))
  }

  return {
    producers,
    follows,
    addProducer,
    getProducerById,
    followProducer,
    unfollowProducer,
    getFollowedProducers
  }
})