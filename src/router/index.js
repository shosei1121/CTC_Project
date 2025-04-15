import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '../views/Home.vue'
import Marketplace from '../views/Marketplace.vue'
import ProductDetails from '../views/ProductDetails.vue'
import Profile from '../views/Profile.vue'
import Auth from '../views/Auth.vue'
import Tools from '../views/Tools.vue'
import Payment from '../views/Payment.vue'
import PaymentConfirm from '../views/PaymentConfirm.vue'
import PaymentComplete from '../views/PaymentComplete.vue'
import CreditCardForm from '../views/CreditCardForm.vue'
import ProducerDetails from '../views/ProducerDetails.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import ProducerDashboard from '../views/producer/ProducerDashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/marketplace',
      name: 'marketplace',
      component: Marketplace
    },
    {
      path: '/product/:id',
      name: 'product-details',
      component: ProductDetails
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
    {
      path: '/tools',
      name: 'tools',
      component: Tools
    },
    {
      path: '/payment/:id',
      name: 'payment',
      component: Payment,
      meta: { requiresAuth: true }
    },
    {
      path: '/payment/:id/credit-card',
      name: 'credit-card',
      component: CreditCardForm,
      meta: { requiresAuth: true }
    },
    {
      path: '/payment/:id/confirm',
      name: 'payment-confirm',
      component: PaymentConfirm,
      meta: { requiresAuth: true }
    },
    {
      path: '/payment/:id/complete',
      name: 'payment-complete',
      component: PaymentComplete,
      meta: { requiresAuth: true }
    },
    {
      path: '/producer/:id',
      name: 'producer-details',
      component: ProducerDetails
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAdmin: true }
    },
    {
      path: '/producer/dashboard',
      name: 'producer-dashboard',
      component: ProducerDashboard,
      meta: { requiresProducer: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/admin/login')
  } else if (to.meta.requiresProducer && !authStore.isProducer) {
    next('/auth')
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    authStore.setReturnPath(to.fullPath)
    next('/auth')
  } else if (to.path === '/auth' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router