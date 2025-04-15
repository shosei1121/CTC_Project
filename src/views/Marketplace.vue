<script setup>
import { ref } from 'vue'

const products = ref([
  {
    id: 1,
    name: '春の桜デジタルアート',
    price: '50,000',
    artist: 'Sakura Tanaka',
    rating: 4.8,
    sales: 3,
    image: 'https://images.unsplash.com/photo-1615032951263-7b3ee8e71fb8',
    description: '日本の伝統と現代アートを融合させた桜のデジタルアート作品',
    edition: '10点限定',
    blockchain: 'Ethereum'
  },
  {
    id: 2,
    name: '未来都市2050',
    price: '75,000',
    artist: 'Neo Artist',
    rating: 4.9,
    sales: 5,
    image: 'https://images.unsplash.com/photo-1510906594845-bc082582c8cc',
    description: '2050年の東京をイメージした未来的なデジタルアート',
    edition: '5点限定',
    blockchain: 'Polygon'
  },
  {
    id: 3,
    name: '和モダンアブストラクト',
    price: '45,000',
    artist: 'Modern Zen',
    rating: 4.7,
    sales: 2,
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968',
    description: '禅の思想をモダンアートで表現したデジタル作品',
    edition: '15点限定',
    blockchain: 'Ethereum'
  }
])

const sortOptions = ref([
  { id: 'name', label: '作品名順' },
  { id: 'price', label: '価格順' },
  { id: 'rating', label: '評価順' }
])

const categories = ref([
  { id: 'all', label: 'すべて' },
  { id: 'abstract', label: '抽象画' },
  { id: 'digital', label: 'デジタルアート' },
  { id: 'photography', label: 'フォトアート' }
])

const selectedSort = ref('name')
const selectedCategory = ref('all')
</script>

<template>
  <div>
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        NFTアートマーケットプレイス
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300">
        限定デジタルアート作品をブロックチェーンで安全に取引
      </p>
    </div>

    <div class="mb-8 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <select
          v-model="selectedCategory"
          class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.label }}
          </option>
        </select>
      </div>

      <div class="flex gap-2">
        <button
          v-for="option in sortOptions"
          :key="option.id"
          :class="[
            'px-4 py-2 rounded-lg text-sm',
            selectedSort === option.id
              ? 'bg-blue-500 text-white'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          ]"
          @click="selectedSort = option.id"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        v-for="product in products"
        :key="product.id"
        :to="`/product/${product.id}`"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
      >
        <div class="relative">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {{ product.edition }}
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ product.name }}
            </h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded text-sm">
              {{ product.blockchain }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {{ product.description }}
          </p>
          
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-bold text-blue-600 mb-1">
                ¥{{ product.price }}
              </p>
              <p class="text-sm text-gray-500">
                {{ product.price }}ポイント
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {{ product.artist }}
              </p>
              <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span class="text-yellow-400 mr-1">★</span>
                {{ product.rating }}
                <span class="mx-1">•</span>
                {{ product.sales }}点販売
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>