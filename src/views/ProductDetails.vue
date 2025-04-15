<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const product = ref({
  id: route.params.id,
  name: '春の桜デジタルアート',
  price: '50,000',
  artist: 'Sakura Tanaka',
  artistId: '550e8400-e29b-41d4-a716-446655440000', // 有効なUUID形式に修正
  rating: 4.8,
  sales: 3,
  image: 'https://images.unsplash.com/photo-1615032951263-7b3ee8e71fb8',
  description: '日本の伝統と現代アートを融合させた桜のデジタルアート作品。各作品には固有のトークンIDが付与され、ブロックチェーン上で所有権が保証されます。',
  edition: '10点限定',
  blockchain: 'Ethereum',
  details: {
    created: '2024-03-15',
    size: '3000x2000px',
    format: 'PNG',
    includes: ['オリジナルデジタルファイル', '所有権証明NFT', '作者直筆サイン入りデジタル証明書']
  }
})

const handlePurchase = () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  
  router.push({
    name: 'payment',
    params: { id: product.value.id },
    query: {
      name: product.value.name,
      price: product.value.price.replace(/,/g, ''),
      image: product.value.image
    }
  })
}

const handleContactArtist = () => {
  router.push({
    name: 'producer-details',
    params: { id: product.value.artistId }
  })
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-[500px] object-cover"
      />
      <div class="p-6">
        <div class="flex items-start justify-between mb-4">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ product.name }}
          </h1>
          <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-lg">
            {{ product.blockchain }}
          </span>
        </div>

        <div class="flex justify-between items-start mb-6">
          <div>
            <div class="text-2xl font-bold text-blue-600 mb-1">
              ¥{{ product.price }}
            </div>
            <div class="text-gray-600 dark:text-gray-300">
              または {{ product.price }}ポイント
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {{ product.artist }}
            </p>
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <span class="text-yellow-400 mr-1">★</span>
              {{ product.rating }}
              <span class="mx-1">•</span>
              {{ product.sales }}点販売
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            作品について
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            {{ product.description }}
          </p>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 dark:text-white mb-3">
              作品詳細
            </h3>
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-gray-500 dark:text-gray-400">エディション</dt>
                <dd class="text-gray-900 dark:text-white">{{ product.edition }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500 dark:text-gray-400">作成日</dt>
                <dd class="text-gray-900 dark:text-white">{{ product.details.created }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500 dark:text-gray-400">サイズ</dt>
                <dd class="text-gray-900 dark:text-white">{{ product.details.size }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500 dark:text-gray-400">フォーマット</dt>
                <dd class="text-gray-900 dark:text-white">{{ product.details.format }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            含まれるもの
          </h2>
          <ul class="space-y-2">
            <li
              v-for="(item, index) in product.details.includes"
              :key="index"
              class="flex items-center text-gray-600 dark:text-gray-300"
            >
              <span class="mr-2">✓</span>
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