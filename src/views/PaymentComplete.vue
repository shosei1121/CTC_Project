<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBackToMarketplace = () => {
  router.push('/marketplace')
}
</script>

<template>
  <div class="max-w-2xl mx-auto text-center">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div class="text-5xl mb-6">🎉</div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        ご購入ありがとうございます！
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        商品の発送準備が整い次第、メールにてお知らせいたします。
      </p>
      <button
        @click="handleBackToMarketplace"
        class="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
      >
        マーケットプレイスに戻る
      </button>
    </div>
  </div>
</template>