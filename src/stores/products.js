import { defineStore } from 'pinia'
import { ref } from 'vue'
import { products } from '@/data/products'

export const useProductsStore = defineStore('products', () => {
  const productsList = ref([...products])

  const getProductById = (id) => {
    return productsList.value.find(product => product.id === id)
  }

  const getProductsByArtist = (artistId) => {
    return productsList.value.filter(product => product.artistId === artistId)
  }

  const addProduct = (product) => {
    productsList.value.push(product)
  }

  return {
    products: productsList,
    getProductById,
    getProductsByArtist,
    addProduct
  }
}) 