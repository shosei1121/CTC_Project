<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const authStore = useAuthStore()
const profile = ref(null)
const loading = ref(true)
const error = ref(null)

const loadProfile = async () => {
  try {
    const { data, error: err } = await supabase
      .from('producer_profiles')
      .select('*')
      .eq('id', authStore.user.id)
      .single()
    
    if (err) throw err
    profile.value = data
  } catch (err) {
    error.value = 'プロフィールの読み込みに失敗しました'
    console.error('Error loading profile:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
      生産者ダッシュボード
    </h1>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">読み込み中...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
      {{ error }}
    </div>

    <div v-else-if="!profile" class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300">プロフィールが見つかりません</p>
    </div>

    <div v-else class="grid gap-8">
      <!-- プロフィール情報 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          プロフィール情報
        </h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <img
              :src="profile.image"
              :alt="profile.name"
              class="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ profile.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ profile.location }}
              </p>
            </div>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">説明</h4>
            <p class="text-gray-600 dark:text-gray-300">
              {{ profile.description }}
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">主な生産物</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="specialty in profile.specialties"
                :key="specialty"
                class="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-sm"
              >
                {{ specialty }}
              </span>
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">認証</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cert in profile.certifications"
                :key="cert"
                class="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-sm"
              >
                {{ cert }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 注文管理 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          注文管理
        </h2>
        <p class="text-gray-600 dark:text-gray-300 text-center py-8">
          注文はありません
        </p>
      </div>
    </div>
  </div>
</template>