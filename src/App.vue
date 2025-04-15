<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import BottomNav from './components/layout/BottomNav.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
    <BottomNav />
  </div>
</template>