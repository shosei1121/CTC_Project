<script setup>
import { ref, onMounted, computed } from 'vue'
import { useNftsStore } from '@/stores/nfts'

const nftsStore = useNftsStore()
const nfts = ref([])
const loading = ref(true)
const error = ref(null)

// ソートオプション
const sortOptions = [
  { value: 'price-asc', label: '価格の安い順' },
  { value: 'price-desc', label: '価格の高い順' },
  { value: 'rating-desc', label: '評価の高い順' },
  { value: 'name-asc', label: '名前順（A-Z）' },
  { value: 'name-desc', label: '名前順（Z-A）' },
  { value: 'sales-desc', label: '販売数の多い順' }
]

const selectedSort = ref('price-asc')

// ソートされたNFTリスト
const sortedNfts = computed(() => {
  const nftsList = [...nfts.value]
  
  switch (selectedSort.value) {
    case 'price-asc':
      return nftsList.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return nftsList.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return nftsList.sort((a, b) => b.rating - a.rating)
    case 'name-asc':
      return nftsList.sort((a, b) => a.name.localeCompare(b.name, 'ja'))
    case 'name-desc':
      return nftsList.sort((a, b) => b.name.localeCompare(a.name, 'ja'))
    case 'sales-desc':
      return nftsList.sort((a, b) => b.sales - a.sales)
    default:
      return nftsList
  }
})

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
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        NFTマーケットプレイス
      </h1>
      
      <div class="flex items-center space-x-4">
        <label for="sort" class="text-sm font-medium text-gray-700 dark:text-gray-300">並び替え:</label>
        <select
          id="sort"
          v-model="selectedSort"
          class="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="nft in sortedNfts"
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