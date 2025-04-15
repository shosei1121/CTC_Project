<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProducerStore } from '@/stores/producer'
import { supabase } from '@/lib/supabase'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const producerStore = useProducerStore()

const producer = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    const producerId = route.params.id

    if (!producerId) {
      throw new Error('生産者IDが指定されていません')
    }

    // Supabaseから生産者情報を取得
    const { data, error: err } = await supabase
      .from('producer_profiles')
      .select('*')
      .eq('id', producerId)
      .single()

    if (err) {
      console.error('Supabase error:', err)
      throw new Error('生産者情報の取得に失敗しました')
    }

    if (!data) {
      throw new Error('プロデューサーが見つかりません')
    }

    producer.value = data

    // フォロー中の生産者を読み込む
    if (authStore.isAuthenticated) {
      await producerStore.loadFollowedProducers()
    }
  } catch (e) {
    console.error('Error:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const handleFollow = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }

  try {
    if (producerStore.isFollowing(producer.value.id)) {
      await producerStore.unfollowProducer(producer.value.id)
    } else {
      await producerStore.followProducer(producer.value.id)
    }
  } catch (e) {
    console.error('Follow error:', e)
    error.value = e.message
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
            :src="producer.image || '/default-producer.jpg'"
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
                v-if="authStore.isAuthenticated"
                @click="handleFollow"
                class="px-6 py-2 rounded-full text-sm font-medium transition-colors"
                :class="[
                  producerStore.isFollowing(producer.id)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-white text-blue-500 hover:bg-blue-50'
                ]"
              >
                {{ producerStore.isFollowing(producer.id) ? 'フォロー中' : 'フォローする' }}
              </button>
              <button
                v-else
                @click="router.push('/auth')"
                class="px-6 py-2 rounded-full text-sm font-medium bg-white text-blue-500 hover:bg-blue-50 transition-colors"
              >
                ログインしてフォロー
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-6">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">プロフィール</h2>
            <p class="text-gray-600 dark:text-gray-300">{{ producer.description || 'プロフィールはありません' }}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">統計情報</h2>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ producer.rating || 0 }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">評価</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ producer.followers || 0 }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">フォロワー</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ producer.artworks || 0 }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">作品数</div>
              </div>
            </div>
          </div>

          <div v-if="producer.specialties?.length" class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">主な生産物</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="specialty in producer.specialties"
                :key="specialty"
                class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
              >
                {{ specialty }}
              </span>
            </div>
          </div>

          <div v-if="producer.certifications?.length" class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">認証</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cert in producer.certifications"
                :key="cert"
                class="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm"
              >
                {{ cert }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>