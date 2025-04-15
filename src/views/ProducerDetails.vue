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

const loadProducer = async () => {
  try {
    const { data, error } = await supabase
      .from('producer_profiles')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error
    producer.value = data
  } catch (err) {
    console.error('Error loading producer:', err)
  } finally {
    loading.value = false
  }
}

const handleFollow = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }

  if (producerStore.isFollowing(producer.value.id)) {
    await producerStore.unfollowProducer(producer.value.id)
  } else {
    await producerStore.followProducer(producer.value.id)
  }
}

onMounted(async () => {
  await loadProducer()
  if (authStore.isAuthenticated) {
    await producerStore.loadFollowedProducers()
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">読み込み中...</p>
    </div>

    <div v-else-if="!producer" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">生産者が見つかりませんでした</p>
    </div>

    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
      <div class="relative h-64">
        <img
          :src="producer.image"
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
                producerStore.isFollowing(producer.id)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white text-blue-500 hover:bg-blue-50'
              ]"
            >
              {{ producerStore.isFollowing(producer.id) ? 'フォロー中' : 'フォローする' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="p-6">
        <div class="mb-6">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
            <span>🌱 {{ producer.since }}から営農</span>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            農園について
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ producer.description }}
          </p>
        </div>

        <!-- 認証・特徴 -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-3">
              主な生産物
            </h3>
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
          <div>
            <h3 class="font-medium text-gray-900 dark:text-white mb-3">
              認証
            </h3>
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

        <!-- 農園詳細 -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-8">
          <h3 class="font-medium text-gray-900 dark:text-white mb-3">
            農園情報
          </h3>
          <dl class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-gray-500 dark:text-gray-400">農園面積</dt>
              <dd class="text-gray-900 dark:text-white">{{ producer.farm_details.size }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-500 dark:text-gray-400">主な作物</dt>
              <dd class="text-gray-900 dark:text-white">{{ producer.farm_details.mainCrops }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-500 dark:text-gray-400">農法</dt>
              <dd class="text-gray-900 dark:text-white">{{ producer.farm_details.farming }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-500 dark:text-gray-400">配送</dt>
              <dd class="text-gray-900 dark:text-white">{{ producer.farm_details.shipping }}</dd>
            </div>
          </dl>
        </div>

        <!-- 連絡先 -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 class="font-medium text-gray-900 dark:text-white mb-3">
            連絡先
          </h3>
          <dl class="grid grid-cols-2 gap-4">
            <div>
              <dt class="text-sm text-gray-500 dark:text-gray-400">メール</dt>
              <dd class="text-gray-900 dark:text-white">{{ producer.contact.email }}</dd>
            </div>
            <div>
              <dt class="text-sm text-gray-500 dark:text-gray-400">電話番号</dt>
              <dd class="text-gray-900 dark:text-white">{{ producer.contact.phone }}</dd>
            </div>
            <div class="col-span-2">
              <dt class="text-sm text-gray-500 dark:text-gray-400">営業時間</dt>
              <dd class="text-gray-900 dark:text-white">{{ producer.contact.hours }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>