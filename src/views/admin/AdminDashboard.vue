<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Line, Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useProducersStore } from '@/stores/producers'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const producersStore = useProducersStore()

const loading = ref(true)
const error = ref(null)
const currentSection = ref('dashboard')

// セクション管理
watch(() => route.query.section, (newSection) => {
  currentSection.value = newSection || 'dashboard'
}, { immediate: true })

// チャートデータ
const salesData = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
  datasets: [{
    label: '売上高（万円）',
    data: [150, 220, 180, 250, 300, 280],
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    tension: 0.4
  }]
}

const nftSalesData = {
  labels: ['デジタルアート', '写真作品', '3Dモデル', 'アニメーション', 'ミュージック'],
  datasets: [{
    label: '販売数',
    data: [45, 32, 28, 19, 15],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)'
    ],
    borderWidth: 1
  }]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  }
}

// 生産者管理
const selectedProducer = ref(null)
const editingProducer = ref(null)

const handleEditProducer = (producer) => {
  editingProducer.value = { ...producer }
}

const handleSaveProducer = () => {
  if (!editingProducer.value) return
  
  const index = producersStore.producers.findIndex(p => p.id === editingProducer.value.id)
  if (index !== -1) {
    producersStore.producers[index] = { ...editingProducer.value }
  }
  
  editingProducer.value = null
}

// ユーザー管理
const selectedUser = ref(null)

const handleUserRoleChange = (userId, newRole) => {
  const user = usersStore.getUserById(userId)
  if (user) {
    user.role = newRole
  }
}

// 設定
const settings = ref({
  siteName: 'CTCマーケット',
  maintenance: false,
  allowNewUsers: true,
  allowNewListings: true
})

onMounted(() => {
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- ダッシュボード -->
      <div v-if="currentSection === 'dashboard'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            NFT売上推移
          </h2>
          <div class="h-80">
            <Line :data="salesData" :options="chartOptions" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            カテゴリー別販売数
          </h2>
          <div class="h-80">
            <Bar :data="nftSalesData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- 生産者管理 -->
      <div v-else-if="currentSection === 'producers'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            生産者一覧
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    名前
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    場所
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    認証
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="producer in producersStore.producers" :key="producer.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img
                          :src="producer.image"
                          :alt="producer.name"
                          class="h-10 w-10 rounded-full object-cover"
                        />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ producer.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {{ producer.location }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="cert in producer.certifications"
                        :key="cert"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        {{ cert }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click="handleEditProducer(producer)"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      編集
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ユーザー管理 -->
      <div v-else-if="currentSection === 'users'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            ユーザー一覧
          </h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    メールアドレス
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    ロール
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    登録日
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in usersStore.users" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <select
                      v-model="user.role"
                      class="text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      @change="handleUserRoleChange(user.id, $event.target.value)"
                    >
                      <option value="user">一般ユーザー</option>
                      <option value="producer">生産者</option>
                      <option value="admin">管理者</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {{ new Date(user.created_at).toLocaleDateString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click="selectedUser = user"
                      class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 設定 -->
      <div v-else-if="currentSection === 'settings'" class="space-y-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            システム設定
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                サイト名
              </label>
              <input
                v-model="settings.siteName"
                type="text"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div class="flex items-center">
              <input
                v-model="settings.maintenance"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                メンテナンスモード
              </label>
            </div>

            <div class="flex items-center">
              <input
                v-model="settings.allowNewUsers"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                新規ユーザー登録を許可
              </label>
            </div>

            <div class="flex items-center">
              <input
                v-model="settings.allowNewListings"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900 dark:text-white">
                新規出品を許可
              </label>
            </div>

            <button
              class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              設定を保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```