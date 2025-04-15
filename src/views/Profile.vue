<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProducerStore } from '@/stores/producer'

const authStore = useAuthStore()
const producerStore = useProducerStore()

const user = ref({
  name: 'shosei723',
  email: 'shosei723@rakuten.jp',
  points: 0,
  walletConnected: false,
  nfts: []
})

onMounted(() => {
  if (authStore.isAuthenticated) {
    producerStore.loadFollowedProducers()
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Profile Card -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-start space-x-4">
        <div class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <span class="text-2xl">👤</span>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ user.name }}
              <span class="text-sm font-normal text-gray-500 ml-2">編集</span>
            </h2>
          </div>
          <p class="text-gray-600 dark:text-gray-300">{{ user.email }}</p>
          <div class="flex items-center mt-2">
            <span class="text-yellow-500">🏆</span>
            <span class="ml-1 text-gray-600 dark:text-gray-300">{{ user.points }} ポイント</span>
          </div>
        </div>
      </div>
      
      <button class="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center">
        <span class="mr-2">🦊</span>
        MetaMask接続
      </button>
    </div>

    <!-- NFTs -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">所有NFT</h3>
      <div class="text-gray-600 dark:text-gray-300 text-center py-8">
        所有しているNFTはありません
      </div>
    </div>

    <!-- Following Producers -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">フォロー中の生産者</h3>
      <div v-if="producerStore.followedProducers.length === 0" class="text-gray-600 dark:text-gray-300 text-center py-8">
        フォロー中の生産者はいません
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="follow in producerStore.followedProducers"
          :key="follow.producer_id"
          class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <img
            :src="follow.producer_profiles.image"
            :alt="follow.producer_profiles.name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white">
              {{ follow.producer_profiles.name }}
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              {{ follow.producer_profiles.location }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">取引履歴</h3>
      <div class="text-gray-600 dark:text-gray-300 text-center py-8">
        取引履歴はありません
      </div>
    </div>
  </div>
</template>