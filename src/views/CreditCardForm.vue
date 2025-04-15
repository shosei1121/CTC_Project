<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePaymentStore } from '@/stores/payment'

const router = useRouter()
const paymentStore = usePaymentStore()
const product = paymentStore.productDetails

const cardNumber = ref('')
const cardName = ref('')
const expiry = ref('')
const cvc = ref('')
const error = ref(null)

const formatCardNumber = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  const matches = v.match(/\d{4,16}/g)
  const match = (matches && matches[0]) || ''
  const parts = []

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4))
  }

  if (parts.length) {
    return parts.join(' ')
  } else {
    return value
  }
}

const formatExpiry = (value) => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
  if (v.length >= 2) {
    return v.slice(0, 2) + '/' + v.slice(2, 4)
  }
  return v
}

const handleSubmit = () => {
  if (!cardNumber.value || !cardName.value || !expiry.value || !cvc.value) {
    error.value = 'すべての項目を入力してください'
    return
  }

  paymentStore.setCreditCardDetails({
    number: cardNumber.value,
    name: cardName.value,
    expiry: expiry.value,
    cvc: cvc.value
  })

  router.push({
    name: 'payment-confirm',
    params: { id: product.id }
  })
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        クレジットカード情報
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
          <p class="text-gray-600 dark:text-gray-300">
            ¥{{ product.price.toLocaleString() }}
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg">
          {{ error }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            カード番号
          </label>
          <input
            v-model="cardNumber"
            type="text"
            maxlength="19"
            placeholder="4242 4242 4242 4242"
            @input="cardNumber = formatCardNumber($event.target.value)"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            カード名義
          </label>
          <input
            v-model="cardName"
            type="text"
            placeholder="TARO YAMADA"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white uppercase"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              有効期限
            </label>
            <input
              v-model="expiry"
              type="text"
              maxlength="5"
              placeholder="MM/YY"
              @input="expiry = formatExpiry($event.target.value)"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              セキュリティコード
            </label>
            <input
              v-model="cvc"
              type="text"
              maxlength="4"
              placeholder="123"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          確認画面へ
        </button>
      </form>
    </div>
  </div>
</template>