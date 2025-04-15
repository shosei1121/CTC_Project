<script setup>
import { ref } from 'vue'
import NewsList from '@/components/news/NewsList.vue'

const features = ref([
  {
    title: '地域コミュニティ',
    description: '地域の生産者と直接つながり、コミュニティを支援',
    icon: '🏘️'
  },
  {
    title: 'ブロックチェーン',
    description: 'ブロックチェーン技術による安全で透明な取引',
    icon: '⛓️'
  },
  {
    title: 'NFT統合',
    description: '地域商品の真正性を証明するデジタル証明書',
    icon: '🎨'
  }
])
</script>

<template>
  <div class="space-y-12">
    <section class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        CTCマーケットプレイスへようこそ
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
        ブロックチェーンで地域をつなぐ、新しい取引の形
      </p>
      <RouterLink
        to="/marketplace"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        マーケットを見る
      </RouterLink>
    </section>

    <NewsList />

    <section class="grid md:grid-cols-3 gap-8">
      <div
        v-for="feature in features"
        :key="feature.title"
        class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      >
        <div class="text-4xl mb-4">{{ feature.icon }}</div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {{ feature.title }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          {{ feature.description }}
        </p>
      </div>
    </section>
  </div>
</template>