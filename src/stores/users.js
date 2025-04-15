import { defineStore } from 'pinia'
import { ref } from 'vue'
import { users } from '@/data/users'

export const useUsersStore = defineStore('users', () => {
  const usersList = ref([...users])

  const addUser = (user) => {
    usersList.value.push(user)
  }

  const getUserByEmail = (email) => {
    return usersList.value.find(user => user.email === email)
  }

  const getUserById = (id) => {
    return usersList.value.find(user => user.id === id)
  }

  const getUserByWallet = (address) => {
    return usersList.value.find(user => user.wallet_address === address)
  }

  return {
    users: usersList,
    addUser,
    getUserByEmail,
    getUserById,
    getUserByWallet
  }
})