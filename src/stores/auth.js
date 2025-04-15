import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from './users'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const usersStore = useUsersStore()
  
  const user = ref(null)
  const loading = ref(false)
  const returnPath = ref('/')
  const walletAddress = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isProducer = computed(() => user.value?.role === 'producer')
  const isMetaMaskUser = computed(() => !!walletAddress.value)

  async function signUp(email, password) {
    try {
      loading.value = true
      
      // Check if user already exists
      if (usersStore.getUserByEmail(email)) {
        throw new Error('このメールアドレスは既に登録されています')
      }

      // Create new user
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password,
        role: 'user',
        created_at: new Date().toISOString()
      }

      usersStore.addUser(newUser)
      user.value = newUser
      
      router.push(returnPath.value)
      return { data: newUser, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  async function signIn(email, password, isAdminLogin = false) {
    try {
      loading.value = true
      
      const foundUser = usersStore.getUserByEmail(email)
      if (!foundUser || foundUser.password !== password) {
        throw new Error('メールアドレスまたはパスワードが正しくありません')
      }

      // 管理者ログインの場合
      if (isAdminLogin) {
        if (foundUser.role === 'user') {
          throw new Error('管理者または生産者アカウントでログインしてください')
        }
      } else {
        // 購入者ログインの場合
        if (foundUser.role !== 'user') {
          throw new Error('購入者アカウントでログインしてください')
        }
      }

      user.value = foundUser

      if (foundUser.role === 'admin') {
        router.push('/admin')
      } else if (foundUser.role === 'producer') {
        router.push('/producer/dashboard')
      } else {
        router.push(returnPath.value)
      }

      return { data: foundUser, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  async function signInWithMetaMask(address) {
    try {
      loading.value = true
      
      let foundUser = usersStore.getUserByWallet(address)
      if (!foundUser) {
        foundUser = {
          id: crypto.randomUUID(),
          wallet_address: address,
          role: 'user',
          created_at: new Date().toISOString()
        }
        usersStore.addUser(foundUser)
      }

      user.value = foundUser
      walletAddress.value = address
      
      return { data: foundUser, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  function signOut() {
    user.value = null
    walletAddress.value = null
    returnPath.value = '/'
    router.push('/auth')
  }

  function setReturnPath(path) {
    returnPath.value = path
  }

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isProducer,
    isMetaMaskUser,
    walletAddress,
    signUp,
    signIn,
    signInWithMetaMask,
    signOut,
    setReturnPath
  }
})