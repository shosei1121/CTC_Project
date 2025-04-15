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
  const isMetaMaskConnected = ref(false)

  const isAuthenticated = computed(() => !!user.value || !!walletAddress.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isProducer = computed(() => user.value?.role === 'producer')
  const isMetaMaskUser = computed(() => !!walletAddress.value)

  // メタマスクの接続状態を確認
  const checkMetaMaskConnection = async () => {
    if (typeof window.ethereum === 'undefined') {
      return false
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        walletAddress.value = accounts[0]
        isMetaMaskConnected.value = true
        return true
      }
      return false
    } catch (error) {
      console.error('Error checking MetaMask connection:', error)
      return false
    }
  }

  // メタマスクに接続
  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMaskがインストールされていません')
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        walletAddress.value = accounts[0]
        isMetaMaskConnected.value = true
        await signInWithMetaMask(accounts[0])
        return true
      }
      return false
    } catch (error) {
      console.error('Error connecting to MetaMask:', error)
      throw error
    }
  }

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
      isMetaMaskConnected.value = true

      router.push(returnPath.value)
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
    isMetaMaskConnected.value = false
    router.push('/')
  }

  function setReturnPath(path) {
    returnPath.value = path
  }

  // 初期化時にメタマスクの接続状態を確認
  checkMetaMaskConnection()

  return {
    user,
    loading,
    walletAddress,
    isMetaMaskConnected,
    isAuthenticated,
    isAdmin,
    isProducer,
    isMetaMaskUser,
    signUp,
    signIn,
    signInWithMetaMask,
    signOut,
    setReturnPath,
    connectMetaMask,
    checkMetaMaskConnection
  }
})