import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePaymentStore = defineStore('payment', () => {
  const paymentMethod = ref('credit')
  const processing = ref(false)
  const error = ref(null)
  const productDetails = ref(null)
  const creditCardDetails = ref(null)

  function setPaymentMethod(method) {
    paymentMethod.value = method
  }

  function setProductDetails(details) {
    productDetails.value = details
  }

  function setCreditCardDetails(details) {
    creditCardDetails.value = details
  }

  async function processPayment(amount, method) {
    processing.value = true
    error.value = null
    
    try {
      // 実際の決済処理をここに実装
      await new Promise(resolve => setTimeout(resolve, 1000)) // デモ用の遅延
      return { success: true }
    } catch (e) {
      error.value = '決済処理に失敗しました'
      return { success: false, error: error.value }
    } finally {
      processing.value = false
    }
  }

  return {
    paymentMethod,
    processing,
    error,
    productDetails,
    creditCardDetails,
    setPaymentMethod,
    setProductDetails,
    setCreditCardDetails,
    processPayment
  }
})