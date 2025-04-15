<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNftsStore } from '@/stores/nfts'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const nftsStore = useNftsStore()
const nft = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    const nftData = nftsStore.getNftById(route.params.id)
    if (!nftData) {
      throw new Error('NFTが見つかりません')
    }
    nft.value = nftData
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

const handlePurchase = () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  
  router.push({
    name: 'payment',
    params: { id: nft.value.id },
    query: {
      name: nft.value.name,
      price: nft.value.price.replace(/,/g, ''),
      image: nft.value.image
    }
  })
}

const handleContactArtist = () => {
  if (!nft.value?.artistId) {
    error.value = '生産者情報が見つかりません'
    return
  }
  
  const producerId = String(nft.value.artistId)
  
  router.push({
    name: 'producer-details',
    params: { id: producerId }
  })
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

    <div v-else-if="nft" class="grid md:grid-cols-2 gap-8">
      <div class="relative">
        <img
          :src="nft.image"
          :alt="nft.name"
          class="w-full rounded-lg shadow-lg"
        />
        <div class="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {{ nft.edition }}
        </div>
      </div>

      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {{ nft.name }}
        </h1>

        <div class="flex items-center justify-between mb-6">
          <div class="text-3xl font-bold text-blue-600">
            ¥{{ nft.price }}
          </div>
          <div class="flex items-center text-gray-600 dark:text-gray-300">
            <span class="text-yellow-400 mr-1">★</span>
            {{ nft.rating }}
            <span class="mx-1">•</span>
            {{ nft.sales }}点販売
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            作品の説明
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ nft.description }}
          </p>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            詳細情報
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">アーティスト</p>
              <p class="text-gray-900 dark:text-white">{{ nft.artist }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">ブロックチェーン</p>
              <p class="text-gray-900 dark:text-white">{{ nft.blockchain }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">作成日</p>
              <p class="text-gray-900 dark:text-white">{{ nft.details.created }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">サイズ</p>
              <p class="text-gray-900 dark:text-white">{{ nft.details.size }}</p>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            含まれるもの
          </h2>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-300">
            <li v-for="(item, index) in nft.details.includes" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>

        <div class="flex gap-4">
          <button 
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            @click="handleContactArtist"
          >
            生産者の詳細を見る
          </button>
          <button 
            class="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            @click="handlePurchase"
          >
            購入する
          </button>
        </div>
      </div>
    </div>
  </div>
</template>