<script setup>
import { ref, onMounted } from 'vue'
import { useNftsStore } from '@/stores/nfts'

const nftsStore = useNftsStore()
const nfts = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    nfts.value = nftsStore.nfts
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">
      NFTマーケットプレイス
    </h1>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="nft in nfts"
        :key="nft.id"
        :to="`/product/${nft.id}`"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
      >
        <div class="relative">
          <img
            :src="nft.image"
            :alt="nft.name"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {{ nft.edition }}
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ nft.name }}
            </h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-sm">
              {{ nft.blockchain }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {{ nft.description }}
          </p>
          
          <div class="flex items-center justify-between">
            <div class="text-2xl font-bold text-blue-600">
              ¥{{ nft.price }}
            </div>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <span class="text-yellow-400 mr-1">★</span>
              {{ nft.rating }}
              <span class="mx-1">•</span>
              {{ nft.sales }}点販売
            </div>
          </div>
          
          <div class="mt-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ nft.artist }}
            </p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>