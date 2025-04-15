<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'

const router = useRouter()
const paymentStore = usePaymentStore()

const product = paymentStore.productDetails
const paymentMethod = paymentStore.paymentMethod
const creditCard = computed(() => paymentStore.creditCardDetails)

const handleConfirm = async () => {
  const { success } = await paymentStore.processPayment(
    product.price,
    paymentMethod
  )

  if (success) {
    router.push({
      name: 'payment-complete',
      params: { id: product.id }
    })
  }
}

const handleBack = () => {
  if (paymentMethod === 'credit') {
    router.push({
      name: 'credit-card',
      params: { id: product.id }
    })
  } else {
    router.push({
      name: 'payment',
      params: { id: product.id }
    })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        ご注文内容の確認
      </h1>

      <!-- 商品情報 -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">商品</h2>
        <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <img
            :src="product.image"
            :alt="product.name"
            class="w-20 h-20 object-cover rounded"
          />
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ product.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              ¥{{ product.price.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- 支払い情報 -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">お支払い方法</h2>
        <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <template v-if="paymentMethod === 'credit'">
            <p class="text-gray-900 dark:text-white font-medium">クレジットカード</p>
            <p class="text-gray-600 dark:text-gray-300">
              {{ creditCard.number.slice(-4).padStart(16, '•') }}
            </p>
            <p class="text-gray-600 dark:text-gray-300">
              有効期限: {{ creditCard.expiry }}
            </p>
          </template>
          <template v-else>
            <p class="text-gray-900 dark:text-white font-medium">ポイント払い</p>
            <p class="text-gray-600 dark:text-gray-300">
              {{ product.price.toLocaleString() }}ポイント
            </p>
          </template>
        </div>
      </div>

      <!-- 合計金額 -->
      <div class="mb-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold text-gray-900 dark:text-white">合計</span>
          <span class="text-xl font-bold text-blue-600 dark:text-blue-400">
            {{ paymentMethod === 'credit' ? '¥' : '' }}{{ product.price.toLocaleString() }}
            {{ paymentMethod === 'points' ? 'ポイント' : '' }}
          </span>
        </div>
      </div>

      <div class="flex gap-4">
        <button
          @click="handleBack"
          class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
        >
          戻る
        </button>
        <button
          @click="handleConfirm"
          class="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          注文を確定する
        </button>
      </div>
    </div>
  </div>
</template>