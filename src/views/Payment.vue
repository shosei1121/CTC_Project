<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePaymentStore } from '@/stores/payment'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const paymentStore = usePaymentStore()

const product = ref({
  id: route.params.id,
  name: route.query.name,
  price: parseInt(route.query.price, 10),
  image: route.query.image
})

const selectedMethod = ref('credit')
const error = ref(null)

const pointBalance = computed(() => authStore.user?.points || 0)
const canPayWithPoints = computed(() => pointBalance.value >= product.value.price)

const handleContinue = () => {
  paymentStore.setPaymentMethod(selectedMethod.value)
  paymentStore.setProductDetails(product.value)
  
  if (selectedMethod.value === 'credit') {
    router.push({
      name: 'credit-card',
      params: { id: product.value.id }
    })
  } else {
    router.push({
      name: 'payment-confirm',
      params: { id: product.value.id }
    })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        お支払い
      </h1>

      <!-- 商品情報 -->
      <div class="flex items-center gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <img
          :src="product.image"
          :alt="product.name"
          class="w-20 h-20 object-cover rounded"
        />
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ product.name }}
          </h2>
          <div class="flex gap-2 mt-1">
            <p class="text-gray-600 dark:text-gray-300">
              ¥{{ product.price.toLocaleString() }}
            </p>
            <p class="text-gray-600 dark:text-gray-300">
              または {{ product.price.toLocaleString() }}ポイント
            </p>
          </div>
        </div>
      </div>

      <!-- 支払い方法選択 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          支払い方法を選択
        </h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            <input
              type="radio"
              v-model="selectedMethod"
              value="credit"
              class="text-blue-500"
            />
            <span class="text-gray-900 dark:text-white">クレジットカード</span>
          </label>
          
          <label
            class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'opacity-50 cursor-not-allowed': !canPayWithPoints }"
          >
            <input
              type="radio"
              v-model="selectedMethod"
              value="points"
              :disabled="!canPayWithPoints"
              class="text-blue-500"
            />
            <div>
              <span class="text-gray-900 dark:text-white">ポイント払い</span>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                現在の保有ポイント: {{ pointBalance.toLocaleString() }}
              </p>
            </div>
          </label>
        </div>
      </div>

      <!-- エラーメッセージ -->
      <div
        v-if="error"
        class="mb-6 p-4 bg-red-100 text-red-700 rounded-lg"
      >
        {{ error }}
      </div>

      <!-- 次へボタン -->
      <button
        @click="handleContinue"
        class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        次へ進む
      </button>
    </div>
  </div>
</template>