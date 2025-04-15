<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProducersStore } from '@/stores/producers'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const producersStore = useProducersStore()

const producer = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    const producerData = producersStore.getProducerById(route.params.id)
    if (!producerData) {
      throw new Error('プロデューサーが見つかりません')
    }
    producer.value = producerData
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const handleFollow = () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }

  if (producersStore.isFollowing(producer.value.id)) {
    producersStore.unfollowProducer(producer.value.id)
  } else {
    producersStore.followProducer(producer.value.id)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else-if="producer" class="max-w-4xl mx-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div class="relative h-64">
          <img
            :src="producer.avatar"
            :alt="producer.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-3xl font-bold text-white">
                  {{ producer.name }}
                </h1>
                <p class="text-white/90">{{ producer.location }}</p>
              </div>
              <button
                @click="handleFollow"
                class="px-6 py-2 rounded-full text-sm font-medium transition-colors"
                :class="[
                  producersStore.isFollowing(producer.id)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-white text-blue-500 hover:bg-blue-50'
                ]"
              >
                {{ producersStore.isFollowing(producer.id) ? 'フォロー中' : 'フォローする' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">プロフィール</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ producer.bio }}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">統計情報</h2>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ producer.rating }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">評価</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ producer.followers }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">フォロワー</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ producer.artworks }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">作品数</div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">ソーシャルメディア</h2>
            <div class="flex gap-4">
              <a
                v-if="producer.social.twitter"
                :href="'https://twitter.com/' + producer.social.twitter"
                target="_blank"
                class="text-blue-500 hover:text-blue-600"
              >
                Twitter
              </a>
              <a
                v-if="producer.social.instagram"
                :href="'https://instagram.com/' + producer.social.instagram"
                target="_blank"
                class="text-pink-500 hover:text-pink-600"
              >
                Instagram
              </a>
              <a
                v-if="producer.social.website"
                :href="producer.social.website"
                target="_blank"
                class="text-gray-500 hover:text-gray-600"
              >
                ウェブサイト
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>