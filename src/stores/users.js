import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('users', () => {
  const users = ref([
    {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'admin@example.com',
      password: 'admin123', // In production, never store plain text passwords
      role: 'admin',
      created_at: '2024-04-14T00:00:00Z'
    },
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'producer@example.com',
      password: 'producer123',
      role: 'producer',
      created_at: '2024-04-14T00:00:00Z'
    }
  ])

  const addUser = (user) => {
    users.value.push(user)
  }

  const getUserByEmail = (email) => {
    return users.value.find(user => user.email === email)
  }

  const getUserById = (id) => {
    return users.value.find(user => user.id === id)
  }

  const getUserByWallet = (address) => {
    return users.value.find(user => user.wallet_address === address)
  }

  return {
    users,
    addUser,
    getUserByEmail,
    getUserById,
    getUserByWallet
  }
})